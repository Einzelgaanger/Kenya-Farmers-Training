interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5 sm:mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight break-words">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
