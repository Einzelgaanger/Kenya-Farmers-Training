import { useMemo } from 'react';
import { useNotifications as useNotificationContext } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export function useUserNotifications() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotificationContext();

  const userNotifications = useMemo(
    () => (user ? notifications.filter(n => n.userId === user.id) : []),
    [notifications, user]
  );

  const userUnreadCount = useMemo(
    () => userNotifications.filter(n => !n.read).length,
    [userNotifications]
  );

  return {
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    markAsRead,
    markAllAsRead: () => user && markAllAsRead(user.id),
    addNotification,
  };
}
