import { IsOptional, IsString } from 'class-validator';

export class AcceptJobDto {
  @IsOptional()
  @IsString()
  providerId?: string;
}
