import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminSection,
  AdminEmptyState,
  type Column,
} from '@/components/admin';
import {
  PRICING_GRID,
  DURATION_LABELS,
  OFFER_LABELS,
  formatPrice,
  type Duration,
  type OfferType,
} from '@/config/itinerary-pricing';
import {
  Map as MapIcon, CreditCard, TrendingUp, Clock, Users, Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

type Generation = {
  id: string;
  user_id: string | null;
  preferences: any;
  selected_variant: string | null;
  amount_paid: number | null;
  payment_status: string | null;
  delivery_email: string | null;
  delivery_method: string | null;
  delivered_at: string | null;
  status: string | null;
  created_at: string;
  offer_type: string | null;
  modifications_remaining: number | null;
};

const PAYMENT_STATUS_TONE: Record<string, 'emerald' | 'amber' | 'rose' | 'sky' | 'neutral'> = {
  completed: 'emerald',
  pending: 'amber',
  failed: 'rose',
  refunded: 'sky',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  completed: 'Payé',
  pending: 'En attente',
  failed: 'Échec',
  refunded: 'Remboursé',
};

const STATUS_LABEL: Record<string, string> = {
  generated: 'Généré',
  selected: 'Sélectionné',
  paid: 'Payé',
  delivered: 'Livré',
  failed: 'Échec',
};

const VARIANT_TONE: Record<string, 'sky' | 'emerald' | 'amber'> = {
  relax: 'sky',
  balanced: 'emerald',
  adventure: 'amber',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

export default async function ItinerarySalesPage() {
  const supabase = await createClient();

  // KPIs aggregated
  const { data: kpis } = await supabase.rpc('admin_itinerary_kpis').single().then(
    () => ({ data: null }),
    () => ({ data: null })
  ).catch(() => ({ data: null }));

  // Fallback: aggregate via direct queries
  const { data: allGens } = await supabase
    .from('itinerary_generations')
    .select('id, payment_status, amount_paid, created_at, offer_type, status, selected_variant')
    .order('created_at', { ascending: false });

  const total = allGens?.length || 0;
  const paid = allGens?.filter((g) => g.payment_status === 'completed').length || 0;
  const pending = allGens?.filter((g) => g.payment_status === 'pending').length || 0;
  const last30d = allGens?.filter((g) => new Date(g.created_at) >= new Date(Date.now() - 30 * 86400000)).length || 0;
  const last7d = allGens?.filter((g) => new Date(g.created_at) >= new Date(Date.now() - 7 * 86400000)).length || 0;
  const conversionRate = total > 0 ? Math.round((paid / total) * 100) : 0;
  const revenue30d = (allGens || [])
    .filter((g) => g.payment_status === 'completed' && new Date(g.created_at) >= new Date(Date.now() - 30 * 86400000))
    .reduce((sum, g) => sum + Number(g.amount_paid || 0), 0);
  const revenueAll = (allGens || [])
    .filter((g) => g.payment_status === 'completed')
    .reduce((sum, g) => sum + Number(g.amount_paid || 0), 0);

  // Breakdown by offer (paid only)
  const offerBreakdown: Record<string, { count: number; revenue: number }> = {};
  for (const g of allGens || []) {
    if (g.payment_status !== 'completed') continue;
    const k = g.offer_type || 'unknown';
    if (!offerBreakdown[k]) offerBreakdown[k] = { count: 0, revenue: 0 };
    offerBreakdown[k].count += 1;
    offerBreakdown[k].revenue += Number(g.amount_paid || 0);
  }

  // Breakdown by variant (paid only)
  const variantBreakdown: Record<string, number> = { relax: 0, balanced: 0, adventure: 0 };
  for (const g of allGens || []) {
    if (g.payment_status !== 'completed') continue;
    const v = g.selected_variant || '';
    if (v in variantBreakdown) variantBreakdown[v] += 1;
  }

  // Detail rows: full record + user join
  const { data: detailRows } = await supabase
    .from('itinerary_generations')
    .select(`
      id, user_id, preferences, selected_variant, amount_paid,
      payment_status, delivery_email, delivery_method, delivered_at,
      status, created_at, offer_type, modifications_remaining
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  const rows: Generation[] = (detailRows || []) as Generation[];

  const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean) as string[])];
  const { data: users } = userIds.length > 0
    ? await supabase.from('profiles').select('id, username, email').in('id', userIds)
    : { data: [] };
  const userMap = new Map((users || []).map((u: any) => [u.id, u]));

  const columns: Column<Generation>[] = [
    {
      key: 'date',
      label: 'Date',
      width: '160px',
      render: (g) => (
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] text-foreground/90">{formatDate(g.created_at)}</span>
          <span className="text-[11px] text-muted-foreground">#{shortId(g.id)}</span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Client',
      render: (g) => {
        const u = g.user_id ? userMap.get(g.user_id) : null;
        if (u) {
          return (
            <div className="flex flex-col leading-tight min-w-0">
              <Link href={`/admin/customers/${g.user_id}`} className="text-[13px] font-medium text-ink hover:text-primary truncate">
                {u.username || u.email || g.user_id?.slice(0, 8)}
              </Link>
              {u.email && <span className="text-[11px] text-muted-foreground truncate">{u.email}</span>}
            </div>
          );
        }
        if (g.delivery_email) {
          return (
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] text-foreground/90">{g.delivery_email}</span>
              <span className="text-[11px] text-muted-foreground">Visiteur (non inscrit)</span>
            </div>
          );
        }
        return <span className="text-[12px] text-muted-foreground italic">Anonyme</span>;
      },
    },
    {
      key: 'preferences',
      label: 'Préférences',
      render: (g) => {
        const p = g.preferences || {};
        const dur = p.duration ? DURATION_LABELS[p.duration as Duration] : '—';
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="font-medium text-foreground">{dur}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground capitalize">{p.tripStyle || '—'}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground capitalize">{p.budget || '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'offer',
      label: 'Offre',
      render: (g) => {
        if (!g.offer_type) return <span className="text-[12px] text-muted-foreground/60">—</span>;
        const tone = g.offer_type === 'premium' ? 'primary' : g.offer_type === 'conciergerie' ? 'violet' : 'sky';
        return <AdminBadge tone={tone}>{OFFER_LABELS[g.offer_type as OfferType]?.name || g.offer_type}</AdminBadge>;
      },
    },
    {
      key: 'variant',
      label: 'Variante',
      render: (g) => g.selected_variant ? (
        <AdminBadge tone={VARIANT_TONE[g.selected_variant] || 'neutral'} dot>{g.selected_variant}</AdminBadge>
      ) : (
        <span className="text-[12px] text-muted-foreground/60">—</span>
      ),
    },
    {
      key: 'amount',
      label: 'Montant',
      align: 'right',
      width: '100px',
      render: (g) => g.amount_paid ? (
        <span className="text-[13px] font-bold tabular-nums text-ink">{formatPrice(Number(g.amount_paid))}</span>
      ) : (
        <span className="text-[12px] text-muted-foreground/60">—</span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '120px',
      render: (g) => g.payment_status ? (
        <AdminBadge tone={PAYMENT_STATUS_TONE[g.payment_status] || 'neutral'} dot>
          {PAYMENT_STATUS_LABEL[g.payment_status] || g.payment_status}
        </AdminBadge>
      ) : (
        <AdminBadge tone="neutral">{STATUS_LABEL[g.status || ''] || g.status || '—'}</AdminBadge>
      ),
    },
    {
      key: 'delivery',
      label: 'Livraison',
      width: '100px',
      render: (g) => g.delivered_at ? (
        <span className="inline-flex items-center gap-1 text-[12px] text-emerald-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          {new Date(g.delivered_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </span>
      ) : (
        <span className="text-[12px] text-muted-foreground/60">—</span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Itinéraires IA"
        title={<>Suivi des <span className="text-accent">ventes</span> & générations</>}
        description={
          <>Toutes les générations IA — gratuites + payées. Conversion, panier moyen, breakdown par offre et variante.</>
        }
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-10">
        <AdminStatCard
          label="Total générations"
          value={total}
          hint={`${last7d} cette semaine · ${last30d} ces 30 j`}
          accent="primary"
          icon={<MapIcon className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Payées"
          value={paid}
          hint={`${pending} en attente`}
          accent="emerald"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Taux de conversion"
          value={`${conversionRate}%`}
          hint={`${paid} sur ${total} générations`}
          accent={conversionRate >= 15 ? 'emerald' : conversionRate >= 5 ? 'accent' : 'rose'}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Revenu (30 j)"
          value={`${revenue30d.toFixed(2)}€`}
          hint={`Total cumulé : ${revenueAll.toFixed(2)}€`}
          accent="accent"
          icon={<Sparkles className="w-5 h-5" />}
        />
      </section>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <AdminCard padding="lg">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
            Ventes par offre
          </span>
          {Object.keys(offerBreakdown).length > 0 ? (
            <ul className="space-y-2 list-none p-0">
              {(['express', 'premium', 'conciergerie'] as OfferType[]).map((k) => {
                const data = offerBreakdown[k];
                if (!data) return null;
                const pct = paid > 0 ? Math.round((data.count / paid) * 100) : 0;
                const label = OFFER_LABELS[k]?.name || k;
                const tone = k === 'premium' ? 'primary' : k === 'conciergerie' ? 'violet' : 'sky';
                return (
                  <li key={k} className="flex items-center gap-3">
                    <AdminBadge tone={tone as any}>{label}</AdminBadge>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold tabular-nums text-foreground shrink-0">
                      {data.count} · {data.revenue.toFixed(2)}€
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[13px] text-muted-foreground italic">Aucune vente enregistrée pour l'instant.</p>
          )}
        </AdminCard>

        <AdminCard padding="lg">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
            Variantes choisies
          </span>
          {paid > 0 ? (
            <ul className="space-y-2 list-none p-0">
              {(['relax', 'balanced', 'adventure'] as const).map((v) => {
                const count = variantBreakdown[v] || 0;
                const pct = paid > 0 ? Math.round((count / paid) * 100) : 0;
                return (
                  <li key={v} className="flex items-center gap-3">
                    <AdminBadge tone={VARIANT_TONE[v]} dot>{v}</AdminBadge>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} aria-hidden="true" />
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold tabular-nums text-foreground shrink-0 w-12 text-right">
                      {count} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[13px] text-muted-foreground italic">Pas encore de variante choisie.</p>
          )}
        </AdminCard>
      </div>

      {/* Recent generations table */}
      <AdminSection
        eyebrow="Liste"
        title="Dernières générations"
        description={`50 plus récentes — toutes statuts confondus.`}
      >
        <AdminTable
          columns={columns}
          rows={rows}
          rowKey={(g) => g.id}
          empty={
            <AdminEmptyState
              icon={<MapIcon className="w-6 h-6" />}
              title="Aucune génération"
              description="Les futures générations IA apparaîtront ici en temps réel."
            />
          }
        />
      </AdminSection>
    </>
  );
}
