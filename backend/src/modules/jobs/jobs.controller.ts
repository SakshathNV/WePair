import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { AcceptJobDto } from './dto/accept-job.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { CancelJobDto } from './dto/cancel-job.dto.js';
import { EscalateJobDto } from './dto/escalate-job.dto.js';

@Controller('v1/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll(@Query('caseId') caseId?: string) {
    if (caseId) {
      return this.jobsService.findByCaseId(caseId);
    }
    return this.jobsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Body() acceptJobDto: AcceptJobDto) {
    return this.jobsService.accept(id, acceptJobDto);
  }

  @Post(':id/en-route')
  updateEnRoute(@Param('id') id: string, @Body('providerId') providerId: string) {
    return this.jobsService.updateEnRoute(id, providerId);
  }

  @Post(':id/arrived')
  updateArrived(@Param('id') id: string, @Body('providerId') providerId: string) {
    return this.jobsService.updateArrived(id, providerId);
  }

  @Post(':id/start')
  startService(
    @Param('id') id: string,
    @Body('providerId') providerId: string,
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    return this.jobsService.startService(id, providerId, verifyOtpDto);
  }

  @Post(':id/complete')
  completeService(@Param('id') id: string, @Body('providerId') providerId: string) {
    return this.jobsService.completeService(id, providerId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() cancelJobDto: CancelJobDto) {
    return this.jobsService.cancel(id, cancelJobDto.reason);
  }

  @Post(':id/escalate')
  escalate(@Param('id') id: string, @Body() escalateJobDto: EscalateJobDto) {
    return this.jobsService.escalate(id, escalateJobDto);
  }
}
