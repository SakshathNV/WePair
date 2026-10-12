import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { VehicleCategory, FuelType } from '../../../common/enums/index.js';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @IsNotEmpty()
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsOptional()
  @IsNumber()
  year?: number;
}
