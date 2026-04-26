import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { AdminPageHeader, AdminCard, AdminEmptyState } from '@/components/admin';
import { Users as UsersIcon } from 'lucide-react';
import CustomerTable from './CustomerTable';
import CustomerFilters from './CustomerFilters';

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  customer_since: string | null;
  total_spent: number | null;
  easy_plus_expires_at: string | null;
  rencontre_premium_expires_at: string | null;
};

type Purchase = { user_id: string; service_type: string; status: string };
type ConvoCount = { customer_id: string };

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; service?: string }>;
}) {
  const { q, service } = await searchParams;
  const supabase = createServiceRoleClient();

  // Une seule requête profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, customer_since, total_spent, easy_plus_expires_at, rencontre_premium_expires_at')
    .not('customer_since', 'is', null)
    .order('customer_since', { ascending: false })
    .limit(200);

  if (error) {
    return (
      <AdminCard padding="lg">
        <p className="text-rose-700 font-medium">Erreur lors du chargement : {error.message}</p>
      </AdminCard>
    );
  }

  const customerIds = (profiles || []).map(p => p.id);

  // Batch : un seul SELECT sur les achats actifs de tous les clients
  const purchasesByUser = new Map<string, string[]>();
  if (customerIds.length > 0) {
    const { data: purchases } = await supabase
      .from('service_purchases')
      .select('user_id, service_type, status')
      .in('user_id', customerIds)
      .eq('status', 'active') as { data: Purchase[] | null };

    for (const p of purchases || []) {
      const arr = purchasesByUser.get(p.user_id) || [];
      arr.push(p.service_type);
      purchasesByUser.set(p.user_id, arr);
    }
  }

  // Batch : count des messages non-lus par customer (group via conversation)
  const unreadByCustomer = new Map<string, number>();
  if (customerIds.length > 0) {
    const { data: convoMsgs } = await supabase
      .from('crm_messages')
      .select('crm_conversations!inner(customer_id)')
      .eq('is_admin_message', false)
      .eq('is_read', false)
      .in('crm_conversations.customer_id', customerIds) as { data: { crm_conversations: ConvoCount }[] | null };

    for (const row of convoMsgs || []) {
      const cid = row.crm_conversations?.customer_id;
      if (!cid) continue;
      unreadByCustomer.set(cid, (unreadByCustomer.get(cid) || 0) + 1);
    }
  }

  const enriched = (profiles as Profile[] || []).map(p => ({
    id: p.id,
    username: p.username || '—',
    avatar_url: p.avatar_url || '',
    customer_since: p.customer_since || '',
    total_spent: Number(p.total_spent || 0),
    active_services: purchasesByUser.get(p.id) || [],
    purchases_count: (purchasesByUser.get(p.id) || []).length,
    unread_messages: unreadByCustomer.get(p.id) || 0,
  }));

  // Filtrage server-side
  const filtered = enriched.filter(c => {
    if (q && !c.username.toLowerCase().includes(q.toLowerCase())) return false;
    if (service && !c.active_services.some(s => s.includes(service))) return false;
    return true;
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="CRM"
        title={<>Clients <span className="text-accent">{enriched.length}</span></>}
        description={`${filtered.length} client${filtered.length > 1 ? 's' : ''} affiché${filtered.length > 1 ? 's' : ''}.`}
      />

      <CustomerFilters defaultQ={q || ''} defaultService={service || ''} />

      {filtered.length > 0 ? (
        <CustomerTable customers={filtered} />
      ) : (
        <AdminCard padding="lg">
          <AdminEmptyState
            icon={<UsersIcon className="w-6 h-6" />}
            title={q || service ? 'Aucun résultat' : 'Aucun client'}
            description={q || service ? 'Essaye de modifier les filtres.' : 'Pas encore de client. Les profils apparaîtront ici dès le premier achat.'}
          />
        </AdminCard>
      )}
    </>
  );
}
