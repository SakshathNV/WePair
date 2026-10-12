import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserRole } from '../../common/enums/index.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  constructor() {
    // Seed default administrative and demo accounts
    this.create({
      name: 'System Admin',
      phone: '+919876543210',
      email: 'admin@wepair.app',
      role: UserRole.ADMIN,
    });
  }

  create(dto: CreateUserDto): User {
    const existing = Array.from(this.users.values()).find((u) => u.phone === dto.phone);
    if (existing) {
      return existing; // idempotent user lookup
    }

    const user: User = {
      id: `usr_${randomUUID().substring(0, 8)}`,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      role: dto.role ?? UserRole.CUSTOMER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findById(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    return user;
  }

  findByPhone(phone: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.phone === phone);
  }
}
