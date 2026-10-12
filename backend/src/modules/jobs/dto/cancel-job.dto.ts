import { IsOptional, IsString } from 'class-validator';

export class CancelJobDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
