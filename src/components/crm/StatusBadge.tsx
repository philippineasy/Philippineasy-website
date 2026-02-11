'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        in_use: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        fully_used: 'bg-neutral-500/10 text-neutral-500',
        expired: 'bg-red-500/10 text-red-500',
        pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        paid: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        cancelled: 'bg-neutral-500/10 text-neutral-500',
        refunded: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        confirmed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        no_show: 'bg-red-500/10 text-red-500',
        open: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        closed: 'bg-neutral-500/10 text-neutral-500',
        waiting_customer: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        waiting_admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        activating: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      pulse: false,
    },
  }
);

const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  in_use: 'En cours',
  fully_used: 'Utilisé',
  expired: 'Expiré',
  pending: 'En attente',
  active: 'Actif',
  paid: 'Payé',
  activating: 'Activation...',
  cancelled: 'Annulé',
  refunded: 'Remboursé',
  scheduled: 'Planifié',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  no_show: 'Absent',
  open: 'Ouvert',
  closed: 'Fermé',
  waiting_customer: 'Attente client',
  waiting_admin: 'Attente admin',
};

const STATUS_DOTS: Record<string, string> = {
  available: 'bg-emerald-500',
  in_use: 'bg-blue-500',
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  activating: 'bg-amber-500',
  expired: 'bg-red-500',
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: string;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export default function StatusBadge({
  status,
  label,
  className,
  showDot = false,
  pulse,
}: StatusBadgeProps) {
  const variant = status as any;
  const displayLabel = label || STATUS_LABELS[status] || status;
  const dotColor = STATUS_DOTS[status];

  return (
    <span className={cn(statusBadgeVariants({ variant, pulse }), className)}>
      {showDot && dotColor && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
      )}
      {displayLabel}
    </span>
  );
}
