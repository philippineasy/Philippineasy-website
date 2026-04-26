import { createClient } from '@/utils/supabase/server';
import { Flag } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminEmptyState,
  type Column,
} from '@/components/admin';

type Report = {
  id: string | number;
  created_at: string;
  reporter: { username: string } | null;
  reported: { username: string } | null;
  message: { content: string } | null;
};

export default async function AdminDatingReportsPage() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from('reported_messages')
    .select('*, reporter:profiles!reporter_id(username), reported:profiles!reported_user_id(username), message:messages(content)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <AdminCard padding="lg">
        <p className="text-rose-700 font-medium">
          Erreur lors du chargement des signalements: {error.message}.{' '}
          <span className="text-muted-foreground">Avez-vous appliqué la nouvelle migration ?</span>
        </p>
      </AdminCard>
    );
  }

  const rows = (reports || []) as Report[];

  const columns: Column<Report>[] = [
    {
      key: 'reporter',
      label: 'Signalé par',
      width: '160px',
      render: (r) => (
        <span className="font-medium text-ink">{r.reporter?.username || '—'}</span>
      ),
    },
    {
      key: 'reported',
      label: 'Utilisateur signalé',
      width: '160px',
      render: (r) => (
        <AdminBadge tone="rose" dot>{r.reported?.username || '—'}</AdminBadge>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (r) => (
        <p className="text-[13px] text-foreground/80 max-w-md truncate">
          {r.message?.content || <span className="italic text-muted-foreground">Message indisponible</span>}
        </p>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      width: '160px',
      render: (r) => (
        <span className="text-[12px] text-muted-foreground">
          {new Date(r.created_at).toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      width: '180px',
      render: () => (
        <span className="text-[11px] text-muted-foreground italic">À implémenter</span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Modération · Rencontre"
        title={<>Messages <span className="text-accent">signalés</span></>}
        description={
          rows.length > 0
            ? <>{rows.length} signalement{rows.length > 1 ? 's' : ''} en attente de revue.</>
            : 'Aucun signalement en cours.'
        }
      />

      <AdminTable<Report>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        empty={
          <AdminEmptyState
            icon={<Flag className="w-6 h-6" />}
            title="Aucun signalement"
            description="Tous les messages signalés par les utilisateurs apparaîtront ici."
          />
        }
      />
    </>
  );
}
