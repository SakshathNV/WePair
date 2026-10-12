import { JobStatus, ServiceCategory } from '../../../common/enums/index.js';

export interface JobTimelineEvent {
  status: JobStatus;
  timestamp: Date;
  note?: string;
}

export class Job {
  id: string;
  caseId: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  providerId?: string;
  status: JobStatus;
  quoteAmount: number;
  otp: string; // 4-digit OTP for arrival/service verification
  cancellationReason?: string;
  timeline: JobTimelineEvent[];
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
