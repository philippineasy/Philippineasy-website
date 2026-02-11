'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '@/components/crm/StatusBadge';

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

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-card p-12 rounded-lg text-center text-muted-foreground">
        Aucun client trouvé
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Client</th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Services actifs</th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Total dépensé</th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Client depuis</th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {customer.avatar_url ? (
                      <Image
                        src={customer.avatar_url}
                        alt={customer.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {customer.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{customer.username}</p>
                    {customer.unread_messages > 0 && (
                      <span className="text-xs text-primary">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                        {customer.unread_messages} non lu{customer.unread_messages > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {customer.active_services.length > 0 ? (
                    customer.active_services.map((s: string, i: number) => (
                      <StatusBadge key={i} status="active" label={getServiceBadgeLabel(s)} />
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-sm">{customer.total_spent}€</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(customer.customer_since).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <FontAwesomeIcon icon={faEye} />
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
