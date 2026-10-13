import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema.js';
import { Provider, ProviderDocument } from '../providers/schemas/provider.schema.js';
import { ServiceCase, ServiceCaseDocument } from '../cases/schemas/case.schema.js';
import { Job, JobDocument } from '../jobs/schemas/job.schema.js';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema.js';
import { JobStatus, ProviderStatus, CaseStatus, PaymentStatus } from '../../common/enums/index.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Provider.name) private readonly providerModel: Model<ProviderDocument>,
    @InjectModel(ServiceCase.name) private readonly caseModel: Model<ServiceCaseDocument>,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalProviders,
      onlineProviders,
      activeCases,
      totalJobs,
      completedJobs,
      payments,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.providerModel.countDocuments(),
      this.providerModel.countDocuments({ status: ProviderStatus.ONLINE }),
      this.caseModel.countDocuments({
        status: { $in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
      }),
      this.jobModel.countDocuments(),
      this.jobModel.countDocuments({ status: JobStatus.COMPLETED }),
      this.paymentModel.find({ status: PaymentStatus.CAPTURED }).exec(),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      users: { total: totalUsers },
      providers: { total: totalProviders, online: onlineProviders },
      cases: { active: activeCases },
      jobs: { total: totalJobs, completed: completedJobs },
      revenue: { totalINR: totalRevenue, transactions: payments.length },
      timestamp: new Date().toISOString(),
    };
  }

  async getPendingVerifications(): Promise<Provider[]> {
    return this.providerModel.find({ isVerified: false }).exec();
  }

  async verifyProvider(providerId: string): Promise<Provider> {
    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException(`Provider '${providerId}' not found`);
    }
    provider.isVerified = true;
    return provider.save();
  }

  async getRecentJobs(limit: number = 20): Promise<Job[]> {
    return this.jobModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  async getRecentPayments(limit: number = 20): Promise<Payment[]> {
    return this.paymentModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  async overrideAssign(jobId: string, providerId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException(`Job '${jobId}' not found`);
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException(`Provider '${providerId}' not found`);
    }

    job.status = JobStatus.ASSIGNED;
    job.providerId = providerId;
    job.timeline.push({
      status: JobStatus.ASSIGNED,
      timestamp: new Date(),
      note: `Administrator manual assignment override to provider ${provider.name}`,
    });

    provider.status = ProviderStatus.BUSY;
    await provider.save();

    return job.save();
  }
}
