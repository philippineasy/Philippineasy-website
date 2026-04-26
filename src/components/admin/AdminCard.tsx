import { type HTMLAttributes, forwardRef } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
};

const PAD = {
  sm: 'p-4 lg:p-5',
  md: 'p-5 lg:p-6',
  lg: 'p-6 lg:p-8',
};

// Generic admin card — proto-strict 2026 (border-border/60 + shadow-card-rest + rounded-2xl).
export const AdminCard = forwardRef<HTMLDivElement, Props>(function AdminCard(
  { padding = 'md', hoverable = false, className = '', children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        'rounded-2xl bg-card border border-border/60 shadow-card-rest',
        PAD[padding],
        hoverable ? 'transition-all hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
});
