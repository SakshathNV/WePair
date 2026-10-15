import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otp: string;

  @IsOptional()
  @IsString()
  providerId?: string;
}
