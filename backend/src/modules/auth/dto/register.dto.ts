import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums/index.js';

export enum RegistrationRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;

  @IsOptional()
  @IsEnum(RegistrationRole, { message: 'Role must be either CUSTOMER or PROVIDER' })
  role?: UserRole = UserRole.CUSTOMER;
}
