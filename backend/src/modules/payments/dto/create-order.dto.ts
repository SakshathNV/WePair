import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsNotEmpty()
  @IsString()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number; // in INR

  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
