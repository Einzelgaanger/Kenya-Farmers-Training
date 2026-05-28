import { useAuth } from '@/contexts/AuthContext';
import { Clock } from 'lucide-react';

export default function IdleWarningModal() {
  const { showIdleWarning, dismissIdleWarning, logout } = useAuth();

  if (!showIdleWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-card rounded-lg shadow-xl border p-6 w-full max-w-sm mx-4 animate-fade-in text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-amber-600" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Session Expiring</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your session will expire in 5 minutes due to inactivity. Would you like to stay signed in?
        </p>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Sign Out
          </button>
          <button
            onClick={dismissIdleWarning}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  );
}
