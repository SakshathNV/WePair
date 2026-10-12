import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DispatchSession, DispatchAttempt } from './entities/dispatch-session.entity.js';
import { ProvidersService } from '../providers/providers.service.js';
import { VehicleCategory, ProviderStatus, JobStatus } from '../../common/enums/index.js';
import { randomUUID } from 'node:crypto';

export interface DispatchResult {
  session: DispatchSession;
  notifiedCount: number;
  exhausted: boolean;
}

@Injectable()
export class DispatchService {
  private readonly sessions = new Map<string, DispatchSession>();
  // Index by jobId for O(1) lookup
  private readonly jobToSessionMap = new Map<string, string>();
  // Mutex locks per job to guarantee atomic assignment winner
  private readonly claimLocks = new Set<string>();

  private readonly BATCH_SIZE = 5; // 5-by-5 batch per Section 8
  private readonly BATCH_TTL_SECONDS = 45;

  constructor(private readonly providersService: ProvidersService) {}

  initiateDispatch(
    jobId: string,
    caseId: string,
    incidentLat: number,
    incidentLng: number,
    requiredSkills: string[],
    vehicleCategory: VehicleCategory,
  ): DispatchResult {
    // 1. Find and rank eligible candidates
    const rankedCandidates = this.providersService.findAndRankEligible(
      incidentLat,
      incidentLng,
      requiredSkills,
      vehicleCategory,
      30, // 30km radius
    );

    const candidateIds = rankedCandidates.map((c) => c.provider.id);

    // Take first batch of up to 5 providers
    const firstBatch = candidateIds.slice(0, this.BATCH_SIZE);
    const expiresAt = new Date(Date.now() + this.BATCH_TTL_SECONDS * 1000);

    const attempts: DispatchAttempt[] = firstBatch.map((pId) => ({
      providerId: pId,
      batchNumber: 1,
      notifiedAt: new Date(),
    }));

    const session: DispatchSession = {
      id: `disp_${randomUUID().substring(0, 8)}`,
      jobId,
      caseId,
      status: firstBatch.length > 0 ? 'ACTIVE' : 'EXHAUSTED',
      currentBatch: 1,
      candidateProviderIds: candidateIds,
      currentlyNotifiedProviderIds: firstBatch,
      batchExpiresAt: expiresAt,
      attempts,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    this.jobToSessionMap.set(jobId, session.id);

    return {
      session,
      notifiedCount: firstBatch.length,
      exhausted: firstBatch.length === 0,
    };
  }

  getSessionByJobId(jobId: string): DispatchSession | undefined {
    const sessionId = this.jobToSessionMap.get(jobId);
    if (!sessionId) return undefined;
    return this.sessions.get(sessionId);
  }

  /**
   * Atomic Assigner per Section 8 & 9:
   * First valid claim wins. Strict CAS/mutex concurrency protection.
   */
  async attemptClaim(
    jobId: string,
    providerId: string,
    verifyJobStatus: () => JobStatus,
  ): Promise<{ winner: boolean; providerId: string }> {
    const session = this.getSessionByJobId(jobId);
    if (!session) {
      throw new NotFoundException(`No active dispatch session for job '${jobId}'`);
    }

    // Atomic CAS Lock
    if (this.claimLocks.has(jobId)) {
      throw new ConflictException({
        code: 'JOB_ALREADY_ASSIGNED',
        message: 'Another provider is currently completing the assignment claim.',
      });
    }

    this.claimLocks.add(jobId);

    try {
      // Invariant check: Job must still be SEARCHING
      const currentStatus = verifyJobStatus();
      if (currentStatus !== JobStatus.SEARCHING) {
        throw new ConflictException({
          code: 'JOB_ALREADY_ASSIGNED',
          message: `Job is no longer available (current status: ${currentStatus}).`,
        });
      }

      if (session.status !== 'ACTIVE') {
        throw new ConflictException({
          code: 'JOB_ALREADY_ASSIGNED',
          message: 'Dispatch session is no longer active.',
        });
      }

      // Check if provider was in the currently notified batch
      const isNotified = session.currentlyNotifiedProviderIds.includes(providerId);
      if (!isNotified) {
        throw new BadRequestException(
          `Provider '${providerId}' is not part of the active notified dispatch batch.`,
        );
      }

      // Claim won!
      session.status = 'ASSIGNED';
      session.winnerProviderId = providerId;
      session.updatedAt = new Date();

      // Record outcome in attempt audit
      const attempt = session.attempts.find(
        (a) => a.providerId === providerId && a.batchNumber === session.currentBatch,
      );
      if (attempt) {
        attempt.respondedAt = new Date();
        attempt.outcome = 'ACCEPTED';
      }

      // Reject all other notified candidates in this batch with ALREADY_ASSIGNED
      for (const att of session.attempts) {
        if (att.providerId !== providerId && !att.outcome) {
          att.outcome = 'ALREADY_ASSIGNED';
        }
      }

      // Mark winning provider as BUSY
      this.providersService.updateStatus(providerId, ProviderStatus.BUSY);

      return { winner: true, providerId };
    } finally {
      this.claimLocks.delete(jobId);
    }
  }

  /**
   * Advance to the next 5 providers if current batch times out or all reject
   */
  advanceToNextBatch(jobId: string): DispatchResult {
    const session = this.getSessionByJobId(jobId);
    if (!session || session.status !== 'ACTIVE') {
      return { session: session!, notifiedCount: 0, exhausted: true };
    }

    const nextBatchNumber = session.currentBatch + 1;
    const startIndex = session.currentBatch * this.BATCH_SIZE;
    const nextBatch = session.candidateProviderIds.slice(
      startIndex,
      startIndex + this.BATCH_SIZE,
    );

    if (nextBatch.length === 0) {
      session.status = 'EXHAUSTED';
      session.currentlyNotifiedProviderIds = [];
      session.updatedAt = new Date();
      return { session, notifiedCount: 0, exhausted: true };
    }

    session.currentBatch = nextBatchNumber;
    session.currentlyNotifiedProviderIds = nextBatch;
    session.batchExpiresAt = new Date(Date.now() + this.BATCH_TTL_SECONDS * 1000);
    session.updatedAt = new Date();

    for (const pId of nextBatch) {
      session.attempts.push({
        providerId: pId,
        batchNumber: nextBatchNumber,
        notifiedAt: new Date(),
      });
    }

    return { session, notifiedCount: nextBatch.length, exhausted: false };
  }
}
