import { Injectable, NotFoundException } from '@nestjs/common';
import { Provider } from './entities/provider.entity.js';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { ProviderStatus, VehicleCategory } from '../../common/enums/index.js';
import { randomUUID } from 'node:crypto';

export interface RankedCandidate {
  provider: Provider;
  distanceKm: number;
  estimatedEtaMinutes: number;
  score: number;
}

@Injectable()
export class ProvidersService {
  private readonly providers = new Map<string, Provider>();

  constructor() {
    this.seedDemoProviders();
  }

  private seedDemoProviders() {
    // Seed sample roadside mechanics, tow operators, and fuel assistance specialists
    const demo: Partial<Provider>[] = [
      {
        id: 'prov-rajesh-towing',
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
          latitude: 12.9716, // Bangalore Central
          longitude: 77.5946,
          address: 'MG Road, Bangalore',
          updatedAt: new Date(),
        },
      },
      {
        id: 'prov-quickfix-roadside',
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
        },
      },
      {
        id: 'prov-fuel-express',
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
        },
      },
      {
        id: 'prov-apex-mechanics',
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
        },
      },
      {
        id: 'prov-blitz-rescue',
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
        },
      },
      {
        id: 'prov-metro-towing',
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
        },
      },
    ];

    for (const item of demo) {
      const fullProvider: Provider = {
        id: item.id!,
        userId: item.userId!,
        name: item.name!,
        phone: item.phone!,
        skills: item.skills!,
        supportedVehicleCategories: item.supportedVehicleCategories!,
        status: item.status!,
        isVerified: item.isVerified!,
        rating: item.rating!,
        totalJobsCompleted: item.totalJobsCompleted!,
        location: item.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.providers.set(fullProvider.id, fullProvider);
    }
  }

  create(dto: CreateProviderDto): Provider {
    const provider: Provider = {
      id: `prov_${randomUUID().substring(0, 8)}`,
      userId: dto.userId,
      name: dto.name,
      phone: dto.phone,
      skills: dto.skills,
      supportedVehicleCategories: dto.supportedVehicleCategories,
      status: dto.status ?? ProviderStatus.OFFLINE,
      isVerified: true,
      rating: 5.0,
      totalJobsCompleted: 0,
      location:
        dto.initialLatitude && dto.initialLongitude
          ? {
              latitude: dto.initialLatitude,
              longitude: dto.initialLongitude,
              updatedAt: new Date(),
            }
          : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.providers.set(provider.id, provider);
    return provider;
  }

  findAll(): Provider[] {
    return Array.from(this.providers.values());
  }

  findById(id: string): Provider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new NotFoundException(`Provider with id '${id}' not found`);
    }
    return provider;
  }

  findByUserId(userId: string): Provider | undefined {
    return Array.from(this.providers.values()).find((p) => p.userId === userId);
  }

  updateLocation(id: string, dto: UpdateLocationDto): Provider {
    const provider = this.findById(id);
    provider.location = {
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address ?? provider.location?.address,
      city: dto.city ?? provider.location?.city,
      updatedAt: new Date(),
    };
    provider.updatedAt = new Date();
    return provider;
  }

  updateStatus(id: string, status: ProviderStatus): Provider {
    const provider = this.findById(id);
    provider.status = status;
    provider.updatedAt = new Date();
    return provider;
  }

  /**
   * Filter and rank qualified providers per Section 8 of Blueprint
   * 1. Status ONLINE
   * 2. Verified
   * 3. Vehicle compatibility
   * 4. Skills match
   * 5. Ranked by ETA, distance, and rating
   */
  findAndRankEligible(
    incidentLat: number,
    incidentLng: number,
    requiredSkills: string[],
    vehicleCategory: VehicleCategory,
    maxRadiusKm: number = 25,
  ): RankedCandidate[] {
    const candidates: RankedCandidate[] = [];

    for (const provider of this.providers.values()) {
      // 1. Must be online and verified
      if (provider.status !== ProviderStatus.ONLINE || !provider.isVerified) {
        continue;
      }

      // 2. Location must exist
      if (!provider.location) {
        continue;
      }

      // 3. Vehicle compatibility
      if (!provider.supportedVehicleCategories.includes(vehicleCategory)) {
        continue;
      }

      // 4. Skills compatibility (must possess all required skills)
      const hasSkills = requiredSkills.every((skill) => provider.skills.includes(skill));
      if (!hasSkills) {
        continue;
      }

      // 5. Distance calculation (Haversine formula)
      const distanceKm = this.calculateDistanceKm(
        incidentLat,
        incidentLng,
        provider.location.latitude,
        provider.location.longitude,
      );

      if (distanceKm > maxRadiusKm) {
        continue;
      }

      // Estimate ETA: assuming average urban speed of 30 km/h + 5 min dispatch buffer
      const estimatedEtaMinutes = Math.max(5, Math.round((distanceKm / 30) * 60 + 5));

      // Composite score: lower distance is better, higher rating is better
      // score = (50 / (distance + 1)) + (rating * 10)
      const score = 50 / (distanceKm + 1) + provider.rating * 10;

      candidates.push({
        provider,
        distanceKm: Math.round(distanceKm * 10) / 10,
        estimatedEtaMinutes,
        score: Math.round(score * 10) / 10,
      });
    }

    // Rank highest score first (closest ETA + highest reliability)
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
