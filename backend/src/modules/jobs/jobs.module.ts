import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { CasesModule } from '../cases/cases.module.js';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { ProvidersModule } from '../providers/providers.module.js';
import { DispatchModule } from '../dispatch/dispatch.module.js';

@Module({
  imports: [
    CasesModule,
    VehiclesModule,
    CatalogModule,
    ProvidersModule,
    DispatchModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
