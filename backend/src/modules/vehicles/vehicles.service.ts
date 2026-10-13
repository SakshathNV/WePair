import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new this.vehicleModel({
      ownerId: dto.ownerId,
      category: dto.category,
      fuelType: dto.fuelType,
      make: dto.make,
      model: dto.model,
      registrationNumber: dto.registrationNumber.toUpperCase(),
      year: dto.year,
    });

    return vehicle.save();
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleModel.find().exec();
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id '${id}' not found`);
    }
    return vehicle;
  }

  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    return this.vehicleModel.find({ ownerId }).exec();
  }
}
