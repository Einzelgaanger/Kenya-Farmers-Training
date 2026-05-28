import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, X } from 'lucide-react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!open || !user) return null;

  const userNotifs = notifications.filter(n => n.userId === user.id);
  const unread = userNotifs.filter(n => !n.read);

  const handleClick = (notifId: string, link?: string) => {
    markAsRead(notifId);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm bg-card border rounded-lg shadow-lg animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unread.length > 0 && (
              <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                {unread.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread.length > 0 && (
              <button
                onClick={() => markAllAsRead(user.id)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y">
          {userNotifs.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
          ) : (
            userNotifs.slice(0, 20).map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n.id, n.link)}
                className={`w-full text-left px-4 py-3 hover:bg-secondary/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
