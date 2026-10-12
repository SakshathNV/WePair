import { IsNotEmpty, IsString } from 'class-validator';

export class EscalateJobDto {
  @IsNotEmpty()
  @IsString()
  newServiceId: string; // e.g., 'srv-towing-flatbed' or 'srv-workshop-inspection'
}
