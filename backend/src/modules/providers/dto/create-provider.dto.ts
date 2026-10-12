import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { VehicleCategory, ProviderStatus } from '../../../common/enums/index.js';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsEnum(VehicleCategory, { each: true })
  supportedVehicleCategories: VehicleCategory[];

  @IsOptional()
  @IsEnum(ProviderStatus)
  status?: ProviderStatus = ProviderStatus.OFFLINE;

  @IsOptional()
  @IsNumber()
  initialLatitude?: number;

  @IsOptional()
  @IsNumber()
  initialLongitude?: number;
}
