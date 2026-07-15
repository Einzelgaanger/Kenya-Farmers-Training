import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  accent?: 'blue' | 'green' | 'teal' | 'red';
}

const accentMap = {
  blue: { border: 'border-l-primary', icon: 'text-primary', soft: 'bg-brand-blue-light' },
  green: { border: 'border-l-accent', icon: 'text-accent', soft: 'bg-brand-green-light' },
  teal: { border: 'border-l-sky-500', icon: 'text-sky-600', soft: 'bg-sky-50' },
  red: { border: 'border-l-red-500', icon: 'text-red-600', soft: 'bg-red-50' },
};

export default function StatCard({ label, value, icon: Icon, change, accent = 'blue' }: StatCardProps) {
  const styles = accentMap[accent];
  return (
    <div className={cn('stat-card border-l-4', styles.border)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', styles.soft)}>
          <Icon size={16} className={styles.icon} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      {change && <p className="text-xs text-muted-foreground mt-1">{change}</p>}
    </div>
  );
}
