import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { ProvidersService } from '../providers/providers.service.js';
import { CasesService } from '../cases/cases.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { AcceptJobDto } from './dto/accept-job.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { CancelJobDto } from './dto/cancel-job.dto.js';
import { EscalateJobDto } from './dto/escalate-job.dto.js';
import { UpdateJobTransitDto } from './dto/update-transit.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly providersService: ProvidersService,
    private readonly casesService: CasesService,
  ) {}

  private async resolveProviderId(
    currentUser: any,
    requestedProviderId?: string,
  ): Promise<string> {
    if (currentUser.role === UserRole.ADMIN && requestedProviderId) {
      return requestedProviderId;
    }
    const provider = await this.providersService.findByUserId(currentUser.id);
    if (!provider) {
      throw new ForbiddenException(
        'Access denied. No active provider profile found for your authenticated account.',
      );
    }
    return (provider as any).id || (provider as any)._id.toString();
  }

  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.role !== UserRole.ADMIN) {
      const serviceCase = await this.casesService.findById(createJobDto.caseId);
      if (serviceCase.customerId !== currentUser.id) {
        throw new ForbiddenException(
          'Access denied. You can only request assistance for your own service incident.',
        );
      }
    }
    return this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: any,
    @Query('caseId') caseId?: string,
  ) {
    if (currentUser.role === UserRole.CUSTOMER) {
      if (caseId) {
        const serviceCase = await this.casesService.findById(caseId);
        if (serviceCase.customerId !== currentUser.id) {
          throw new ForbiddenException(
            'Access denied. You do not have permission to view jobs for this case.',
          );
        }
        return this.jobsService.findByCaseId(caseId);
      }
      const customerCases = await this.casesService.findByCustomerId(currentUser.id);
      const caseIds = new Set(
        customerCases.map((c: any) => c.id || c._id.toString()),
      );
      const allJobs = await this.jobsService.findAll();
      return allJobs.filter((j: any) => caseIds.has(j.caseId));
    }

    if (currentUser.role === UserRole.PROVIDER) {
      const provider = await this.providersService.findByUserId(currentUser.id);
      const providerId = provider
        ? (provider as any).id || (provider as any)._id?.toString()
        : null;
      if (!providerId) return [];
      const allJobs = await this.jobsService.findAll();
      return allJobs.filter(
        (j: any) => j.providerId === providerId || j.status === 'SEARCHING',
      );
    }

    // ADMIN
    if (caseId) {
      return this.jobsService.findByCaseId(caseId);
    }
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const job = await this.jobsService.findById(id);

    if (currentUser.role === UserRole.ADMIN) {
      return job;
    }

    if (currentUser.role === UserRole.CUSTOMER) {
      const serviceCase = await this.casesService.findById(job.caseId);
      if (serviceCase.customerId !== currentUser.id) {
        throw new ForbiddenException(
          'Access denied. You do not have permission to view this job.',
        );
      }
      return job;
    }

    if (currentUser.role === UserRole.PROVIDER) {
      const provider = await this.providersService.findByUserId(currentUser.id);
      const providerId = provider
        ? (provider as any).id || (provider as any)._id?.toString()
        : null;
      if (
        !providerId ||
        (job.providerId && job.providerId !== providerId && job.status !== 'SEARCHING')
      ) {
        throw new ForbiddenException(
          'Access denied. You are not assigned to this job.',
        );
      }
      return job;
    }

    return job;
  }

  @Post(':id/accept')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  async accept(
    @Param('id') id: string,
    @Body() acceptJobDto: AcceptJobDto,
    @CurrentUser() currentUser: any,
  ) {
    const providerId = await this.resolveProviderId(
      currentUser,
      acceptJobDto.providerId,
    );
    acceptJobDto.providerId = providerId;
    return this.jobsService.accept(id, acceptJobDto);
  }

  @Post(':id/en-route')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  async updateEnRoute(
    @Param('id') id: string,
    @Body() dto: UpdateJobTransitDto,
    @CurrentUser() currentUser: any,
  ) {
    const providerId = await this.resolveProviderId(currentUser, dto?.providerId);
    return this.jobsService.updateEnRoute(id, providerId);
  }

  @Post(':id/arrived')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  async updateArrived(
    @Param('id') id: string,
    @Body() dto: UpdateJobTransitDto,
    @CurrentUser() currentUser: any,
  ) {
    const providerId = await this.resolveProviderId(currentUser, dto?.providerId);
    return this.jobsService.updateArrived(id, providerId);
  }

  @Post(':id/start')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  async startService(
    @Param('id') id: string,
    @Body() verifyOtpDto: VerifyOtpDto,
    @CurrentUser() currentUser: any,
  ) {
    const providerId = await this.resolveProviderId(
      currentUser,
      verifyOtpDto?.providerId,
    );
    return this.jobsService.startService(id, providerId, verifyOtpDto);
  }

  @Post(':id/complete')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  async completeService(
    @Param('id') id: string,
    @Body() dto: UpdateJobTransitDto,
    @CurrentUser() currentUser: any,
  ) {
    const providerId = await this.resolveProviderId(currentUser, dto?.providerId);
    return this.jobsService.completeService(id, providerId);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelJobDto: CancelJobDto,
    @CurrentUser() currentUser: any,
  ) {
    const job = await this.jobsService.findById(id);

    if (currentUser.role !== UserRole.ADMIN) {
      let authorized = false;
      if (currentUser.role === UserRole.CUSTOMER) {
        const serviceCase = await this.casesService.findById(job.caseId);
        if (serviceCase.customerId === currentUser.id) authorized = true;
      } else if (currentUser.role === UserRole.PROVIDER) {
        const provider = await this.providersService.findByUserId(currentUser.id);
        const providerId = provider
          ? (provider as any).id || (provider as any)._id?.toString()
          : null;
        if (providerId && job.providerId === providerId) authorized = true;
      }

      if (!authorized) {
        throw new ForbiddenException(
          'Access denied. You do not have permission to cancel this job.',
        );
      }
    }

    return this.jobsService.cancel(id, cancelJobDto.reason);
  }

  @Post(':id/escalate')
  async escalate(
    @Param('id') id: string,
    @Body() escalateJobDto: EscalateJobDto,
    @CurrentUser() currentUser: any,
  ) {
    const job = await this.jobsService.findById(id);

    if (currentUser.role !== UserRole.ADMIN) {
      let authorized = false;
      if (currentUser.role === UserRole.CUSTOMER) {
        const serviceCase = await this.casesService.findById(job.caseId);
        if (serviceCase.customerId === currentUser.id) authorized = true;
      } else if (currentUser.role === UserRole.PROVIDER) {
        const provider = await this.providersService.findByUserId(currentUser.id);
        const providerId = provider
          ? (provider as any).id || (provider as any)._id?.toString()
          : null;
        if (providerId && job.providerId === providerId) authorized = true;
      }

      if (!authorized) {
        throw new ForbiddenException(
          'Access denied. You do not have permission to escalate this job.',
        );
      }
    }

    return this.jobsService.escalate(id, escalateJobDto);
  }
}
