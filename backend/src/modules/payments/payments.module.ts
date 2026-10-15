import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { Payment, PaymentSchema } from './schemas/payment.schema.js';
import { JobsModule } from '../jobs/jobs.module.js';
import { CasesModule } from '../cases/cases.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    JobsModule,
    CasesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
