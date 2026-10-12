import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProviderStatus } from '../../../common/enums/index.js';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(ProviderStatus)
  status: ProviderStatus;
}
