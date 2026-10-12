export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum VehicleCategory {
  TWO_WHEELER = 'TWO_WHEELER',
  CAR = 'CAR',
  SUV = 'SUV',
  COMMERCIAL = 'COMMERCIAL',
  EV = 'EV',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  CNG = 'CNG',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum ServiceCategory {
  ROADSIDE_ASSISTANCE = 'ROADSIDE_ASSISTANCE',
  TOWING = 'TOWING',
  WORKSHOP = 'WORKSHOP',
  FUEL_ASSISTANCE = 'FUEL_ASSISTANCE',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

/**
 * Strict server-validated Job state machine per Section 4 of Blueprint
 */
export enum JobStatus {
  CREATED = 'CREATED',
  SEARCHING = 'SEARCHING',
  ASSIGNED = 'ASSIGNED',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
  SERVICE_STARTED = 'SERVICE_STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_PROVIDER = 'NO_PROVIDER',
}

export enum ProviderStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  FAILED = 'FAILED',
}
