import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Controller('v1/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
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
  updateLocation(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.providersService.updateLocation(id, updateLocationDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.providersService.updateStatus(id, updateStatusDto.status);
  }
}
