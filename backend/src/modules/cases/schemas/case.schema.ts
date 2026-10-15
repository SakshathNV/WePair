import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CaseStatus } from '../../../common/enums/index.js';

export type ServiceCaseDocument = HydratedDocument<ServiceCase>;

@Schema({ _id: false })
export class CaseLocation {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop({ default: () => new Date() })
  updatedAt?: Date;
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
export class ServiceCase {
  id?: string;

  @Prop({ required: true, index: true })
  customerId: string;

  @Prop({ required: true, index: true })
  vehicleId: string;

  @Prop({ type: CaseLocation, required: true })
  location: CaseLocation;

  @Prop({ type: String, required: true, enum: Object.values(CaseStatus), default: CaseStatus.OPEN, index: true })
  status: CaseStatus;

  @Prop({ type: [String], default: [] })
  jobIds: string[];

  @Prop()
  notes?: string;

  @Prop({ unique: true, sparse: true, index: true })
  idempotencyKey?: string;
}

export const ServiceCaseSchema = SchemaFactory.createForClass(ServiceCase);
