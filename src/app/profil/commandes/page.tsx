import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Receipt, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'En attente', bg: 'bg-amber-500/10', text: 'text-amber-700' },
  paid: { label: 'Payée', bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  shipped: { label: 'Expédiée', bg: 'bg-sky-500/10', text: 'text-sky-700' },
  delivered: { label: 'Livrée', bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  cancelled: { label: 'Annulée', bg: 'bg-rose-500/10', text: 'text-rose-700' },
  refunded: { label: 'Remboursée', bg: 'bg-violet-500/10', text: 'text-violet-700' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function MesCommandesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/profil/commandes');

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, total_amount, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const total = (orders || []).reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-muted/40 pt-24">
      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/profil"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground font-medium mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>

          <header className="mb-8">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1">
              Marketplace
            </span>
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
              Mes <span className="text-accent">commandes</span>
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Historique des commandes Marketplace.
              {orders && orders.length > 0 && (
                <> {orders.length} commande{orders.length > 1 ? 's' : ''} · {total.toFixed(2)} € au total.</>
              )}
            </p>
          </header>

          {orders && orders.length > 0 ? (
            <ul className="list-none p-0 m-0 space-y-3">
              {orders.map((order: any) => {
                const status = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-muted', text: 'text-foreground' };
                return (
                  <li key={order.id}>
                    <Link
                      href={`/profil/commandes/${order.id}`}
                      className="block rounded-2xl border border-border/60 bg-card shadow-card-rest hover:border-primary/40 hover:shadow-card transition-all p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
                            <Package className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <strong className="block text-[14px] font-semibold text-ink">
                              Commande #{order.id}
                            </strong>
                            <span className="block text-[12.5px] text-muted-foreground">
                              {formatDate(order.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-bold tabular-nums text-ink">
                            {Number(order.total_amount).toFixed(2)} €
                          </span>
                          <span className={['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]', status.bg, status.text].join(' ')}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 lg:p-12 text-center">
              <span className="inline-flex w-14 h-14 rounded-full bg-primary/10 text-primary items-center justify-center mb-4" aria-hidden="true">
                <Receipt className="w-6 h-6" />
              </span>
              <strong className="block text-[18px] font-bold text-ink mb-1">
                Aucune commande
              </strong>
              <p className="text-[13.5px] text-muted-foreground leading-snug max-w-[42ch] mx-auto mb-5">
                Vos achats Marketplace (produits physiques, partenaires) apparaîtront ici.
              </p>
              <Link
                href="/marketplace-aux-philippines"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 transition-transform"
              >
                Explorer le Marketplace
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
