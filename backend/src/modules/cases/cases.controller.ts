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
import { CasesService } from './cases.service.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { CancelCaseDto } from './dto/cancel-case.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(
    @Body() createCaseDto: CreateCaseDto,
    @CurrentUser() currentUser: any,
  ) {
    // Non-admin customers can only create cases for themselves
    if (currentUser.role !== UserRole.ADMIN) {
      createCaseDto.customerId = currentUser.id;
    }
    return this.casesService.create(createCaseDto);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: any,
    @Query('customerId') customerId?: string,
  ) {
    // Customers can only see their own breakdown cases
    if (currentUser.role === UserRole.CUSTOMER) {
      return this.casesService.findByCustomerId(currentUser.id);
    }
    if (customerId) {
      return this.casesService.findByCustomerId(customerId);
    }
    return this.casesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const serviceCase = await this.casesService.findById(id);

    // BOLA/IDOR check: customers can only view their own incidents
    if (
      currentUser.role === UserRole.CUSTOMER &&
      serviceCase.customerId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You do not have authorization to view this service incident.',
      );
    }

    return serviceCase;
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelCaseDto: CancelCaseDto,
    @CurrentUser() currentUser: any,
  ) {
    const serviceCase = await this.casesService.findById(id);

    // Only owner of the case or admin can cancel the breakdown case
    if (
      currentUser.role !== UserRole.ADMIN &&
      serviceCase.customerId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You are not authorized to cancel this incident.',
      );
    }

    return this.casesService.cancelCase(id, cancelCaseDto.reason);
  }
}
