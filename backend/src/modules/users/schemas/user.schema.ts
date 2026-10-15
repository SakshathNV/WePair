import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../../common/enums/index.js';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  id?: string;

  @Prop({ required: true, unique: true, index: true })
  phone: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, required: true, enum: Object.values(UserRole), default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
