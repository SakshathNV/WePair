import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { Job, JobSchema } from './schemas/job.schema.js';
import { CasesModule } from '../cases/cases.module.js';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { ProvidersModule } from '../providers/providers.module.js';
import { DispatchModule } from '../dispatch/dispatch.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    CasesModule,
    VehiclesModule,
    CatalogModule,
    ProvidersModule,
    DispatchModule,
    NotificationsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
