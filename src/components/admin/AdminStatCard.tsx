import { AdminCard } from './AdminCard';

type Trend = {
  value: number;
  label?: string;
  positive?: boolean;
};

type Props = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: Trend;
  accent?: 'primary' | 'accent' | 'emerald' | 'rose' | 'sky' | 'violet' | 'amber';
};

const ACCENT_BG: Record<NonNullable<Props['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-accent',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  rose: 'bg-rose-500/10 text-rose-600',
  sky: 'bg-sky-500/10 text-sky-600',
  violet: 'bg-violet-500/10 text-violet-600',
  amber: 'bg-amber-500/10 text-amber-600',
};

// KPI / stat card for admin dashboards.
export function AdminStatCard({ label, value, hint, icon, trend, accent = 'primary' }: Props) {
  const trendColor = trend?.positive
    ? 'text-emerald-600 bg-emerald-500/10'
    : trend && !trend.positive
      ? 'text-rose-600 bg-rose-500/10'
      : 'text-muted-foreground bg-muted';
  return (
    <AdminCard padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
            {label}
          </span>
          <span className="block text-[28px] lg:text-[32px] font-bold tracking-[-0.02em] leading-none text-ink tabular-nums">
            {value}
          </span>
          {hint && (
            <span className="mt-2 block text-[12px] text-muted-foreground leading-snug">
              {hint}
            </span>
          )}
          {trend && (
            <span className={['mt-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold tabular-nums', trendColor].join(' ')}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                {trend.positive
                  ? <path d="M7 17 17 7M17 7H8M17 7v9" />
                  : <path d="m17 7-10 10M7 17h9M7 17V8" />}
              </svg>
              {trend.value > 0 ? '+' : ''}{trend.value}{trend.label ? `% ${trend.label}` : '%'}
            </span>
          )}
        </div>
        {icon && (
          <span className={['shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', ACCENT_BG[accent]].join(' ')} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
    </AdminCard>
  );
}
