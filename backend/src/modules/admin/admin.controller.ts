import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('verifications/pending')
  getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Patch('verifications/:providerId/approve')
  approveProvider(@Param('providerId') providerId: string) {
    return this.adminService.verifyProvider(providerId);
  }

  @Get('jobs/recent')
  getRecentJobs(@Query('limit') limit?: string) {
    return this.adminService.getRecentJobs(limit ? parseInt(limit, 10) : 20);
  }

  @Get('payments/recent')
  getRecentPayments(@Query('limit') limit?: string) {
    return this.adminService.getRecentPayments(limit ? parseInt(limit, 10) : 20);
  }

  @Post('jobs/:jobId/override-assign')
  overrideAssign(
    @Param('jobId') jobId: string,
    @Body('providerId') providerId: string,
  ) {
    return this.adminService.overrideAssign(jobId, providerId);
  }
}
