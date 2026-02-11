'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCalendar, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import EntitlementGrid from '@/components/crm/EntitlementGrid';
import PackProgressCard from '@/components/crm/PackProgressCard';
import type { ServicePurchase, EntitlementSummary } from '@/types/services';

export default function MonEspaceDashboard() {
  const { user, profile } = useAuth();
  const [purchases, setPurchases] = useState<ServicePurchase[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementSummary[]>([]);
  const [nextCall, setNextCall] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    const [purchasesRes, entitlementsRes, callsRes, messagesRes] = await Promise.all([
      supabase
        .from('service_purchases')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .is('parent_purchase_id', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('purchase_entitlements')
        .select('*')
        .eq('user_id', user!.id)
        .in('status', ['available', 'in_use'])
        .order('created_at', { ascending: true }),
      supabase
        .from('call_bookings')
        .select('*, call_slots(*)')
        .eq('user_id', user!.id)
        .in('status', ['scheduled', 'confirmed'])
        .not('scheduled_at', 'is', null)
        .order('scheduled_at', { ascending: true })
        .limit(1),
      supabase
        .from('crm_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin_message', true)
        .eq('is_read', false),
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

    setNextCall(callsRes.data?.[0] || null);
    setUnreadMessages(messagesRes.count || 0);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  const username = profile?.username || 'Voyageur';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {username} !</h1>
        <p className="text-muted-foreground mt-1">
          {purchases.length > 0
            ? 'Voici vos services actifs.'
            : 'Découvrez nos services pour votre voyage aux Philippines.'}
        </p>
      </div>

      {/* Top row: Pack summary + next call */}
      {purchases.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {purchases.slice(0, 2).map((purchase) => (
            <PackProgressCard
              key={purchase.id}
              purchase={purchase}
              entitlements={entitlements.filter(e => e.purchase_id === purchase.id)}
              onClick={() => window.location.href = '/mon-espace/services'}
            />
          ))}

          {nextCall && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCalendar} className="text-primary" />
                <h3 className="font-semibold text-sm">Prochain appel</h3>
              </div>
              <p className="text-lg font-bold">
                {new Date(nextCall.scheduled_at).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <p className="text-muted-foreground text-sm">
                {new Date(nextCall.scheduled_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {nextCall.meeting_url && (
                <a
                  href={nextCall.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  Rejoindre
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Entitlements summary */}
      {entitlements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Vos droits restants</h2>
          <EntitlementGrid entitlements={entitlements} compact />
        </div>
      )}

      {/* Unread messages */}
      {unreadMessages > 0 && (
        <Link
          href="/mon-espace/messages"
          className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 hover:bg-primary/10 transition-colors"
        >
          <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
          <span className="text-sm font-medium">
            {unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}
          </span>
          <FontAwesomeIcon icon={faArrowRight} className="text-primary ml-auto" />
        </Link>
      )}

      {/* Empty state */}
      {purchases.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Aucun service actif</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Découvrez nos packs d&apos;accompagnement pour votre voyage aux Philippines
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            Voir les services <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      )}
    </div>
  );
}
