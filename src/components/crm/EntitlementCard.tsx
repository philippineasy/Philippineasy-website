'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faComments, faMapMarkedAlt, faMap, faStar, faHeart,
  faFileDownload, faUserFriends, faEdit, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';
import type { EntitlementSummary, FeatureType } from '@/types/services';
import { FEATURE_DISPLAY } from '@/types/services';

const FEATURE_ICONS: Record<string, any> = {
  faPhone, faWhatsapp, faMapMarkedAlt, faMap, faStar, faHeart,
  faFileDownload, faUserFriends, faEdit,
};

interface EntitlementCardProps {
  entitlement: EntitlementSummary;
  onValidate?: (entitlementId: string) => void;
  showValidateButton?: boolean;
  className?: string;
}

export default function EntitlementCard({
  entitlement,
  onValidate,
  showValidateButton = false,
  className,
}: EntitlementCardProps) {
  const display = FEATURE_DISPLAY[entitlement.feature_type];
  const icon = FEATURE_ICONS[display.icon] || faCheck;

  const progress = entitlement.total !== null && entitlement.total > 0
    ? (entitlement.used / entitlement.total) * 100
    : null;

  const progressColor =
    progress === null ? 'bg-primary'
    : progress >= 100 ? 'bg-neutral-400'
    : progress >= 66 ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors',
        entitlement.status === 'fully_used' && 'opacity-60',
        entitlement.status === 'expired' && 'opacity-40',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm',
            entitlement.status === 'fully_used' ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800' :
            entitlement.status === 'expired' ? 'bg-red-50 text-red-400 dark:bg-red-900/20' :
            'bg-primary/10 text-primary'
          )}>
            <FontAwesomeIcon icon={icon} />
          </div>
          <span className="font-medium text-sm">{display.label}</span>
        </div>
        <StatusBadge status={entitlement.status} />
      </div>

      {/* Progress bar for quantity-based features */}
      {entitlement.total !== null && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{entitlement.used}/{entitlement.total} {display.unit}</span>
            {entitlement.remaining !== null && entitlement.remaining > 0 && (
              <span>{entitlement.remaining} restant{entitlement.remaining > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', progressColor)}
              style={{ width: `${Math.min(progress || 0, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Countdown for time-based features */}
      {display.isTimeBased && entitlement.expires_at && entitlement.status !== 'expired' && (
        <CountdownTimer expiresAt={entitlement.expires_at} />
      )}

      {/* Download indicator for guides */}
      {entitlement.feature_type.startsWith('guide_pdf_') && entitlement.status === 'fully_used' && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <FontAwesomeIcon icon={faCheck} />
          <span>Téléchargé</span>
        </div>
      )}

      {/* Admin validate button */}
      {showValidateButton && onValidate && entitlement.status === 'available' && (
        <button
          onClick={() => onValidate(entitlement.entitlement_id)}
          className="mt-3 w-full py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          Valider l&apos;utilisation
        </button>
      )}
    </div>
  );
}
