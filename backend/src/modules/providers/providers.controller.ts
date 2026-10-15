import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(
    @Body() createProviderDto: CreateProviderDto,
    @CurrentUser() currentUser: any,
  ) {
    // Non-admin can only register a provider profile for their own authenticated user
    if (currentUser.role !== UserRole.ADMIN) {
      createProviderDto.userId = currentUser.id;
    }
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.providersService.findById(id);
  }

  @Post(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentUser() currentUser: any,
  ) {
    const provider = await this.providersService.findById(id);
    if (
      currentUser.role !== UserRole.ADMIN &&
      provider.userId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You are only authorized to update your own provider location.',
      );
    }
    return this.providersService.updateLocation(id, updateLocationDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() currentUser: any,
  ) {
    const provider = await this.providersService.findById(id);
    if (
      currentUser.role !== UserRole.ADMIN &&
      provider.userId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You are only authorized to update your own operational status.',
      );
    }
    return this.providersService.updateStatus(id, updateStatusDto.status);
  }
}
