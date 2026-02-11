'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faShieldAlt, faUsers, faFileDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import type { ServicePurchase, EntitlementSummary } from '@/types/services';
import { FEATURE_DISPLAY } from '@/types/services';

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

const SERVICE_NAMES: Record<string, string> = {
  buddy_short: 'Buddy System — Court Séjour',
  buddy_medium: 'Buddy System — Standard',
  buddy_long: 'Buddy System — Long Séjour',
  voyage_serein_short: 'Pack Voyage Serein — Court',
  voyage_serein_medium: 'Pack Voyage Serein — Standard',
  voyage_serein_long: 'Pack Voyage Serein — Long',
  pack_ultime_medium: 'Pack Ultime — 2 semaines',
  pack_ultime_long: 'Pack Ultime — 3+ semaines',
  pack_ultime_expat: 'Pack Ultime — Expatriation',
  guide_pdf_visa: 'Guide Visa Philippines',
  guide_pdf_cout_vie: 'Guide Coût de la Vie',
  guide_pdf_destinations: 'Guide Destinations Secrètes',
  guide_pdf_pack: 'Pack 3 Guides',
  easy_plus_monthly: 'Easy+ Mensuel',
  easy_plus_yearly: 'Easy+ Annuel',
  easy_plus_lifetime: 'Easy+ À Vie',
  rencontre_premium: 'Rencontre Premium',
};

interface PackProgressCardProps {
  purchase: ServicePurchase;
  entitlements: EntitlementSummary[];
  className?: string;
  onClick?: () => void;
}

export default function PackProgressCard({
  purchase,
  entitlements,
  className,
  onClick,
}: PackProgressCardProps) {
  const icon = getServiceIcon(purchase.service_type);
  const name = SERVICE_NAMES[purchase.service_type] || purchase.service_type;

  // Calculate overall progress
  const totalFeatures = entitlements.length;
  const completedFeatures = entitlements.filter(
    (e) => e.status === 'fully_used' || (e.total !== null && e.used >= (e.total ?? 0))
  ).length;
  const activeFeatures = entitlements.filter(
    (e) => e.status === 'available' || e.status === 'in_use'
  ).length;
  const overallProgress = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;

  const formattedDate = new Date(purchase.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FontAwesomeIcon icon={icon} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {formattedDate} &middot; {purchase.amount_paid}€
            </p>
          </div>
        </div>
        <StatusBadge status={purchase.status} showDot />
      </div>

      {/* Feature rings */}
      {entitlements.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {entitlements.map((e) => {
            const display = FEATURE_DISPLAY[e.feature_type];
            const progress = e.total !== null && e.total > 0
              ? Math.round((e.used / e.total) * 100)
              : e.status === 'available' ? 0 : 100;

            return (
              <div
                key={e.entitlement_id}
                className="flex items-center gap-1.5 text-xs"
                title={display.label}
              >
                <div className="relative w-6 h-6">
                  {/* Background ring */}
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
                    <circle
                      cx="12" cy="12" r="10" fill="none" strokeWidth="2"
                      strokeDasharray={`${progress * 0.628} 62.8`}
                      className={cn(
                        e.status === 'fully_used' ? 'text-emerald-500' :
                        e.status === 'expired' ? 'text-red-400' :
                        'text-primary'
                      )}
                      stroke="currentColor"
                      strokeLinecap="round"
                    />
                  </svg>
                  {e.status === 'fully_used' && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] text-emerald-500">✓</span>
                  )}
                </div>
                <span className="text-muted-foreground truncate max-w-[80px]">
                  {display.label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall progress bar */}
      {totalFeatures > 0 && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{activeFeatures} actif{activeFeatures > 1 ? 's' : ''}</span>
            <span>{overallProgress}% utilisé</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
