import { describe, it, expect } from 'vitest';
import { JobStateMachine } from './job-state-machine.js';
import { JobStatus } from '../../../common/enums/index.js';
import { BadRequestException } from '@nestjs/common';

describe('JobStateMachine (Audited Blueprint Section 4)', () => {
  it('allows valid sequential transitions from CREATED to COMPLETED', () => {
    expect(JobStateMachine.canTransition(JobStatus.CREATED, JobStatus.SEARCHING)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.SEARCHING, JobStatus.ASSIGNED)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.ASSIGNED, JobStatus.EN_ROUTE)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.EN_ROUTE, JobStatus.ARRIVED)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.ARRIVED, JobStatus.SERVICE_STARTED)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.SERVICE_STARTED, JobStatus.COMPLETED)).toBe(true);
  });

  it('allows NO_PROVIDER when all batches exhaust', () => {
    expect(JobStateMachine.canTransition(JobStatus.SEARCHING, JobStatus.NO_PROVIDER)).toBe(true);
  });

  it('rejects invalid skipping of states (e.g. CREATED directly to COMPLETED)', () => {
    expect(JobStateMachine.canTransition(JobStatus.CREATED, JobStatus.COMPLETED)).toBe(false);
    expect(() =>
      JobStateMachine.validateTransition(JobStatus.CREATED, JobStatus.COMPLETED),
    ).toThrow(BadRequestException);
  });

  it('rejects any transition from terminal states COMPLETED and CANCELLED', () => {
    expect(JobStateMachine.isTerminal(JobStatus.COMPLETED)).toBe(true);
    expect(JobStateMachine.isTerminal(JobStatus.CANCELLED)).toBe(true);
    expect(JobStateMachine.canTransition(JobStatus.COMPLETED, JobStatus.SEARCHING)).toBe(false);
  });
});
