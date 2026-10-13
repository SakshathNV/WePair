import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { VehiclesModule } from './modules/vehicles/vehicles.module.js';
import { ProvidersModule } from './modules/providers/providers.module.js';
import { CasesModule } from './modules/cases/cases.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { DispatchModule } from './modules/dispatch/dispatch.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { GatewayModule } from './modules/gateway/gateway.module.js';
import { AdminModule } from './modules/admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error(
            'MONGODB_URI is not defined in environment variables. Check your .env file.',
          );
        }
        return {
          uri,
          dbName: configService.get<string>('MONGODB_DB_NAME', 'wepair'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CatalogModule,
    UsersModule,
    VehiclesModule,
    ProvidersModule,
    CasesModule,
    JobsModule,
    DispatchModule,
    PaymentsModule,
    UploadsModule,
    NotificationsModule,
    GatewayModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
