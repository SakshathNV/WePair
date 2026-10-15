import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ServiceCategory, VehicleCategory, FuelType } from '../../../common/enums/index.js';

export type ServiceItemDocument = HydratedDocument<ServiceItem>;

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
export class ServiceItem {
  id?: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, required: true, enum: Object.values(ServiceCategory), index: true })
  category: ServiceCategory;

  @Prop({ required: true })
  repairCategory: string;

  @Prop({ type: [String], default: [] })
  requiredSkills: string[];

  @Prop({ type: [String], enum: Object.values(VehicleCategory), default: [] })
  compatibleVehicleCategories: VehicleCategory[];

  @Prop({ type: [String], enum: Object.values(FuelType), default: [] })
  compatibleFuelTypes: FuelType[];

  @Prop({ required: true })
  basePrice: number;

  @Prop({ required: true })
  estimatedDurationMinutes: number;
}

export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);
