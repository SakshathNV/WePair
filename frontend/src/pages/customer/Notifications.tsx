import { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Feedback';
import { formatRelativeTime } from '../../utils/helpers';
import type { Notification } from '../../types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Service Provider Assigned',
    message: 'Rajesh Kumar has been assigned to your case #CA-1234',
    type: 'SUCCESS',
    read: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Provider En Route',
    message: 'Your service provider is on the way. ETA: 15 minutes',
    type: 'INFO',
    read: false,
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    title: 'Payment Successful',
    message: 'Payment of ₹2,500 captured for case #CA-1234',
    type: 'SUCCESS',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    title: 'Service Completed',
    message: 'Your roadside assistance service has been completed',
    type: 'SUCCESS',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '5',
    userId: '1',
    title: 'New Service Available',
    message: 'Battery jump-start service now available in your area',
    type: 'INFO',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '6',
    userId: '1',
    title: 'Case Resolved',
    message: 'Your case #CA-1233 has been marked as resolved',
    type: 'SUCCESS',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SUCCESS: CheckCircle,
  INFO: Bell,
  WARNING: AlertCircle,
  ERROR: AlertCircle,
};

const typeColors: Record<string, string> = {
  SUCCESS: 'text-green-400 bg-green-500/10',
  INFO: 'text-blue-400 bg-blue-500/10',
  WARNING: 'text-yellow-400 bg-yellow-500/10',
  ERROR: 'text-red-400 bg-red-500/10',
};

export function CustomerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Notifications</h1>
          <p className="text-slate-400 mt-1">Stay updated on your cases and account activity</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              {filteredNotifications.length} notification(s)
              {unreadCount > 0 && <span className="ml-2">• {unreadCount} unread</span>}
            </CardDescription>
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
            ]}
            className="w-40"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No notifications</h3>
              <p className="text-slate-500 mt-1">
                {filter === 'unread' ? 'All caught up!' : filter === 'read' ? 'No read notifications yet' : 'You\'ll see notifications here when you have activity'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Bell;
                return (
                  <button
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      notification.read
                        ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                        : 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notification.type]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className={`font-medium ${notification.read ? 'text-slate-100' : 'text-slate-100'}`}>
                              {notification.title}
                            </h4>
                            <p className="mt-1 text-sm text-slate-400">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{formatRelativeTime(notification.createdAt)}</span>
                            {!notification.read && (
                              <Badge variant="success" size="sm" dot>New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}