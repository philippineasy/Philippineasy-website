import { type ReactNode } from 'react';

export type Column<T> = {
  key: string;
  label: ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  empty?: ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
};

// Generic admin table — proto-strict 2026.
// Header: bg-muted/40 + uppercase tracking + border-b
// Body rows: border-b + hover:bg-muted/30 + transition
// Wrapper: rounded-xl + border + overflow-x-auto for mobile.
export function AdminTable<T>({ columns, rows, rowKey, empty, className = '', onRowClick }: Props<T>) {
  if (rows.length === 0 && empty) {
    return <div className={['rounded-2xl border border-border/60 bg-card p-10', className].join(' ')}>{empty}</div>;
  }
  return (
    <div className={['rounded-2xl border border-border/60 bg-card overflow-hidden', className].join(' ')}>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={[
                    'px-4 py-3 font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground',
                    c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left',
                  ].join(' ')}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map((r, i) => (
              <tr
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={[
                  'transition-colors',
                  onRowClick ? 'cursor-pointer hover:bg-muted/30' : 'hover:bg-muted/20',
                ].join(' ')}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[
                      'px-4 py-3 align-middle text-foreground/90',
                      c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left',
                    ].join(' ')}
                  >
                    {c.render(r, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
