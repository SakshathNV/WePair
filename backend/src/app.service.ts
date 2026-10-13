import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: mongoose.Connection) {}

  getHello(): string {
    return 'WePair API is operational';
  }

  getHealth() {
    const isConnected = this.connection.readyState === 1;
    return {
      status: isConnected ? 'healthy' : 'degraded',
      platform: 'WePair Automobile Public Service Platform',
      database: {
        provider: 'MongoDB Atlas',
        state: isConnected ? 'connected' : 'disconnected',
        readyState: this.connection.readyState,
        name: this.connection.name,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
