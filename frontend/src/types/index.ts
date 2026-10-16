export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
  ADMIN: 'ADMIN',
} as const;

export const VehicleCategory = {
  TWO_WHEELER: 'TWO_WHEELER',
  CAR: 'CAR',
  SUV: 'SUV',
  COMMERCIAL: 'COMMERCIAL',
  EV: 'EV',
} as const;

export const FuelType = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  CNG: 'CNG',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
} as const;

export const ServiceCategory = {
  ROADSIDE_ASSISTANCE: 'ROADSIDE_ASSISTANCE',
  TOWING: 'TOWING',
  WORKSHOP: 'WORKSHOP',
  FUEL_ASSISTANCE: 'FUEL_ASSISTANCE',
} as const;

export const CaseStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
} as const;

export const JobStatus = {
  CREATED: 'CREATED',
  SEARCHING: 'SEARCHING',
  ASSIGNED: 'ASSIGNED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  SERVICE_STARTED: 'SERVICE_STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_PROVIDER: 'NO_PROVIDER',
} as const;

export const ProviderStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  BUSY: 'BUSY',
} as const;

export const PaymentStatus = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  REFUNDED: 'REFUNDED',
  PARTIAL_REFUND: 'PARTIAL_REFUND',
  FAILED: 'FAILED',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
export type VehicleCategory = typeof VehicleCategory[keyof typeof VehicleCategory];
export type FuelType = typeof FuelType[keyof typeof FuelType];
export type ServiceCategory = typeof ServiceCategory[keyof typeof ServiceCategory];
export type CaseStatus = typeof CaseStatus[keyof typeof CaseStatus];
export type JobStatus = typeof JobStatus[keyof typeof JobStatus];
export type ProviderStatus = typeof ProviderStatus[keyof typeof ProviderStatus];
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  category: VehicleCategory;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  fuelType: FuelType;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  vehicleCategories: VehicleCategory[];
  fuelTypes: FuelType[];
  estimatedDurationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  vehicle?: Vehicle;
  service?: Service;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  description?: string;
  serviceCategories: ServiceCategory[];
  coverageRadiusKm: number;
  baseLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: ProviderStatus;
  rating: number;
  totalJobs: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Job {
  id: string;
  caseId: string;
  providerId?: string;
  status: JobStatus;
  otp?: string;
  otpExpiresAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  case?: Case;
  provider?: Provider;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginDto {
  phone: string;
  password: string;
}

export interface RegisterDto {
  phone: string;
  name: string;
  email?: string;
  password: string;
  role?: UserRole;
}

export interface CreateCaseDto {
  vehicleId: string;
  serviceId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
}

export interface CreateJobDto {
  caseId: string;
  serviceId: string;
  providerId?: string;
}

export interface AcceptJobDto {
  providerId: string;
}

export interface VerifyOtpDto {
  otp: string;
  providerId?: string;
}

export interface UpdateLocationDto {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface UpdateStatusDto {
  status: ProviderStatus;
}

export interface CancelCaseDto {
  reason: string;
}

export interface CancelJobDto {
  reason: string;
}

export interface EscalateJobDto {
  reason: string;
}

export interface UpdateTransitDto {
  providerId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  jobId: string;
  amount: number;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
}