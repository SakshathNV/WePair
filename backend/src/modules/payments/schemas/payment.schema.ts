import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentStatus } from '../../../common/enums/index.js';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Payment {
  id?: string;

  @Prop({ required: true, index: true })
  jobId: string;

  @Prop({ required: true, index: true })
  caseId: string;

  @Prop({ required: true, index: true })
  customerId: string;

  @Prop({ index: true })
  providerId?: string;

  @Prop({ required: true })
  amount: number; // in INR

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.INITIATED, index: true })
  status: PaymentStatus;

  @Prop({ unique: true, sparse: true, index: true })
  razorpayOrderId?: string;

  @Prop({ unique: true, sparse: true, index: true })
  razorpayPaymentId?: string;

  @Prop()
  razorpaySignature?: string;

  @Prop()
  refundId?: string;

  @Prop()
  refundAmount?: number;

  @Prop({ unique: true, sparse: true, index: true })
  idempotencyKey?: string;

  @Prop()
  failureReason?: string;

  @Prop()
  receipt?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
