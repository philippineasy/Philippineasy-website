'use client';

import { cn } from '@/lib/utils';
import EntitlementCard from './EntitlementCard';
import type { EntitlementSummary } from '@/types/services';

interface EntitlementGridProps {
  entitlements: EntitlementSummary[];
  onValidate?: (entitlementId: string) => void;
  showValidateButton?: boolean;
  className?: string;
  compact?: boolean;
}

export default function EntitlementGrid({
  entitlements,
  onValidate,
  showValidateButton = false,
  className,
  compact = false,
}: EntitlementGridProps) {
  if (entitlements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucun droit actif
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-3',
      compact ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {entitlements.map((entitlement) => (
        <EntitlementCard
          key={entitlement.entitlement_id}
          entitlement={entitlement}
          onValidate={onValidate}
          showValidateButton={showValidateButton}
        />
      ))}
    </div>
  );
}
