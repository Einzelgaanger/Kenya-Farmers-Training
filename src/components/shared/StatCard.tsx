import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  accent?: 'gold' | 'green' | 'blue' | 'red';
}

const accentStyles = {
  gold: 'border-l-gold text-gold',
  green: 'border-l-emerald-500 text-emerald-600',
  blue: 'border-l-blue-500 text-blue-600',
  red: 'border-l-red-500 text-red-600',
};

export default function StatCard({ label, value, icon: Icon, change, accent = 'gold' }: StatCardProps) {
  return (
    <div className={`stat-card border-l-4 ${accentStyles[accent]?.split(' ')[0]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <Icon size={18} className={accentStyles[accent]?.split(' ')[1]} />
      </div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      {change && <p className="text-xs text-muted-foreground mt-1">{change}</p>}
    </div>
  );
}
