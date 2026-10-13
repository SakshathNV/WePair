import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import { ServiceItem, ServiceItemSchema } from './schemas/service-item.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServiceItem.name, schema: ServiceItemSchema }]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
