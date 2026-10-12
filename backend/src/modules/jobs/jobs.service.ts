import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Job, JobTimelineEvent } from './entities/job.entity.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { AcceptJobDto } from './dto/accept-job.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { EscalateJobDto } from './dto/escalate-job.dto.js';
import { JobStatus, ProviderStatus } from '../../common/enums/index.js';
import { JobStateMachine } from './state-machine/job-state-machine.js';
import { CasesService } from '../cases/cases.service.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { ProvidersService } from '../providers/providers.service.js';
import { DispatchService } from '../dispatch/dispatch.service.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();

  constructor(
    private readonly casesService: CasesService,
    private readonly vehiclesService: VehiclesService,
    private readonly catalogService: CatalogService,
    private readonly providersService: ProvidersService,
    private readonly dispatchService: DispatchService,
  ) {}

  async create(dto: CreateJobDto): Promise<{ job: Job; dispatchResult: any }> {
    const serviceCase = this.casesService.findById(dto.caseId);
    const vehicle = this.vehiclesService.findById(serviceCase.vehicleId);
    const serviceItem = this.catalogService.findById(dto.serviceId);

    // Verify compatibility
    if (!serviceItem.compatibleVehicleCategories.includes(vehicle.category)) {
      throw new BadRequestException(
        `Service '${serviceItem.name}' is not compatible with vehicle category '${vehicle.category}'.`,
      );
    }

    // Generate 4-digit OTP for arrival & service handshake
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const initialTimeline: JobTimelineEvent[] = [
      {
        status: JobStatus.CREATED,
        timestamp: new Date(),
        note: 'Incident job registered',
      },
    ];

    const job: Job = {
      id: `job_${randomUUID().substring(0, 8)}`,
      caseId: serviceCase.id,
      serviceId: serviceItem.id,
      serviceName: serviceItem.name,
      category: serviceItem.category,
      status: JobStatus.CREATED,
      quoteAmount: serviceItem.basePrice,
      otp,
      timeline: initialTimeline,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(job.id, job);

    // Link job to parent ServiceCase
    this.casesService.addJobToCase(serviceCase.id, job.id);

    // Transition to SEARCHING
    JobStateMachine.validateTransition(job.status, JobStatus.SEARCHING);
    job.status = JobStatus.SEARCHING;
    job.timeline.push({
      status: JobStatus.SEARCHING,
      timestamp: new Date(),
      note: '5-by-5 Dispatch Engine initiated',
    });

    // Run 5-by-5 Dispatch Runtime
    const dispatchResult = this.dispatchService.initiateDispatch(
      job.id,
      serviceCase.id,
      serviceCase.location.latitude,
      serviceCase.location.longitude,
      serviceItem.requiredSkills,
      vehicle.category,
    );

    if (dispatchResult.exhausted) {
      // No eligible providers in proximity
      JobStateMachine.validateTransition(job.status, JobStatus.NO_PROVIDER);
      job.status = JobStatus.NO_PROVIDER;
      job.timeline.push({
        status: JobStatus.NO_PROVIDER,
        timestamp: new Date(),
        note: 'All provider batches exhausted. Partner escalation required.',
      });
    }

    job.updatedAt = new Date();
    return { job, dispatchResult };
  }

  findAll(): Job[] {
    return Array.from(this.jobs.values());
  }

  findById(id: string): Job {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }
    return job;
  }

  findByCaseId(caseId: string): Job[] {
    return Array.from(this.jobs.values()).filter((j) => j.caseId === caseId);
  }

  /**
   * Atomic Provider Acceptance
   */
  async accept(id: string, dto: AcceptJobDto): Promise<Job> {
    const job = this.findById(id);

    // Verify atomic claim with Dispatch Engine (mutex + CAS)
    await this.dispatchService.attemptClaim(id, dto.providerId, () => job.status);

    JobStateMachine.validateTransition(job.status, JobStatus.ASSIGNED);
    job.status = JobStatus.ASSIGNED;
    job.providerId = dto.providerId;
    job.timeline.push({
      status: JobStatus.ASSIGNED,
      timestamp: new Date(),
      note: `Claim won and assigned to provider ${dto.providerId}`,
    });
    job.updatedAt = new Date();

    return job;
  }

  updateEnRoute(id: string, providerId: string): Job {
    const job = this.findById(id);
    if (job.providerId !== providerId) {
      throw new ForbiddenException('Only the assigned provider can update transit status.');
    }

    JobStateMachine.validateTransition(job.status, JobStatus.EN_ROUTE);
    job.status = JobStatus.EN_ROUTE;
    job.timeline.push({
      status: JobStatus.EN_ROUTE,
      timestamp: new Date(),
      note: 'Provider is en route to breakdown location',
    });
    job.updatedAt = new Date();
    return job;
  }

  updateArrived(id: string, providerId: string): Job {
    const job = this.findById(id);
    if (job.providerId !== providerId) {
      throw new ForbiddenException('Only the assigned provider can mark arrival.');
    }

    JobStateMachine.validateTransition(job.status, JobStatus.ARRIVED);
    job.status = JobStatus.ARRIVED;
    job.timeline.push({
      status: JobStatus.ARRIVED,
      timestamp: new Date(),
      note: 'Provider arrived on scene. Awaiting customer OTP verification.',
    });
    job.updatedAt = new Date();
    return job;
  }

  startService(id: string, providerId: string, dto: VerifyOtpDto): Job {
    const job = this.findById(id);
    if (job.providerId !== providerId) {
      throw new ForbiddenException('Only the assigned provider can start service.');
    }

    // OTP validation per Section 4 & 13 of Blueprint
    if (job.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP. Customer verification handshake failed.');
    }

    JobStateMachine.validateTransition(job.status, JobStatus.SERVICE_STARTED);
    job.status = JobStatus.SERVICE_STARTED;
    job.timeline.push({
      status: JobStatus.SERVICE_STARTED,
      timestamp: new Date(),
      note: 'OTP verified. Service execution underway.',
    });
    job.updatedAt = new Date();
    return job;
  }

  completeService(id: string, providerId: string): Job {
    const job = this.findById(id);
    if (job.providerId !== providerId) {
      throw new ForbiddenException('Only the assigned provider can complete service.');
    }

    JobStateMachine.validateTransition(job.status, JobStatus.COMPLETED);
    job.status = JobStatus.COMPLETED;
    job.timeline.push({
      status: JobStatus.COMPLETED,
      timestamp: new Date(),
      note: 'Service successfully delivered. Ready for payment settlement.',
    });
    job.updatedAt = new Date();

    // Release provider back to ONLINE
    this.providersService.updateStatus(providerId, ProviderStatus.ONLINE);

    return job;
  }

  cancel(id: string, reason?: string): Job {
    const job = this.findById(id);
    JobStateMachine.validateTransition(job.status, JobStatus.CANCELLED);
    job.status = JobStatus.CANCELLED;
    job.cancellationReason = reason ?? 'Cancelled by user or system policy';
    job.timeline.push({
      status: JobStatus.CANCELLED,
      timestamp: new Date(),
      note: `Cancelled: ${job.cancellationReason}`,
    });
    job.updatedAt = new Date();

    if (job.providerId) {
      this.providersService.updateStatus(job.providerId, ProviderStatus.ONLINE);
    }

    return job;
  }

  /**
   * Escalation: spawn linked downstream job under same service case
   * (e.g. roadside repair cannot resolve on-site -> creates linked towing job)
   */
  async escalate(id: string, dto: EscalateJobDto): Promise<{ originalJob: Job; newJob: Job }> {
    const originalJob = this.findById(id);

    // If original job is still in progress, complete or wrap it
    if (originalJob.status === JobStatus.SERVICE_STARTED || originalJob.status === JobStatus.ARRIVED) {
      originalJob.timeline.push({
        status: originalJob.status,
        timestamp: new Date(),
        note: `Escalated incident to downstream job (${dto.newServiceId})`,
      });
    }

    const { job: newJob } = await this.create({
      caseId: originalJob.caseId,
      serviceId: dto.newServiceId,
    });

    return { originalJob, newJob };
  }
}
