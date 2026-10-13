import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    channel: string = 'IN_APP',
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      recipientId,
      type,
      title,
      message,
      channel,
      data,
      isRead: false,
    });
    return notification.save();
  }

  async findByRecipientId(recipientId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with id '${id}' not found`);
    }
    notification.isRead = true;
    return notification.save();
  }

  async markAllAsRead(recipientId: string): Promise<{ updatedCount: number }> {
    const result = await this.notificationModel
      .updateMany({ recipientId, isRead: false }, { $set: { isRead: true } })
      .exec();
    return { updatedCount: result.modifiedCount };
  }

  async getUnreadCount(recipientId: string): Promise<{ unreadCount: number }> {
    const count = await this.notificationModel
      .countDocuments({ recipientId, isRead: false })
      .exec();
    return { unreadCount: count };
  }
}
