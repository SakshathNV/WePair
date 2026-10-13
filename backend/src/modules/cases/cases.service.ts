import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCase, ServiceCaseDocument } from './schemas/case.schema.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { CaseStatus } from '../../common/enums/index.js';

@Injectable()
export class CasesService {
  constructor(
    @InjectModel(ServiceCase.name) private readonly caseModel: Model<ServiceCaseDocument>,
  ) {}

  async create(dto: CreateCaseDto): Promise<ServiceCase> {
    // 1. Idempotency check per Blueprint Section 8 & 9
    if (dto.idempotencyKey) {
      const existing = await this.caseModel.findOne({ idempotencyKey: dto.idempotencyKey }).exec();
      if (existing) {
        return existing;
      }
    }

    // 2. Prevent duplicate active case creation for the same customer + vehicle
    const activeCase = await this.caseModel
      .findOne({
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        status: { $in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
      })
      .exec();

    if (activeCase && !dto.idempotencyKey) {
      return activeCase;
    }

    const serviceCase = new this.caseModel({
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
    });

    return serviceCase.save();
  }

  async findAll(): Promise<ServiceCase[]> {
    return this.caseModel.find().exec();
  }

  async findById(id: string): Promise<ServiceCase> {
    const serviceCase = await this.caseModel.findById(id).exec();
    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with id '${id}' not found`);
    }
    return serviceCase;
  }

  async findByCustomerId(customerId: string): Promise<ServiceCase[]> {
    return this.caseModel.find({ customerId }).exec();
  }

  async addJobToCase(caseId: string, jobId: string): Promise<ServiceCase> {
    const serviceCase = await this.caseModel.findById(caseId).exec();
    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with id '${caseId}' not found`);
    }

    if (!serviceCase.jobIds.includes(jobId)) {
      serviceCase.jobIds.push(jobId);
    }
    serviceCase.status = CaseStatus.IN_PROGRESS;
    return serviceCase.save();
  }

  async cancelCase(caseId: string, reason?: string): Promise<ServiceCase> {
    const serviceCase = await this.caseModel.findById(caseId).exec();
    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with id '${caseId}' not found`);
    }

    serviceCase.status = CaseStatus.CANCELLED;
    if (reason) {
      serviceCase.notes = `${serviceCase.notes ? serviceCase.notes + ' | ' : ''}Cancellation Reason: ${reason}`;
    }
    return serviceCase.save();
  }

  async resolveCase(caseId: string): Promise<ServiceCase> {
    const serviceCase = await this.caseModel.findById(caseId).exec();
    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with id '${caseId}' not found`);
    }

    serviceCase.status = CaseStatus.RESOLVED;
    return serviceCase.save();
  }
}
