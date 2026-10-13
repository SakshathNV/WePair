import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ServiceItem, ServiceItemDocument } from './schemas/service-item.schema.js';
import { ServiceCategory, VehicleCategory, FuelType } from '../../common/enums/index.js';

@Injectable()
export class CatalogService implements OnModuleInit {
  private readonly defaultCatalog: Partial<ServiceItem>[] = [
    {
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
      basePrice: 299,
      estimatedDurationMinutes: 35,
    },
    {
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

  constructor(
    @InjectModel(ServiceItem.name) private readonly catalogModel: Model<ServiceItemDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.catalogModel.countDocuments();
    if (count === 0) {
      await this.catalogModel.insertMany(this.defaultCatalog);
    }
  }

  async findAll(): Promise<ServiceItem[]> {
    return this.catalogModel.find().exec();
  }

  async findById(idOrCode: string): Promise<ServiceItem> {
    const isObjectId = Types.ObjectId.isValid(idOrCode);
    const query = isObjectId
      ? { $or: [{ _id: idOrCode }, { code: idOrCode }] }
      : { code: idOrCode };

    const item = await this.catalogModel.findOne(query).exec();
    if (!item) {
      throw new NotFoundException(`Service item '${idOrCode}' not found in catalog`);
    }
    return item;
  }

  async findByCategory(category: ServiceCategory): Promise<ServiceItem[]> {
    return this.catalogModel.find({ category }).exec();
  }

  async findEligibleServices(vehicleCategory: VehicleCategory, fuelType: FuelType): Promise<ServiceItem[]> {
    return this.catalogModel
      .find({
        compatibleVehicleCategories: vehicleCategory,
        compatibleFuelTypes: fuelType,
      })
      .exec();
  }
}
