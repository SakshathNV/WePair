import { UserRole } from '../../../common/enums/index.js';

export class User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
