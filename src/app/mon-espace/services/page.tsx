'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import PackProgressCard from '@/components/crm/PackProgressCard';
import EntitlementGrid from '@/components/crm/EntitlementGrid';
import type { ServicePurchase, EntitlementSummary } from '@/types/services';

export default function MesServicesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<ServicePurchase[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementSummary[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [purchasesRes, entitlementsRes] = await Promise.all([
      supabase
        .from('service_purchases')
        .select('*')
        .eq('user_id', user!.id)
        .is('parent_purchase_id', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('purchase_entitlements')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true }),
    ]);

    setPurchases(purchasesRes.data || []);

    const summaries: EntitlementSummary[] = (entitlementsRes.data || []).map((e: any) => ({
      feature_type: e.feature_type,
      total: e.total_quantity,
      used: e.used_quantity,
      remaining: e.total_quantity !== null ? Math.max(0, e.total_quantity - e.used_quantity) : null,
      status: e.status,
      expires_at: e.expires_at,
      starts_at: e.starts_at,
      purchase_id: e.purchase_id,
      entitlement_id: e.id,
    }));
    setEntitlements(summaries);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + breadcrumb */}
      <div className="space-y-4">
        <nav aria-label="Fil d'ariane" className="text-[12px] uppercase tracking-[0.12em]">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link
                href="/mon-espace"
                className="rounded font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Mon espace
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">Services</span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
            Mes <span className="text-accent-strong">services</span>
          </h1>
          <p className="mt-2 max-w-[62ch] text-[14.5px] text-muted-foreground">
            Vos packs d&apos;accompagnement et leur progression. Cliquez sur un pack pour voir le détail des droits.
          </p>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 text-center lg:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Package className="h-6 w-6" />
          </span>
          <h2 className="text-[18px] font-bold text-ink">Aucun service pour le moment</h2>
          <p className="mx-auto mb-5 mt-1 max-w-[42ch] text-[13.5px] leading-snug text-muted-foreground">
            Vous n&apos;avez pas encore de pack actif. Explorez nos formules d&apos;accompagnement pour votre séjour.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Voir les services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const purchaseEntitlements = entitlements.filter((e) => e.purchase_id === purchase.id);
            const isSelected = selectedPurchase === purchase.id;

            return (
              <div key={purchase.id}>
                <PackProgressCard
                  purchase={purchase}
                  entitlements={purchaseEntitlements}
                  onClick={() => setSelectedPurchase(isSelected ? null : purchase.id)}
                />

                {isSelected && purchaseEntitlements.length > 0 && (
                  <div className="ml-4 mt-3 border-l-2 border-primary/20 pl-4">
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Détail des droits
                    </h3>
                    <EntitlementGrid entitlements={purchaseEntitlements} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
