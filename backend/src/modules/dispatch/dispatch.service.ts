import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DispatchSession, DispatchSessionDocument, DispatchAttempt } from './schemas/dispatch-session.schema.js';
import { ProvidersService } from '../providers/providers.service.js';
import { VehicleCategory, ProviderStatus, JobStatus } from '../../common/enums/index.js';

export interface DispatchResult {
  session: DispatchSession;
  notifiedCount: number;
  exhausted: boolean;
}

@Injectable()
export class DispatchService {
  private readonly claimLocks = new Set<string>();
  private readonly BATCH_SIZE = 5; // 5-by-5 batch per Section 8 of Blueprint
  private readonly BATCH_TTL_SECONDS = 45;

  constructor(
    @InjectModel(DispatchSession.name)
    private readonly sessionModel: Model<DispatchSessionDocument>,
    private readonly providersService: ProvidersService,
  ) {}

  async initiateDispatch(
    jobId: string,
    caseId: string,
    incidentLat: number,
    incidentLng: number,
    requiredSkills: string[],
    vehicleCategory: VehicleCategory,
  ): Promise<DispatchResult> {
    // 1. Find and rank eligible candidates from database
    const rankedCandidates = await this.providersService.findAndRankEligible(
      incidentLat,
      incidentLng,
      requiredSkills,
      vehicleCategory,
      30,
    );

    const candidateIds = rankedCandidates.map((c) => (c.provider as any).id || (c.provider as any)._id.toString());

    // Take first batch of up to 5 providers
    const firstBatch = candidateIds.slice(0, this.BATCH_SIZE);
    const expiresAt = new Date(Date.now() + this.BATCH_TTL_SECONDS * 1000);

    const attempts: DispatchAttempt[] = firstBatch.map((pId) => ({
      providerId: pId,
      batchNumber: 1,
      notifiedAt: new Date(),
    }));

    const session = new this.sessionModel({
      jobId,
      caseId,
      status: firstBatch.length > 0 ? 'ACTIVE' : 'EXHAUSTED',
      currentBatch: 1,
      candidateProviderIds: candidateIds,
      currentlyNotifiedProviderIds: firstBatch,
      batchExpiresAt: expiresAt,
      attempts,
    });

    const savedSession = await session.save();

    return {
      session: savedSession,
      notifiedCount: firstBatch.length,
      exhausted: firstBatch.length === 0,
    };
  }

  async getSessionByJobId(jobId: string): Promise<DispatchSession | null> {
    return this.sessionModel.findOne({ jobId }).exec();
  }

  /**
   * Atomic Assigner per Section 8 & 9:
   * First valid claim wins. Strict CAS/mutex concurrency protection.
   */
  async attemptClaim(
    jobId: string,
    providerId: string,
    verifyJobStatus: () => Promise<JobStatus>,
  ): Promise<{ winner: boolean; providerId: string }> {
    const session = await this.getSessionByJobId(jobId);
    if (!session) {
      throw new NotFoundException(`No active dispatch session for job '${jobId}'`);
    }

    // Atomic CAS Lock per job
    if (this.claimLocks.has(jobId)) {
      throw new ConflictException({
        code: 'JOB_ALREADY_ASSIGNED',
        message: 'Another provider is currently completing the assignment claim.',
      });
    }

    this.claimLocks.add(jobId);

    try {
      const currentStatus = await verifyJobStatus();
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

      // Claim won! Atomic database update
      const updatedSession = await this.sessionModel
        .findOneAndUpdate(
          { jobId, status: 'ACTIVE' },
          {
            $set: {
              status: 'ASSIGNED',
              winnerProviderId: providerId,
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedSession) {
        throw new ConflictException({
          code: 'JOB_ALREADY_ASSIGNED',
          message: 'Job was already assigned to another provider.',
        });
      }

      // Update attempt records
      for (const attempt of updatedSession.attempts) {
        if (attempt.providerId === providerId && attempt.batchNumber === updatedSession.currentBatch) {
          attempt.respondedAt = new Date();
          attempt.outcome = 'ACCEPTED';
        } else if (!attempt.outcome) {
          attempt.outcome = 'ALREADY_ASSIGNED';
        }
      }
      await updatedSession.save();

      // Mark winning provider as BUSY
      await this.providersService.updateStatus(providerId, ProviderStatus.BUSY);

      return { winner: true, providerId };
    } finally {
      this.claimLocks.delete(jobId);
    }
  }

  /**
   * Advance to the next 5 providers if current batch times out or all reject
   */
  async advanceToNextBatch(jobId: string): Promise<DispatchResult> {
    const session = await this.getSessionByJobId(jobId);
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
      const saved = await (session as any).save();
      return { session: saved, notifiedCount: 0, exhausted: true };
    }

    session.currentBatch = nextBatchNumber;
    session.currentlyNotifiedProviderIds = nextBatch;
    session.batchExpiresAt = new Date(Date.now() + this.BATCH_TTL_SECONDS * 1000);

    for (const pId of nextBatch) {
      session.attempts.push({
        providerId: pId,
        batchNumber: nextBatchNumber,
        notifiedAt: new Date(),
      });
    }

    const saved = await (session as any).save();
    return { session: saved, notifiedCount: nextBatch.length, exhausted: false };
  }
}
