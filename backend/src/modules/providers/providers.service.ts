import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from './schemas/provider.schema.js';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { ProviderStatus, VehicleCategory } from '../../common/enums/index.js';

export interface RankedCandidate {
  provider: Provider;
  distanceKm: number;
  estimatedEtaMinutes: number;
  score: number;
}

@Injectable()
export class ProvidersService implements OnModuleInit {
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<ProviderDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.providerModel.countDocuments();
    if (count === 0) {
      await this.seedDemoProviders();
    }
  }

  private async seedDemoProviders() {
    const demoProviders: Partial<Provider>[] = [
      {
        userId: 'usr_rajesh',
        name: 'Rajesh Towing & Recovery',
        phone: '+919811122233',
        skills: ['flatbed_towing', 'hydraulic_towing', 'winch_recovery'],
        supportedVehicleCategories: [
          VehicleCategory.CAR,
          VehicleCategory.SUV,
          VehicleCategory.EV,
          VehicleCategory.COMMERCIAL,
        ],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.9,
        totalJobsCompleted: 142,
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'MG Road, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.5946, 12.9716] },
        },
      },
      {
        userId: 'usr_suresh',
        name: 'QuickFix Roadside Mechanics',
        phone: '+919822233344',
        skills: ['jumpstart', 'electrical_check', 'puncture_repair', 'tyre_replacement'],
        supportedVehicleCategories: [
          VehicleCategory.CAR,
          VehicleCategory.SUV,
          VehicleCategory.TWO_WHEELER,
          VehicleCategory.EV,
        ],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.8,
        totalJobsCompleted: 210,
        location: {
          latitude: 12.978,
          longitude: 77.599,
          address: 'Indiranagar, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.599, 12.978] },
        },
      },
      {
        userId: 'usr_anand',
        name: 'Express Roadside & Fuel Care',
        phone: '+919833344455',
        skills: ['fuel_delivery', 'safety_certified', 'jumpstart'],
        supportedVehicleCategories: [
          VehicleCategory.CAR,
          VehicleCategory.SUV,
          VehicleCategory.TWO_WHEELER,
        ],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.7,
        totalJobsCompleted: 88,
        location: {
          latitude: 12.965,
          longitude: 77.605,
          address: 'Koramangala, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.605, 12.965] },
        },
      },
      {
        userId: 'usr_kiran',
        name: 'Apex Mobile Repairs',
        phone: '+919844455566',
        skills: ['puncture_repair', 'jumpstart', 'obd_diagnostics'],
        supportedVehicleCategories: [
          VehicleCategory.CAR,
          VehicleCategory.SUV,
          VehicleCategory.TWO_WHEELER,
          VehicleCategory.COMMERCIAL,
        ],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.6,
        totalJobsCompleted: 67,
        location: {
          latitude: 12.982,
          longitude: 77.589,
          address: 'Malleshwaram, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.589, 12.982] },
        },
      },
      {
        userId: 'usr_vikram',
        name: 'Blitz Rapid Rescue',
        phone: '+919855566677',
        skills: ['jumpstart', 'puncture_repair', 'tyre_replacement', 'flatbed_towing'],
        supportedVehicleCategories: [VehicleCategory.CAR, VehicleCategory.SUV, VehicleCategory.EV],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.95,
        totalJobsCompleted: 312,
        location: {
          latitude: 12.955,
          longitude: 77.61,
          address: 'HSR Layout, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.61, 12.955] },
        },
      },
      {
        userId: 'usr_arun',
        name: 'Metro Heavy Haulers',
        phone: '+919866677788',
        skills: ['hydraulic_towing', 'flatbed_towing'],
        supportedVehicleCategories: [
          VehicleCategory.COMMERCIAL,
          VehicleCategory.SUV,
          VehicleCategory.CAR,
        ],
        status: ProviderStatus.ONLINE,
        isVerified: true,
        rating: 4.5,
        totalJobsCompleted: 95,
        location: {
          latitude: 12.99,
          longitude: 77.62,
          address: 'Hebbal, Bangalore',
          updatedAt: new Date(),
          geo: { type: 'Point', coordinates: [77.62, 12.99] },
        },
      },
    ];

    await this.providerModel.insertMany(demoProviders);
  }

  async create(dto: CreateProviderDto): Promise<Provider> {
    const location =
      dto.initialLatitude && dto.initialLongitude
        ? {
            latitude: dto.initialLatitude,
            longitude: dto.initialLongitude,
            updatedAt: new Date(),
            geo: {
              type: 'Point',
              coordinates: [dto.initialLongitude, dto.initialLatitude],
            },
          }
        : undefined;

    const provider = new this.providerModel({
      userId: dto.userId,
      name: dto.name,
      phone: dto.phone,
      skills: dto.skills,
      supportedVehicleCategories: dto.supportedVehicleCategories,
      status: dto.status ?? ProviderStatus.OFFLINE,
      isVerified: true,
      rating: 5.0,
      totalJobsCompleted: 0,
      location,
    });

    return provider.save();
  }

  async findAll(): Promise<Provider[]> {
    return this.providerModel.find().exec();
  }

  async findById(id: string): Promise<Provider> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with id '${id}' not found`);
    }
    return provider;
  }

  async findByUserId(userId: string): Promise<Provider | null> {
    return this.providerModel.findOne({ userId }).exec();
  }

  async updateLocation(id: string, dto: UpdateLocationDto): Promise<Provider> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with id '${id}' not found`);
    }

    provider.location = {
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address ?? provider.location?.address,
      city: dto.city ?? provider.location?.city,
      updatedAt: new Date(),
      geo: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      },
    };

    return provider.save();
  }

  async updateStatus(id: string, status: ProviderStatus): Promise<Provider> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with id '${id}' not found`);
    }
    provider.status = status;
    return provider.save();
  }

  /**
   * Filter and rank qualified providers per Section 8 of Blueprint
   * 1. Status ONLINE
   * 2. Verified
   * 3. Vehicle compatibility
   * 4. Skills match
   * 5. Ranked by ETA, distance, and rating
   */
  async findAndRankEligible(
    incidentLat: number,
    incidentLng: number,
    requiredSkills: string[],
    vehicleCategory: VehicleCategory,
    maxRadiusKm: number = 30,
  ): Promise<RankedCandidate[]> {
    // Query online and verified providers who support the vehicle category
    const candidatesQuery = await this.providerModel
      .find({
        status: ProviderStatus.ONLINE,
        isVerified: true,
        supportedVehicleCategories: vehicleCategory,
        'location.latitude': { $exists: true },
      })
      .exec();

    const candidates: RankedCandidate[] = [];

    for (const provider of candidatesQuery) {
      // Skills compatibility: provider must have all required skills
      const hasSkills = requiredSkills.every((skill) => provider.skills.includes(skill));
      if (!hasSkills) {
        continue;
      }

      if (!provider.location?.latitude || !provider.location?.longitude) {
        continue;
      }

      const distanceKm = this.calculateDistanceKm(
        incidentLat,
        incidentLng,
        provider.location.latitude,
        provider.location.longitude,
      );

      if (distanceKm > maxRadiusKm) {
        continue;
      }

      // Estimate ETA: 30 km/h urban speed + 5 min dispatch buffer
      const estimatedEtaMinutes = Math.max(5, Math.round((distanceKm / 30) * 60 + 5));

      // Composite ranking score: distance priority + reliability rating
      const score = 50 / (distanceKm + 1) + provider.rating * 10;

      candidates.push({
        provider,
        distanceKm: Math.round(distanceKm * 10) / 10,
        estimatedEtaMinutes,
        score: Math.round(score * 10) / 10,
      });
    }

    return candidates.sort((a, b) => b.score - a.score);
  }

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
