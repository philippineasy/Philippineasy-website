'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import PackProgressCard from '@/components/crm/PackProgressCard';
import EntitlementGrid from '@/components/crm/EntitlementGrid';
import StatusBadge from '@/components/crm/StatusBadge';
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
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Services</h1>

      {purchases.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucun achat</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const purchaseEntitlements = entitlements.filter(e => e.purchase_id === purchase.id);
            const isSelected = selectedPurchase === purchase.id;

            return (
              <div key={purchase.id}>
                <PackProgressCard
                  purchase={purchase}
                  entitlements={purchaseEntitlements}
                  onClick={() => setSelectedPurchase(isSelected ? null : purchase.id)}
                />

                {isSelected && purchaseEntitlements.length > 0 && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Détail des droits</h3>
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
