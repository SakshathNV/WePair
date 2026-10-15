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
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @CurrentUser() currentUser: any,
  ) {
    // Non-admin users can only create vehicles for their own account
    if (currentUser.role !== UserRole.ADMIN) {
      createVehicleDto.ownerId = currentUser.id;
    }
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: any,
    @Query('ownerId') ownerId?: string,
  ) {
    // Customers can only see their own vehicles
    if (currentUser.role !== UserRole.ADMIN) {
      return this.vehiclesService.findByOwnerId(currentUser.id);
    }
    if (ownerId) {
      return this.vehiclesService.findByOwnerId(ownerId);
    }
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const vehicle = await this.vehiclesService.findById(id);
    if (
      vehicle.ownerId !== currentUser.id &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Access denied. You do not own this registered vehicle.',
      );
    }
    return vehicle;
  }
}
