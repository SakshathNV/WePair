import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument, JobTimelineEvent } from './schemas/job.schema.js';
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

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    private readonly casesService: CasesService,
    private readonly vehiclesService: VehiclesService,
    private readonly catalogService: CatalogService,
    private readonly providersService: ProvidersService,
    private readonly dispatchService: DispatchService,
  ) {}

  async create(dto: CreateJobDto): Promise<{ job: Job; dispatchResult: any }> {
    const serviceCase = await this.casesService.findById(dto.caseId);
    const vehicle = await this.vehiclesService.findById(serviceCase.vehicleId);
    const serviceItem = await this.catalogService.findById(dto.serviceId);

    // Verify vehicle category compatibility
    if (!serviceItem.compatibleVehicleCategories.includes(vehicle.category)) {
      throw new BadRequestException(
        `Service '${serviceItem.name}' is not compatible with vehicle category '${vehicle.category}'.`,
      );
    }

    // Generate 4-digit verification OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const initialTimeline: JobTimelineEvent[] = [
      {
        status: JobStatus.CREATED,
        timestamp: new Date(),
        note: 'Incident job registered in durable state',
      },
      {
        status: JobStatus.SEARCHING,
        timestamp: new Date(),
        note: '5-by-5 Dispatch Engine initiated',
      },
    ];

    const job = new this.jobModel({
      caseId: (serviceCase as any).id || (serviceCase as any)._id.toString(),
      serviceId: (serviceItem as any).id || (serviceItem as any)._id.toString(),
      serviceName: serviceItem.name,
      category: serviceItem.category,
      status: JobStatus.SEARCHING,
      quoteAmount: serviceItem.basePrice,
      otp,
      timeline: initialTimeline,
    });

    const savedJob = await job.save();
    const jobId = (savedJob as any).id || (savedJob as any)._id.toString();

    // Link job to parent ServiceCase
    await this.casesService.addJobToCase((serviceCase as any).id || (serviceCase as any)._id.toString(), jobId);

    // Run 5-by-5 Dispatch Engine
    const dispatchResult = await this.dispatchService.initiateDispatch(
      jobId,
      (serviceCase as any).id || (serviceCase as any)._id.toString(),
      serviceCase.location.latitude,
      serviceCase.location.longitude,
      serviceItem.requiredSkills,
      vehicle.category,
    );

    if (dispatchResult.exhausted) {
      savedJob.status = JobStatus.NO_PROVIDER;
      savedJob.timeline.push({
        status: JobStatus.NO_PROVIDER,
        timestamp: new Date(),
        note: 'All provider batches exhausted. Partner escalation required.',
      });
      await savedJob.save();
    }

    return { job: savedJob, dispatchResult };
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }
    return job;
  }

  async findByCaseId(caseId: string): Promise<Job[]> {
    return this.jobModel.find({ caseId }).exec();
  }

  /**
   * Atomic Provider Acceptance
   */
  async accept(id: string, dto: AcceptJobDto): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

    // Verify atomic claim with Dispatch Engine (mutex + CAS)
    await this.dispatchService.attemptClaim(id, dto.providerId, async () => job.status);

    JobStateMachine.validateTransition(job.status, JobStatus.ASSIGNED);
    job.status = JobStatus.ASSIGNED;
    job.providerId = dto.providerId;
    job.timeline.push({
      status: JobStatus.ASSIGNED,
      timestamp: new Date(),
      note: `Claim won and assigned to provider ${dto.providerId}`,
    });

    return job.save();
  }

  async updateEnRoute(id: string, providerId: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

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

    return job.save();
  }

  async updateArrived(id: string, providerId: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

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

    return job.save();
  }

  async startService(id: string, providerId: string, dto: VerifyOtpDto): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

    if (job.providerId !== providerId) {
      throw new ForbiddenException('Only the assigned provider can start service.');
    }

    // OTP validation per Blueprint Section 4 & 13
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

    return job.save();
  }

  async completeService(id: string, providerId: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

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

    const saved = await job.save();

    // Release provider back to ONLINE in database
    await this.providersService.updateStatus(providerId, ProviderStatus.ONLINE);

    return saved;
  }

  async cancel(id: string, reason?: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

    JobStateMachine.validateTransition(job.status, JobStatus.CANCELLED);
    job.status = JobStatus.CANCELLED;
    job.cancellationReason = reason ?? 'Cancelled by user or system policy';
    job.timeline.push({
      status: JobStatus.CANCELLED,
      timestamp: new Date(),
      note: `Cancelled: ${job.cancellationReason}`,
    });

    const saved = await job.save();

    if (job.providerId) {
      await this.providersService.updateStatus(job.providerId, ProviderStatus.ONLINE);
    }

    return saved;
  }

  /**
   * Escalation: spawn linked downstream job under same service case
   * (e.g. roadside repair cannot resolve on-site -> creates linked towing job)
   */
  async escalate(id: string, dto: EscalateJobDto): Promise<{ originalJob: Job; newJob: Job }> {
    const originalJob = await this.jobModel.findById(id).exec();
    if (!originalJob) {
      throw new NotFoundException(`Job with id '${id}' not found`);
    }

    if (originalJob.status === JobStatus.SERVICE_STARTED || originalJob.status === JobStatus.ARRIVED) {
      originalJob.timeline.push({
        status: originalJob.status,
        timestamp: new Date(),
        note: `Escalated incident to downstream job (${dto.newServiceId})`,
      });
      await originalJob.save();
    }

    const { job: newJob } = await this.create({
      caseId: originalJob.caseId,
      serviceId: dto.newServiceId,
    });

    return { originalJob, newJob };
  }
}
