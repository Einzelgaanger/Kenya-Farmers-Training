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
    setPassword('Afix2026!');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B3A6E] via-[#1B6BB5] to-[#1A7A4C] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white tracking-tight">AFIX</span>
          </div>
          <p className="text-white/70 text-sm">Private-Sector Trade Receivables Platform</p>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-3xl text-white leading-tight">
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
        <p className="relative z-10 text-white/50 text-xs">© 2026 AFIX · Private-sector receivables</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: 'url(/auth-bg.png)' }}
          aria-hidden
        />
        {/* Light overlay — keeps form readable */}
        <div className="absolute inset-0 bg-white/78 backdrop-blur-[2px]" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-primary/5" aria-hidden />

        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-white/60 bg-white/90 shadow-xl shadow-black/5 backdrop-blur-md p-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <ShieldCheck size={24} className="text-primary" />
            <span className="font-display text-xl font-bold">AFIX</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-8">Enter your credentials to access the platform</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.co.ke"
                required
                className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Demo Accounts</p>
            <div className="space-y-1.5">
              {demoUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u.email)}
                  className="w-full text-left px-3 py-2 rounded-md text-xs hover:bg-secondary transition-colors flex justify-between items-center"
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="text-muted-foreground capitalize">{u.role}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Password for all: <code className="font-mono bg-secondary px-1 rounded">Afix2026!</code></p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
