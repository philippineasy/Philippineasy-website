import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Receipt } from 'lucide-react';

async function getOrderDetails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orderId: number,
  userId: string,
) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (orderError || !order) notFound();

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      products (
        name,
        slug,
        image_urls
      )
    `)
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return { order, items: [] as any[] };
  }

  return { order, items: (items || []) as any[] };
}

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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const orderId = parseInt(id, 10);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/connexion');

  const { order, items } = await getOrderDetails(supabase, orderId, user.id);
  const status = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-muted', text: 'text-foreground' };

  return (
    <div className="min-h-screen bg-muted/40 pt-24">
      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/profil"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground font-medium mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>

          {/* Header */}
          <header className="mb-8">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1">
              Commande
            </span>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
                Commande #<span className="text-accent">{order.id}</span>
              </h1>
              <span className={['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-[0.05em]', status.bg, status.text].join(' ')}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                {status.label}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">Passée le {formatDate(order.created_at)}</p>
          </header>

          {/* Items */}
          <article className="rounded-2xl border border-border/60 bg-card shadow-card-rest overflow-hidden">
            <div className="px-5 py-4 lg:px-6 border-b border-border/50 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {items.length} article{items.length > 1 ? 's' : ''}
              </span>
            </div>

            <ul className="divide-y divide-border/40 list-none p-0 m-0">
              {items.map((item, index) => {
                const product = item.products;
                const unitPrice = Number(item.price ?? 0);
                const qty = Number(item.quantity ?? 0);
                const lineTotal = (unitPrice * qty).toFixed(2);
                return (
                  <li key={index} className="flex items-center gap-4 px-5 py-4 lg:px-6">
                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-xl overflow-hidden border border-border/50 bg-muted">
                      <Image
                        src={product?.image_urls?.[0] || 'https://via.placeholder.com/150'}
                        alt={product?.name || 'Produit'}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-[14.5px] font-semibold text-ink truncate">
                        {product?.name || 'Produit indisponible'}
                      </strong>
                      <span className="block text-[12.5px] text-muted-foreground mt-0.5">
                        Quantité : {qty} · {unitPrice.toFixed(2)} € / unité
                      </span>
                    </div>
                    <strong className="text-[15px] font-bold tabular-nums text-ink shrink-0">
                      {lineTotal} €
                    </strong>
                  </li>
                );
              })}
            </ul>

            {/* Totals */}
            <div className="px-5 py-5 lg:px-6 bg-muted/20 border-t border-border/50">
              <dl className="space-y-2 text-[13.5px]">
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted-foreground">Sous-total</dt>
                  <dd className="tabular-nums text-foreground">{order.total_amount.toFixed(2)} €</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted-foreground">Frais de livraison</dt>
                  <dd className="text-muted-foreground italic">À calculer</dd>
                </div>
                <div className="flex items-baseline justify-between pt-3 border-t border-border/50">
                  <dt className="text-[15px] font-bold text-ink flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-accent" aria-hidden="true" />
                    Total
                  </dt>
                  <dd className="text-[20px] font-bold tabular-nums text-accent">{order.total_amount.toFixed(2)} €</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
