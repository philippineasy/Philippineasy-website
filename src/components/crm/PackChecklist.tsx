'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faXmark, faMinus, faPhone, faMapMarkedAlt, faMap,
  faStar, faHeart, faFileDownload, faUserFriends, faEdit,
  faCrown, faShieldAlt, faUsers, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';
import type { ServicePurchase, EntitlementSummary, FeatureType } from '@/types/services';
import { FEATURE_DISPLAY, PACK_ENTITLEMENTS } from '@/types/services';

const FEATURE_ICONS: Record<string, any> = {
  faPhone, faWhatsapp, faMapMarkedAlt, faMap, faStar, faHeart,
  faFileDownload, faUserFriends, faEdit,
};

const SERVICE_NAMES: Record<string, string> = {
  buddy_short: 'Buddy System — Court Séjour',
  buddy_medium: 'Buddy System — Standard',
  buddy_long: 'Buddy System — Long Séjour',
  voyage_serein_short: 'Voyage Serein — Court',
  voyage_serein_medium: 'Voyage Serein — Standard',
  voyage_serein_long: 'Voyage Serein — Long',
  pack_ultime_medium: 'Pack Ultime — 2 semaines',
  pack_ultime_long: 'Pack Ultime — 3+ semaines',
  pack_ultime_expat: 'Pack Ultime — Expat',
  guide_pdf_visa: 'Guide Visa',
  guide_pdf_cout_vie: 'Guide Coût de la Vie',
  guide_pdf_destinations: 'Guide Destinations',
  guide_pdf_pack: 'Pack 3 Guides',
  easy_plus_monthly: 'Easy+ Mensuel',
  easy_plus_yearly: 'Easy+ Annuel',
  easy_plus_lifetime: 'Easy+ À Vie',
  rencontre_premium: 'Rencontre Premium',
};

const SERVICE_ICONS: Record<string, any> = {
  pack_ultime: faCrown,
  voyage_serein: faShieldAlt,
  buddy: faUsers,
  guide_pdf: faFileDownload,
  easy_plus: faStar,
};

function getServiceIcon(serviceType: string) {
  const prefix = serviceType.replace(/_(?:short|medium|long|expat|monthly|yearly|lifetime|visa|cout_vie|destinations|pack)$/, '');
  return SERVICE_ICONS[prefix] || faStar;
}

interface PackChecklistProps {
  purchase: ServicePurchase;
  entitlements: EntitlementSummary[];
  onValidate: (entitlementId: string) => Promise<void>;
}

export default function PackChecklist({ purchase, entitlements, onValidate }: PackChecklistProps) {
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const name = SERVICE_NAMES[purchase.service_type] || purchase.service_type;
  const icon = getServiceIcon(purchase.service_type);
  const expectedFeatures = PACK_ENTITLEMENTS[purchase.service_type] || [];

  // Map expected features to actual entitlements
  const checklistItems = expectedFeatures.map((expected) => {
    const entitlement = entitlements.find(
      (e) => e.feature_type === expected.feature_type
    );
    return { expected, entitlement };
  });

  // Calculate progress
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(
    ({ entitlement }) => entitlement?.status === 'fully_used'
  ).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const formattedDate = new Date(purchase.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleValidate = async (entitlementId: string) => {
    setValidatingId(entitlementId);
    try {
      await onValidate(entitlementId);
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div className="sticky top-6 bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FontAwesomeIcon icon={icon} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {purchase.amount_paid}€ &middot; {formattedDate}
            </p>
          </div>
          <StatusBadge status={purchase.status} showDot />
        </div>
      </div>

      {/* Checklist items */}
      <div className="p-2">
        {checklistItems.map(({ expected, entitlement }, idx) => {
          const display = FEATURE_DISPLAY[expected.feature_type];
          const featureIcon = FEATURE_ICONS[display.icon] || faCheck;
          const status = entitlement?.status || 'available';
          const isValidating = validatingId === entitlement?.entitlement_id;

          return (
            <div
              key={`${expected.feature_type}-${idx}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                status === 'fully_used' && 'opacity-60',
                status === 'expired' && 'opacity-40',
                !entitlement && 'opacity-50',
              )}
            >
              {/* Status checkbox */}
              <CheckboxIcon
                status={status}
                hasEntitlement={!!entitlement}
                isValidating={isValidating}
                onClick={
                  entitlement && status === 'available' && !isValidating
                    ? () => handleValidate(entitlement.entitlement_id)
                    : undefined
                }
              />

              {/* Feature icon + label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={featureIcon}
                    className={cn(
                      'text-xs',
                      status === 'fully_used' ? 'text-emerald-500' :
                      status === 'expired' ? 'text-red-400' :
                      status === 'in_use' ? 'text-primary' :
                      'text-muted-foreground'
                    )}
                  />
                  <span className="text-sm font-medium truncate">{display.label}</span>
                </div>

                {/* Inline progress for quantity-based */}
                {entitlement && entitlement.total !== null && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          status === 'fully_used' ? 'bg-emerald-500' : 'bg-primary'
                        )}
                        style={{ width: `${Math.min(((entitlement.used / (entitlement.total || 1)) * 100), 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                      {entitlement.used}/{entitlement.total}
                    </span>
                  </div>
                )}
              </div>

              {/* Right badge */}
              <div className="flex-shrink-0">
                {entitlement && display.isTimeBased && entitlement.expires_at && status !== 'expired' && status !== 'fully_used' ? (
                  <CountdownTimer expiresAt={entitlement.expires_at} className="text-[11px]" />
                ) : status === 'fully_used' ? (
                  <span className="text-[11px] font-medium text-emerald-600">Fait</span>
                ) : status === 'expired' ? (
                  <span className="text-[11px] font-medium text-red-500">Expiré</span>
                ) : status === 'in_use' && !display.isTimeBased && entitlement?.total === null ? (
                  <span className="text-[11px] font-medium text-primary">Actif</span>
                ) : !entitlement ? (
                  <span className="text-[11px] font-medium text-muted-foreground">--</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer progress */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <span>{completedItems}/{totalItems} terminé{completedItems > 1 ? 's' : ''}</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-primary'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: interactive checkbox icon ---

function CheckboxIcon({
  status,
  hasEntitlement,
  isValidating,
  onClick,
}: {
  status: string;
  hasEntitlement: boolean;
  isValidating: boolean;
  onClick?: () => void;
}) {
  if (isValidating) {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-primary animate-spin text-xs" />
      </div>
    );
  }

  if (status === 'fully_used') {
    return (
      <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
        <FontAwesomeIcon icon={faCheck} className="text-white text-[10px]" />
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="w-5 h-5 rounded bg-red-500/10 flex items-center justify-center">
        <FontAwesomeIcon icon={faXmark} className="text-red-500 text-[10px]" />
      </div>
    );
  }

  if (status === 'in_use') {
    return (
      <div className="w-5 h-5 rounded bg-primary/10 border-2 border-primary flex items-center justify-center">
        <FontAwesomeIcon icon={faMinus} className="text-primary text-[10px]" />
      </div>
    );
  }

  // available or no entitlement
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
        onClick
          ? 'border-muted-foreground/40 hover:border-primary hover:bg-primary/5 cursor-pointer'
          : 'border-muted-foreground/20 cursor-default'
      )}
    />
  );
}
