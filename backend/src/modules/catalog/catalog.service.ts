import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceItem } from './entities/service-item.entity.js';
import { ServiceCategory, VehicleCategory, FuelType } from '../../common/enums/index.js';

@Injectable()
export class CatalogService {
  private readonly catalog: ServiceItem[] = [
    {
      id: 'srv-roadside-jumpstart',
      code: 'BATTERY_JUMPSTART',
      name: 'Battery Jump Start',
      description: 'On-site vehicle battery boost and electrical jump start',
      category: ServiceCategory.ROADSIDE_ASSISTANCE,
      repairCategory: 'BATTERY',
      requiredSkills: ['jumpstart', 'electrical_check'],
      compatibleVehicleCategories: [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.TWO_WHEELER,
        VehicleCategory.COMMERCIAL,
      ],
      compatibleFuelTypes: [FuelType.PETROL, FuelType.DIESEL, FuelType.CNG, FuelType.HYBRID],
      basePrice: 499,
      estimatedDurationMinutes: 30,
    },
    {
      id: 'srv-roadside-puncture',
      code: 'TYRE_PUNCTURE',
      name: 'Flat Tyre & Puncture Repair',
      description: 'On-demand roadside tubeless puncture repair or spare tyre swap',
      category: ServiceCategory.ROADSIDE_ASSISTANCE,
      repairCategory: 'TYRE',
      requiredSkills: ['puncture_repair', 'tyre_replacement'],
      compatibleVehicleCategories: [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.TWO_WHEELER,
        VehicleCategory.COMMERCIAL,
        VehicleCategory.EV,
      ],
      compatibleFuelTypes: Object.values(FuelType),
      basePrice: 399,
      estimatedDurationMinutes: 25,
    },
    {
      id: 'srv-fuel-delivery',
      code: 'EMERGENCY_FUEL',
      name: 'Emergency Fuel Assistance',
      description: 'Authorized roadside fuel delivery dispatch (partner fulfilled)',
      category: ServiceCategory.FUEL_ASSISTANCE,
      repairCategory: 'FUEL',
      requiredSkills: ['fuel_delivery', 'safety_certified'],
      compatibleVehicleCategories: [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.TWO_WHEELER,
        VehicleCategory.COMMERCIAL,
      ],
      compatibleFuelTypes: [FuelType.PETROL, FuelType.DIESEL],
      basePrice: 299, // Delivery charge + fuel cost calculated dynamically
      estimatedDurationMinutes: 35,
    },
    {
      id: 'srv-towing-flatbed',
      code: 'TOWING_FLATBED',
      name: 'Flatbed Towing Service',
      description: 'Safe flatbed towing for luxury cars, EVs, and immobilized vehicles',
      category: ServiceCategory.TOWING,
      repairCategory: 'TOWING',
      requiredSkills: ['flatbed_towing', 'vehicle_recovery'],
      compatibleVehicleCategories: [VehicleCategory.CAR, VehicleCategory.SUV, VehicleCategory.EV],
      compatibleFuelTypes: Object.values(FuelType),
      basePrice: 1499,
      estimatedDurationMinutes: 60,
    },
    {
      id: 'srv-towing-hydraulic',
      code: 'TOWING_HYDRAULIC',
      name: 'Hydraulic Towing & Winch Recovery',
      description: 'Under-lift hydraulic towing and ditch/accident recovery',
      category: ServiceCategory.TOWING,
      repairCategory: 'TOWING',
      requiredSkills: ['hydraulic_towing', 'winch_recovery'],
      compatibleVehicleCategories: [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.COMMERCIAL,
      ],
      compatibleFuelTypes: Object.values(FuelType),
      basePrice: 1199,
      estimatedDurationMinutes: 45,
    },
    {
      id: 'srv-workshop-inspection',
      code: 'WORKSHOP_INSPECTION',
      name: 'Full Workshop Diagnostic & Inspection',
      description: 'Comprehensive computerised vehicle inspection and mechanical diagnostics',
      category: ServiceCategory.WORKSHOP,
      repairCategory: 'ENGINE',
      requiredSkills: ['obd_diagnostics', 'engine_overhaul'],
      compatibleVehicleCategories: Object.values(VehicleCategory),
      compatibleFuelTypes: Object.values(FuelType),
      basePrice: 999,
      estimatedDurationMinutes: 90,
    },
  ];

  findAll(): ServiceItem[] {
    return this.catalog;
  }

  findById(id: string): ServiceItem {
    const item = this.catalog.find((s) => s.id === id || s.code === id);
    if (!item) {
      throw new NotFoundException(`Service item with id or code '${id}' not found in catalog`);
    }
    return item;
  }

  findByCategory(category: ServiceCategory): ServiceItem[] {
    return this.catalog.filter((s) => s.category === category);
  }

  findEligibleServices(vehicleCategory: VehicleCategory, fuelType: FuelType): ServiceItem[] {
    return this.catalog.filter(
      (s) =>
        s.compatibleVehicleCategories.includes(vehicleCategory) &&
        s.compatibleFuelTypes.includes(fuelType),
    );
  }
}
