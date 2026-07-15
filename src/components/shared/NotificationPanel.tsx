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
      <div className="fixed inset-0 z-[60] bg-slate-900/35 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed z-[70] inset-x-3 bottom-[calc(var(--tab-bar-h)+var(--safe-bottom)+0.5rem)] sm:inset-auto sm:top-[max(1rem,var(--safe-top))] sm:right-4 sm:bottom-auto w-auto sm:w-full sm:max-w-sm glass-strong rounded-3xl shadow-2xl animate-fade-in overflow-hidden max-h-[70dvh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/40 shrink-0">
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
                className="touch-target rounded-xl hover:bg-white/50 text-muted-foreground"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
            )}
            <button onClick={onClose} className="touch-target rounded-xl hover:bg-white/50" aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto scroll-touch divide-y divide-border/40 flex-1">
          {userNotifs.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">No notifications</p>
          ) : (
            userNotifs.slice(0, 20).map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n.id, n.link)}
                className={`w-full text-left px-4 py-3.5 hover:bg-white/50 active:bg-primary/5 transition-colors min-h-[64px] ${!n.read ? 'bg-primary/[0.04]' : ''}`}
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
