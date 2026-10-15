import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserRole } from '../../common/enums/index.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    // Seed default admin account if not already present
    const count = await this.userModel.countDocuments();
    if (count === 0) {
      const defaultAdminPassword =
        process.env.ADMIN_INITIAL_PASSWORD || 'Admin@WePair2026!';
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
      await this.userModel.create({
        phone: '+919876543210',
        name: 'System Admin',
        email: 'admin@wepair.app',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });
    }
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ phone: dto.phone }).exec();
    if (existing) {
      return existing; // idempotent lookup
    }

    const passwordToStore =
      dto.password || (await bcrypt.hash('Welcome@WePair2026!', 10));

    const created = new this.userModel({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      password: passwordToStore,
      role: dto.role ?? UserRole.CUSTOMER,
      isActive: true,
    });

    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByPhoneWithPassword(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).select('+password').exec();
  }
}
