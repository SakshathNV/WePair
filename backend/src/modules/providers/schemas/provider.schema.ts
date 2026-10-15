import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProviderStatus, VehicleCategory } from '../../../common/enums/index.js';

export type ProviderDocument = HydratedDocument<Provider>;

@Schema({ _id: false })
export class ProviderGeoPoint {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true }) // [longitude, latitude]
  coordinates: number[];
}

@Schema({ _id: false })
export class ProviderLocation {
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

  @Prop({ type: ProviderGeoPoint, required: false })
  geo?: ProviderGeoPoint;
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
export class Provider {
  id?: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], enum: Object.values(VehicleCategory), default: [] })
  supportedVehicleCategories: VehicleCategory[];

  @Prop({ type: String, required: true, enum: Object.values(ProviderStatus), default: ProviderStatus.OFFLINE, index: true })
  status: ProviderStatus;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: 5.0 })
  rating: number;

  @Prop({ default: 0 })
  totalJobsCompleted: number;

  @Prop({ type: ProviderLocation })
  location?: ProviderLocation;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
ProviderSchema.index({ 'location.geo': '2dsphere' }, { sparse: true });
