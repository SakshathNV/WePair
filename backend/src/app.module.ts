import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { VehiclesModule } from './modules/vehicles/vehicles.module.js';
import { ProvidersModule } from './modules/providers/providers.module.js';
import { CasesModule } from './modules/cases/cases.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { DispatchModule } from './modules/dispatch/dispatch.module.js';

@Module({
  imports: [
    CatalogModule,
    UsersModule,
    VehiclesModule,
    ProvidersModule,
    CasesModule,
    JobsModule,
    DispatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
