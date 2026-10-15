import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UserRole } from '../../common/enums/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.role === UserRole.ADMIN) {
      throw new ForbiddenException('Self-registration as administrator is strictly forbidden.');
    }

    const existing = await this.usersService.findByPhone(dto.phone);
    if (existing) {
      throw new ConflictException(`User with phone ${dto.phone} already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.usersService.create({
      phone: dto.phone,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    const userId = (user as any).id || (user as any)._id?.toString();
    const payload = { sub: userId, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Registration successful',
      user: {
        id: userId,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhoneWithPassword(dto.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive. Contact platform support.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password credentials');
    }

    const userId = (user as any).id || (user as any)._id?.toString();
    const payload = { sub: userId, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: userId,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token,
    };
  }
}
