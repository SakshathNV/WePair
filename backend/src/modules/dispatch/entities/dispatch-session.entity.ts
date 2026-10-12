export interface DispatchAttempt {
  providerId: string;
  batchNumber: number;
  notifiedAt: Date;
  respondedAt?: Date;
  outcome?: 'ACCEPTED' | 'REJECTED' | 'TIMEOUT_EXPIRED' | 'ALREADY_ASSIGNED';
}

export class DispatchSession {
  id: string;
  jobId: string;
  caseId: string;
  status: 'ACTIVE' | 'ASSIGNED' | 'EXHAUSTED' | 'CANCELLED';
  currentBatch: number;
  candidateProviderIds: string[];
  currentlyNotifiedProviderIds: string[];
  batchExpiresAt: Date;
  winnerProviderId?: string;
  attempts: DispatchAttempt[];
  createdAt: Date;
  updatedAt: Date;
}
