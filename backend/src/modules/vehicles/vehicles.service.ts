import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from './entities/vehicle.entity.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class VehiclesService {
  private readonly vehicles = new Map<string, Vehicle>();

  create(dto: CreateVehicleDto): Vehicle {
    const vehicle: Vehicle = {
      id: `veh_${randomUUID().substring(0, 8)}`,
      ownerId: dto.ownerId,
      category: dto.category,
      fuelType: dto.fuelType,
      make: dto.make,
      model: dto.model,
      registrationNumber: dto.registrationNumber.toUpperCase(),
      year: dto.year,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  findAll(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  findById(id: string): Vehicle {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id '${id}' not found`);
    }
    return vehicle;
  }

  findByOwnerId(ownerId: string): Vehicle[] {
    return Array.from(this.vehicles.values()).filter((v) => v.ownerId === ownerId);
  }
}
