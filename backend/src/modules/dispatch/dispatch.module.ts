import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service.js';
import { ProvidersModule } from '../providers/providers.module.js';

@Module({
  imports: [ProvidersModule],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
