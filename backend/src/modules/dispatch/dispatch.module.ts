import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DispatchService } from './dispatch.service.js';
import { ProvidersModule } from '../providers/providers.module.js';
import { DispatchSession, DispatchSessionSchema } from './schemas/dispatch-session.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DispatchSession.name, schema: DispatchSessionSchema }]),
    ProvidersModule,
  ],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
