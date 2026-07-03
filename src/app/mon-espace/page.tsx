'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CalendarClock, ArrowRight, Loader2, Video, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import EntitlementGrid from '@/components/crm/EntitlementGrid';
import PackProgressCard from '@/components/crm/PackProgressCard';
import { WhatsAppGate } from '@/components/crm/WhatsAppGate';
import type { ServicePurchase, EntitlementSummary } from '@/types/services';

export default function MonEspaceDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
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
        .eq('is_read', false)
        .eq('to_user_id', user!.id),
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  const username = profile?.username || 'Voyageur';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
          Tableau de bord
        </span>
        <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
          Bonjour <span className="text-accent-strong">{username}</span>
        </h1>
        <p className="mt-2 text-[14.5px] text-muted-foreground">
          {purchases.length > 0
            ? 'Voici un aperçu de vos services actifs.'
            : 'Découvrez nos services pour votre voyage aux Philippines.'}
        </p>
      </div>

      {/* WhatsApp gate — only renders if user has active whatsapp_support entitlement */}
      <WhatsAppGate
        userId={user!.id}
        entitlements={entitlements}
        whatsappNumber={profile?.whatsapp_number}
      />

      {/* Top row: Pack summary + next call */}
      {purchases.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {purchases.slice(0, 2).map((purchase) => (
            <PackProgressCard
              key={purchase.id}
              purchase={purchase}
              entitlements={entitlements.filter((e) => e.purchase_id === purchase.id)}
              onClick={() => router.push('/mon-espace/services')}
            />
          ))}

          {nextCall && (
            <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                  <CalendarClock className="h-4 w-4" />
                </span>
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Prochain appel
                </h2>
              </div>
              <p className="text-[18px] font-bold capitalize text-ink">
                {new Date(nextCall.scheduled_at).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <p className="text-[14px] text-muted-foreground">
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
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Video className="h-4 w-4" aria-hidden="true" />
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
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Vos droits restants
          </h2>
          <EntitlementGrid entitlements={entitlements} compact />
        </div>
      )}

      {/* Unread messages */}
      {unreadMessages > 0 && (
        <Link
          href="/mon-espace/messages"
          className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
            <Mail className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-medium text-foreground">
            {unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}
          </span>
          <ArrowRight className="ml-auto h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}

      {/* Empty state */}
      {purchases.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 text-center lg:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Compass className="h-6 w-6" />
          </span>
          <h2 className="text-[18px] font-bold text-ink">Aucun service actif</h2>
          <p className="mx-auto mb-5 mt-1 max-w-[42ch] text-[13.5px] leading-snug text-muted-foreground">
            Découvrez nos packs d&apos;accompagnement pour préparer votre voyage aux Philippines en toute sérénité.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Voir les services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
