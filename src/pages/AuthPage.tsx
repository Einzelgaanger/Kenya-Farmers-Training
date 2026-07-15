import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleRedirect } from '@/contexts/AuthContext';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { demoUsers } from '@/data/seed';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const user = demoUsers.find(u => u.email === email);
      if (user) navigate(getRoleRedirect(user.role));
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword('AFIX2026!');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row">
      {/* Left branding — compact strip on mobile, full panel on desktop */}
      <div className="relative lg:w-1/2 lg:min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B3A6E] via-[#1B6BB5] to-[#1A7A4C]" />
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        <div className="relative z-10 safe-pad-x safe-pad-top px-6 py-8 lg:p-12 lg:h-full lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-white/15 glass-dark border-white/20 flex items-center justify-center">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">AFIX</span>
            </div>
            <p className="text-white/70 text-sm">Private-Sector Trade Receivables Platform</p>
          </div>
          <div className="hidden lg:block space-y-6 mt-12">
            <h2 className="font-display text-3xl xl:text-4xl text-white leading-tight">
              Transforming receivables<br />into liquid capital
            </h2>
            <div className="space-y-3">
              {['End-to-end invoice lifecycle management', 'Institutional-grade securitisation engine', 'Multi-party consent & assignment workflow'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span className="text-white/85 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="hidden lg:block text-white/50 text-xs mt-auto">© 2026 AFIX · Private-sector receivables</p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 relative flex items-start lg:items-center justify-center px-4 py-6 sm:p-8 overflow-hidden safe-pad-bottom">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: 'url(/auth-bg.png)' }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-brand-blue-light/80 backdrop-blur-[3px]" aria-hidden />

        <div className="relative z-10 w-full max-w-md -mt-8 lg:mt-0">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Sign in</h1>
            <p className="text-sm text-muted-foreground mb-6 sm:mb-8">Enter your credentials to access the platform</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.co.ke"
                  required
                  autoComplete="email"
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    className="input-glass pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 touch-target text-muted-foreground hover:text-foreground rounded-xl"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Demo Accounts</p>
              <div className="grid grid-cols-1 gap-1.5">
                {demoUsers.slice(0, 4).map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => quickLogin(u.email)}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-sm hover:bg-white/70 active:scale-[0.99] transition-all flex justify-between items-center min-h-[48px] border border-transparent hover:border-primary/10"
                  >
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground capitalize text-xs bg-secondary/80 px-2 py-0.5 rounded-full">{u.role}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Password for all: <code className="font-mono bg-white/70 px-1.5 py-0.5 rounded-md">AFIX2026!</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
