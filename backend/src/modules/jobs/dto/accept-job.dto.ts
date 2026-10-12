import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptJobDto {
  @IsNotEmpty()
  @IsString()
  providerId: string;
}
