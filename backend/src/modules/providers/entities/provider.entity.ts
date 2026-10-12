import { ProviderStatus, VehicleCategory } from '../../../common/enums/index.js';
import { GeoLocation } from '../../../common/interfaces/location.interface.js';

export class Provider {
  id: string;
  userId: string;
  name: string;
  phone: string;
  skills: string[];
  supportedVehicleCategories: VehicleCategory[];
  status: ProviderStatus;
  isVerified: boolean;
  location?: GeoLocation;
  rating: number; // e.g. 4.8
  totalJobsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}
