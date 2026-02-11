'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faShoppingCart, faPhone, faComments, faStickyNote,
  faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '@/utils/supabase/client';
import StatusBadge from '@/components/crm/StatusBadge';
import EntitlementGrid from '@/components/crm/EntitlementGrid';
import PackProgressCard from '@/components/crm/PackProgressCard';
import CRMChat from './CRMChat';
import AdminNotes from './AdminNotes';
import type { ServicePurchase, EntitlementSummary } from '@/types/services';

interface CustomerData {
  id: string;
  username: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  customer_since: string | null;
  total_spent: number;
  whatsapp_number: string | null;
  easy_plus_expires_at: string | null;
  rencontre_premium_expires_at: string | null;
  created_at: string;
}

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: faChartPie },
  { id: 'purchases', label: 'Achats', icon: faShoppingCart },
  { id: 'calls', label: 'Appels', icon: faPhone },
  { id: 'messages', label: 'Messages', icon: faComments },
  { id: 'notes', label: 'Notes', icon: faStickyNote },
] as const;

type TabId = typeof TABS[number]['id'];

interface Props {
  customer: CustomerData;
  adminId: string;
}

export default function CustomerDetailTabs({ customer, adminId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [purchases, setPurchases] = useState<ServicePurchase[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementSummary[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [customer.id]);

  const fetchData = async () => {
    setLoading(true);

    const [purchasesRes, entitlementsRes, callsRes] = await Promise.all([
      supabase
        .from('service_purchases')
        .select('*')
        .eq('user_id', customer.id)
        .is('parent_purchase_id', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('purchase_entitlements')
        .select('*')
        .eq('user_id', customer.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('call_bookings')
        .select('*, call_slots(*)')
        .eq('user_id', customer.id)
        .order('scheduled_at', { ascending: true, nullsFirst: false }),
    ]);

    setPurchases(purchasesRes.data || []);
    setCalls(callsRes.data || []);

    // Map entitlements to summary format
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

  const handleValidateEntitlement = async (entitlementId: string) => {
    const { consumeEntitlement } = await import('@/services/entitlementService');
    await consumeEntitlement(supabase, entitlementId, adminId);
    fetchData();
  };

  return (
    <div>
      {/* Header */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour aux clients
      </Link>

      <div className="flex items-start gap-4 mb-8">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {customer.avatar_url ? (
            <Image src={customer.avatar_url} alt={customer.username} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
              {customer.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{customer.username}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {customer.location && <span>{customer.location}</span>}
            {customer.customer_since && (
              <span>Client depuis {new Date(customer.customer_since).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
            )}
            <span className="font-medium text-foreground">{customer.total_spent}€ dépensés</span>
          </div>
        </div>
        {customer.whatsapp_number && (
          <a
            href={`https://wa.me/${customer.whatsapp_number.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
            WhatsApp
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Services actifs</h2>
          {purchases.filter(p => p.status === 'active').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {purchases.filter(p => p.status === 'active').map((purchase) => (
                <PackProgressCard
                  key={purchase.id}
                  purchase={purchase}
                  entitlements={entitlements.filter(e => e.purchase_id === purchase.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aucun service actif</p>
          )}

          <h2 className="text-lg font-semibold mt-8">Droits & Quotas</h2>
          <EntitlementGrid
            entitlements={entitlements.filter(e => e.status === 'available' || e.status === 'in_use')}
            showValidateButton
            onValidate={handleValidateEntitlement}
          />
        </div>
      )}

      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucun achat</p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{purchase.service_type}</span>
                  <StatusBadge status={purchase.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{purchase.amount_paid}€</span>
                  <span>{new Date(purchase.created_at).toLocaleDateString('fr-FR')}</span>
                  {purchase.stripe_checkout_session_id && (
                    <span className="font-mono truncate max-w-[200px]">{purchase.stripe_checkout_session_id}</span>
                  )}
                </div>
                {/* Entitlements for this purchase */}
                <div className="mt-3">
                  <EntitlementGrid
                    entitlements={entitlements.filter(e => e.purchase_id === purchase.id)}
                    compact
                    showValidateButton
                    onValidate={handleValidateEntitlement}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'calls' && (
        <div className="space-y-4">
          {calls.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucun appel</p>
          ) : (
            calls.map((call: any) => (
              <div key={call.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      Call {call.call_number}/{call.total_calls}
                    </span>
                    <StatusBadge status={call.status} />
                  </div>
                  {call.scheduled_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(call.scheduled_at).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {call.admin_notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{call.admin_notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {call.status === 'confirmed' && (
                    <button
                      onClick={async () => {
                        const { updateCallStatus } = await import('@/services/callService');
                        await updateCallStatus(supabase, call.id, 'completed');
                        // Also consume the call entitlement
                        const callEntitlement = entitlements.find(
                          e => e.feature_type === 'call_30min' && e.status === 'available' && e.purchase_id === call.purchase_id
                        );
                        if (callEntitlement) {
                          await handleValidateEntitlement(callEntitlement.entitlement_id);
                        }
                        fetchData();
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20"
                    >
                      Marquer terminé
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <CRMChat customerId={customer.id} adminId={adminId} />
      )}

      {activeTab === 'notes' && (
        <AdminNotes customerId={customer.id} adminId={adminId} />
      )}
    </div>
  );
}
