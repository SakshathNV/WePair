import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VehicleCategory, FuelType } from '../../../common/enums/index.js';

export type VehicleDocument = HydratedDocument<Vehicle>;

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
export class Vehicle {
  id?: string;

  @Prop({ required: true, index: true })
  ownerId: string;

  @Prop({ required: true, enum: VehicleCategory })
  category: VehicleCategory;

  @Prop({ required: true, enum: FuelType })
  fuelType: FuelType;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true, uppercase: true, index: true })
  registrationNumber: string;

  @Prop()
  year?: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
