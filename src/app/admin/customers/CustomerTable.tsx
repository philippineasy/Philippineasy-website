'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Mail } from 'lucide-react';
import { AdminCard, AdminBadge } from '@/components/admin';

interface Customer {
  id: string;
  username: string;
  avatar_url: string;
  customer_since: string;
  total_spent: number;
  active_services: string[];
  purchases_count: number;
  unread_messages: number;
}

const SERVICE_LABELS: Record<string, string> = {
  buddy: 'Buddy',
  voyage_serein: 'Serein',
  pack_ultime: 'Ultime',
  easy_plus: 'Easy+',
  guide_pdf: 'Guide',
  rencontre: 'Rencontre',
};

function getServiceBadgeLabel(serviceType: string): string {
  for (const [key, label] of Object.entries(SERVICE_LABELS)) {
    if (serviceType.includes(key)) return label;
  }
  return serviceType;
}

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <AdminCard padding="sm" className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border/60">
              <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Services actifs</th>
              <th className="px-4 py-3 text-right font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Total dépensé</th>
              <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Client depuis</th>
              <th className="px-4 py-3 text-right font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0 border border-border/50">
                      {customer.avatar_url ? (
                        <Image src={customer.avatar_url} alt="" fill sizes="36px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[12px] font-semibold text-muted-foreground">
                          {customer.username?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="leading-tight min-w-0">
                      <p className="font-medium text-ink text-[14px] truncate">{customer.username}</p>
                      {customer.unread_messages > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent mt-0.5">
                          <Mail className="w-3 h-3" aria-hidden="true" />
                          {customer.unread_messages} non lu{customer.unread_messages > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {customer.active_services.length > 0 ? (
                      customer.active_services.map((s, i) => (
                        <AdminBadge key={`${s}-${i}`} tone="emerald">{getServiceBadgeLabel(s)}</AdminBadge>
                      ))
                    ) : (
                      <span className="text-[12px] text-muted-foreground">Aucun</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-ink">
                  {customer.total_spent.toFixed(2)} €
                </td>
                <td className="px-4 py-3 text-[13px] text-muted-foreground tabular-nums">
                  {customer.customer_since
                    ? new Date(customer.customer_since).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    aria-label={`Voir le détail de ${customer.username}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-accent/10 text-accent hover:bg-accent/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Eye className="w-3 h-3" />
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
