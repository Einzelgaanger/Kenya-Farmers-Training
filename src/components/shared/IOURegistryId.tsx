import { cn } from '@/lib/utils';

interface IOURegistryIdProps {
  id: string;
  className?: string;
}

export default function IOURegistryId({ id, className }: IOURegistryIdProps) {
  return (
    <span className={cn('font-mono text-xs font-medium text-foreground', className)}>
      {id}
    </span>
  );
}
