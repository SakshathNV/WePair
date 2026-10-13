import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { Provider, ProviderSchema } from '../providers/schemas/provider.schema.js';
import { ServiceCase, ServiceCaseSchema } from '../cases/schemas/case.schema.js';
import { Job, JobSchema } from '../jobs/schemas/job.schema.js';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: ServiceCase.name, schema: ServiceCaseSchema },
      { name: Job.name, schema: JobSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
