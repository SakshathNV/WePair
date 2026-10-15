import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  JOB_CREATED = 'JOB_CREATED',
  JOB_ASSIGNED = 'JOB_ASSIGNED',
  PROVIDER_EN_ROUTE = 'PROVIDER_EN_ROUTE',
  PROVIDER_ARRIVED = 'PROVIDER_ARRIVED',
  OTP_GENERATED = 'OTP_GENERATED',
  SERVICE_STARTED = 'SERVICE_STARTED',
  SERVICE_COMPLETED = 'SERVICE_COMPLETED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  JOB_CANCELLED = 'JOB_CANCELLED',
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
export class Notification {
  id?: string;

  @Prop({ required: true, index: true })
  recipientId: string;

  @Prop({ type: String, required: true, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  data?: Record<string, any>;

  @Prop({ default: false, index: true })
  isRead: boolean;

  @Prop({ default: 'IN_APP', enum: ['IN_APP', 'PUSH', 'SMS', 'EMAIL'] })
  channel: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
