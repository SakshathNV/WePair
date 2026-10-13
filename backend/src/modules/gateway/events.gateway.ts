import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly userSockets = new Map<string, string>(); // userId -> socketId

  afterInit() {
    this.logger.log('EventsGateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    } else {
      this.logger.log(`Client connected anonymously: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-job')
  handleJoinJob(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jobId: string },
  ) {
    if (data?.jobId) {
      client.join(`job:${data.jobId}`);
      this.logger.log(`Socket ${client.id} joined room job:${data.jobId}`);
      return { status: 'joined', jobId: data.jobId };
    }
  }

  @SubscribeMessage('leave-job')
  handleLeaveJob(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jobId: string },
  ) {
    if (data?.jobId) {
      client.leave(`job:${data.jobId}`);
      return { status: 'left', jobId: data.jobId };
    }
  }

  @SubscribeMessage('provider-location')
  handleProviderLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      jobId: string;
      providerId: string;
      latitude: number;
      longitude: number;
      heading?: number;
    },
  ) {
    if (data?.jobId) {
      // Broadcast live GPS coordinate update to all listeners in the job room (customer & admin)
      this.server.to(`job:${data.jobId}`).emit('location-update', {
        providerId: data.providerId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Public methods callable by other backend services:
  emitJobUpdate(jobId: string, status: string, data?: Record<string, any>) {
    if (this.server) {
      this.server.to(`job:${jobId}`).emit('job-status-update', {
        jobId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }

  emitDispatchNotification(providerIds: string[], jobData: Record<string, any>) {
    if (this.server) {
      for (const providerId of providerIds) {
        this.server.to(`user:${providerId}`).emit('new-dispatch', {
          job: jobData,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    if (this.server) {
      this.server.to(`user:${userId}`).emit(event, payload);
    }
  }
}
