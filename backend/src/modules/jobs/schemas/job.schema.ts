import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { JobStatus, ServiceCategory } from '../../../common/enums/index.js';

export type JobDocument = HydratedDocument<Job>;

@Schema({ _id: false })
export class JobTimelineEvent {
  @Prop({ type: String, required: true, enum: Object.values(JobStatus) })
  status: JobStatus;

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;

  @Prop()
  note?: string;
}

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
export class Job {
  id?: string;

  @Prop({ required: true, index: true })
  caseId: string;

  @Prop({ required: true })
  serviceId: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ type: String, required: true, enum: Object.values(ServiceCategory) })
  category: ServiceCategory;

  @Prop({ index: true })
  providerId?: string;

  @Prop({ type: String, required: true, enum: Object.values(JobStatus), default: JobStatus.CREATED, index: true })
  status: JobStatus;

  @Prop({ required: true })
  quoteAmount: number;

  @Prop({ required: true })
  otp: string;

  @Prop()
  cancellationReason?: string;

  @Prop({ type: [JobTimelineEvent], default: [] })
  timeline: JobTimelineEvent[];

  @Prop({ default: 0 })
  failedOtpAttempts: number;

  @Prop({ default: false })
  isOtpLocked: boolean;

  @Prop()
  paymentId?: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
