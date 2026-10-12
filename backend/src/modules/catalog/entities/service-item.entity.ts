import { ServiceCategory, VehicleCategory, FuelType } from '../../../common/enums/index.js';

export class ServiceItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: ServiceCategory;
  repairCategory: string; // e.g. 'TYRE', 'BATTERY', 'ELECTRICAL', 'ENGINE', 'TOWING', 'FUEL'
  requiredSkills: string[];
  compatibleVehicleCategories: VehicleCategory[];
  compatibleFuelTypes: FuelType[];
  basePrice: number;
  estimatedDurationMinutes: number;
}
