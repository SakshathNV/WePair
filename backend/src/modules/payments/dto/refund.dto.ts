import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class RefundDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number; // optional: in INR, for partial refund

  @IsOptional()
  @IsString()
  reason?: string;
}
