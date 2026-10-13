import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb+srv://wepairteam_db_user:hqSXL6KhiepwnVrr@wepair-cluster.i1flj41.mongodb.net/wepair?retryWrites=true&w=majority',
        dbName: configService.get<string>('MONGODB_DB_NAME') || 'wepair',
      }),
      inject: [ConfigService],
    }),
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
