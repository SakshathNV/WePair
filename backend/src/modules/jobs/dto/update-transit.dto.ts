import { IsOptional, IsString } from 'class-validator';

export class UpdateJobTransitDto {
  @IsOptional()
  @IsString()
  providerId?: string;
}
