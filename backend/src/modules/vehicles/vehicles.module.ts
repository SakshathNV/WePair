import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesController } from './vehicles.controller.js';
import { VehiclesService } from './vehicles.service.js';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
