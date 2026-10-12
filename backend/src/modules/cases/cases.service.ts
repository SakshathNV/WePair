import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ServiceCase } from './entities/case.entity.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { CaseStatus } from '../../common/enums/index.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CasesService {
  private readonly cases = new Map<string, ServiceCase>();

  create(dto: CreateCaseDto): ServiceCase {
    // Idempotency check per Section 8 & 9 of Blueprint
    if (dto.idempotencyKey) {
      const existing = Array.from(this.cases.values()).find(
        (c) => c.idempotencyKey === dto.idempotencyKey,
      );
      if (existing) {
        return existing;
      }
    }

    // Check if customer already has an active duplicate case at the same location
    const activeCase = Array.from(this.cases.values()).find(
      (c) =>
        c.customerId === dto.customerId &&
        c.vehicleId === dto.vehicleId &&
        (c.status === CaseStatus.OPEN || c.status === CaseStatus.IN_PROGRESS),
    );

    if (activeCase && !dto.idempotencyKey) {
      // Return existing active case to prevent duplicate dispatch requests
      return activeCase;
    }

    const serviceCase: ServiceCase = {
      id: `case_${randomUUID().substring(0, 8)}`,
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        updatedAt: new Date(),
      },
      status: CaseStatus.OPEN,
      jobIds: [],
      notes: dto.notes,
      idempotencyKey: dto.idempotencyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cases.set(serviceCase.id, serviceCase);
    return serviceCase;
  }

  findAll(): ServiceCase[] {
    return Array.from(this.cases.values());
  }

  findById(id: string): ServiceCase {
    const serviceCase = this.cases.get(id);
    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with id '${id}' not found`);
    }
    return serviceCase;
  }

  findByCustomerId(customerId: string): ServiceCase[] {
    return Array.from(this.cases.values()).filter((c) => c.customerId === customerId);
  }

  addJobToCase(caseId: string, jobId: string): ServiceCase {
    const serviceCase = this.findById(caseId);
    if (!serviceCase.jobIds.includes(jobId)) {
      serviceCase.jobIds.push(jobId);
    }
    serviceCase.status = CaseStatus.IN_PROGRESS;
    serviceCase.updatedAt = new Date();
    return serviceCase;
  }

  cancelCase(caseId: string, reason?: string): ServiceCase {
    const serviceCase = this.findById(caseId);
    serviceCase.status = CaseStatus.CANCELLED;
    if (reason) {
      serviceCase.notes = `${serviceCase.notes ? serviceCase.notes + ' | ' : ''}Cancellation Reason: ${reason}`;
    }
    serviceCase.updatedAt = new Date();
    return serviceCase;
  }

  resolveCase(caseId: string): ServiceCase {
    const serviceCase = this.findById(caseId);
    serviceCase.status = CaseStatus.RESOLVED;
    serviceCase.updatedAt = new Date();
    return serviceCase;
  }
}
