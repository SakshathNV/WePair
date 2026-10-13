import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DispatchSessionDocument = HydratedDocument<DispatchSession>;

@Schema({ _id: false })
export class DispatchAttempt {
  @Prop({ required: true })
  providerId: string;

  @Prop({ required: true })
  batchNumber: number;

  @Prop({ required: true })
  notifiedAt: Date;

  @Prop()
  respondedAt?: Date;

  @Prop({ enum: ['ACCEPTED', 'REJECTED', 'TIMEOUT_EXPIRED', 'ALREADY_ASSIGNED'] })
  outcome?: string;
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
export class DispatchSession {
  id?: string;

  @Prop({ required: true, unique: true, index: true })
  jobId: string;

  @Prop({ required: true, index: true })
  caseId: string;

  @Prop({ required: true, enum: ['ACTIVE', 'ASSIGNED', 'EXHAUSTED', 'CANCELLED'], default: 'ACTIVE', index: true })
  status: string;

  @Prop({ required: true, default: 1 })
  currentBatch: number;

  @Prop({ type: [String], default: [] })
  candidateProviderIds: string[];

  @Prop({ type: [String], default: [] })
  currentlyNotifiedProviderIds: string[];

  @Prop()
  batchExpiresAt: Date;

  @Prop()
  winnerProviderId?: string;

  @Prop({ type: [DispatchAttempt], default: [] })
  attempts: DispatchAttempt[];
}

export const DispatchSessionSchema = SchemaFactory.createForClass(DispatchSession);
