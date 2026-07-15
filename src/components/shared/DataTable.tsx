interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  /** Prefer showing this column first on very small screens */
  primary?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, onRowClick, emptyMessage = 'No data available' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="surface-card text-center py-14 px-4 text-muted-foreground">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="surface-card">
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border/50">
        {data.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onRowClick?.(item)}
            className={`w-full text-left p-4 space-y-2.5 transition-colors active:bg-primary/[0.05] ${onRowClick ? '' : 'cursor-default'}`}
            disabled={!onRowClick}
          >
            {columns.map(col => (
              <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-xs text-muted-foreground shrink-0 pt-0.5 w-24">{col.header}</span>
                <div className="text-right min-w-0 flex-1">{col.render(item)}</div>
              </div>
            ))}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto scroll-touch">
        <table className="data-table min-w-full">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.className}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map(col => (
                  <td key={col.key} className={col.className}>{col.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
