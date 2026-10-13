import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';

@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findByRecipientId(@Query('recipientId') recipientId: string) {
    return this.notificationsService.findByRecipientId(recipientId);
  }

  @Get('unread-count/:recipientId')
  getUnreadCount(@Param('recipientId') recipientId: string) {
    return this.notificationsService.getUnreadCount(recipientId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all/:recipientId')
  markAllAsRead(@Param('recipientId') recipientId: string) {
    return this.notificationsService.markAllAsRead(recipientId);
  }
}
