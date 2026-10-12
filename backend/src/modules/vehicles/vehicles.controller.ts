import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';

@Controller('v1/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll(@Query('ownerId') ownerId?: string) {
    if (ownerId) {
      return this.vehiclesService.findByOwnerId(ownerId);
    }
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }
}
