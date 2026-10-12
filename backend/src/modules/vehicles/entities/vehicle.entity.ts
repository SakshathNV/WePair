import { VehicleCategory, FuelType } from '../../../common/enums/index.js';

export class Vehicle {
  id: string;
  ownerId: string;
  category: VehicleCategory;
  fuelType: FuelType;
  make: string;
  model: string;
  registrationNumber: string;
  year?: number;
  createdAt: Date;
  updatedAt: Date;
}
