import { BadRequestException } from '@nestjs/common';
import { JobStatus } from '../../../common/enums/index.js';

export class JobStateMachine {
  private static readonly VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    [JobStatus.CREATED]: [JobStatus.SEARCHING, JobStatus.CANCELLED],
    [JobStatus.SEARCHING]: [JobStatus.ASSIGNED, JobStatus.NO_PROVIDER, JobStatus.CANCELLED],
    [JobStatus.ASSIGNED]: [JobStatus.EN_ROUTE, JobStatus.SEARCHING, JobStatus.CANCELLED],
    [JobStatus.EN_ROUTE]: [JobStatus.ARRIVED, JobStatus.CANCELLED],
    [JobStatus.ARRIVED]: [JobStatus.SERVICE_STARTED, JobStatus.CANCELLED],
    [JobStatus.SERVICE_STARTED]: [JobStatus.COMPLETED, JobStatus.CANCELLED],
    [JobStatus.COMPLETED]: [], // Terminal state
    [JobStatus.CANCELLED]: [], // Terminal state
    [JobStatus.NO_PROVIDER]: [JobStatus.SEARCHING], // Can re-dispatch or escalate
  };

  public static canTransition(current: JobStatus, target: JobStatus): boolean {
    const allowed = this.VALID_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  public static validateTransition(current: JobStatus, target: JobStatus): void {
    if (!this.canTransition(current, target)) {
      throw new BadRequestException(
        `Invalid lifecycle transition: Cannot move job from '${current}' to '${target}'.`,
      );
    }
  }

  public static isTerminal(status: JobStatus): boolean {
    return status === JobStatus.COMPLETED || status === JobStatus.CANCELLED;
  }
}
