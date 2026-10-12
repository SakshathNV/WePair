import { CaseStatus } from '../../../common/enums/index.js';
import { GeoLocation } from '../../../common/interfaces/location.interface.js';

export class ServiceCase {
  id: string;
  customerId: string;
  vehicleId: string;
  location: GeoLocation;
  status: CaseStatus;
  jobIds: string[]; // 1-to-many: incident may produce roadside, towing, workshop jobs
  notes?: string;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}
