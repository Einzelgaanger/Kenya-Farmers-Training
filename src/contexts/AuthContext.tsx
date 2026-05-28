import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { demoUsers } from '@/data/seed';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
  showIdleWarning: boolean;
  dismissIdleWarning: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PASSWORD = 'Afix2026!';
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const IDLE_WARNING_MS = 25 * 60 * 1000;
const SESSION_KEY = 'afix-session';

function loadSession(): AuthState {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { user: null, isAuthenticated: false };
    const { userId } = JSON.parse(raw) as { userId: string };
    const user = demoUsers.find(u => u.id === userId);
    if (!user) return { user: null, isAuthenticated: false };
    return { user, isAuthenticated: true };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

function saveSession(userId: string | null) {
  if (userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadSession);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSession = useCallback(() => {
    saveSession(null);
    setState({ user: null, isAuthenticated: false });
    setShowIdleWarning(false);
  }, []);

  const resetIdleTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setShowIdleWarning(false);

    if (state.isAuthenticated) {
      warningTimer.current = setTimeout(() => setShowIdleWarning(true), IDLE_WARNING_MS);
      idleTimer.current = setTimeout(clearSession, IDLE_TIMEOUT_MS);
    }
  }, [state.isAuthenticated, clearSession]);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetIdleTimers));
    resetIdleTimers();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimers));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [state.isAuthenticated, resetIdleTimers]);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    if (password !== DEMO_PASSWORD) {
      return { success: false, error: 'Invalid credentials. Use password: Afix2026!' };
    }
    const user = demoUsers.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }
    saveSession(user.id);
    setState({ user, isAuthenticated: true });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'email'>>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      return { ...prev, user: updated };
    });
  }, []);

  const dismissIdleWarning = useCallback(() => {
    setShowIdleWarning(false);
    resetIdleTimers();
  }, [resetIdleTimers]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile, showIdleWarning, dismissIdleWarning }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function getRoleRedirect(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    supplier: '/supplier',
    buyer: '/buyer',
    spv: '/spv',
    admin: '/admin',
  };
  return routes[role];
}
