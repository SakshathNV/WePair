import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';
import { ServiceCategory, VehicleCategory, FuelType } from '../../common/enums/index.js';

@Controller('v1/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getAllServices() {
    return this.catalogService.findAll();
  }

  @Get('category/:category')
  getByCategory(@Param('category') category: ServiceCategory) {
    return this.catalogService.findByCategory(category);
  }

  @Get('eligible')
  getEligible(
    @Query('vehicleCategory') vehicleCategory: VehicleCategory,
    @Query('fuelType') fuelType: FuelType,
  ) {
    return this.catalogService.findEligibleServices(vehicleCategory, fuelType);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.catalogService.findById(id);
  }
}
