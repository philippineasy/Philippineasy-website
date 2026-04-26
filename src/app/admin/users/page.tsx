'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ShieldOff, Shield, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { getAllUsers, updateUserRole, banUser, unbanUser } from '@/services/userService';
import toast from 'react-hot-toast';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminStatCard,
  AdminEmptyState,
  AdminSection,
  type Column,
} from '@/components/admin';

interface User {
  // profiles.id is a UUID (string) in the DB schema, not a number.
  // Previous typing as `number` broke ban / role RPCs at runtime.
  id: string;
  username: string;
  email: string;
  role: string;
  is_banned: boolean;
  ban_expires_at: string | null;
  ban_reason: string | null;
}

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'member', label: 'Membre' },
];

const ROLE_TONE: Record<string, 'rose' | 'violet' | 'sky' | 'neutral'> = {
  super_admin: 'rose',
  editor: 'violet',
  moderator: 'sky',
  member: 'neutral',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [pendingBan, setPendingBan] = useState<{ user: User; days: number | null } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getAllUsers(supabase);
    if (error) {
      toast.error('Erreur lors de la récupération des utilisateurs.');
      console.error('Error fetching users:', error);
    } else {
      const usersData = data || [];
      setUsers(usersData);
      setUserRoles(usersData.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUserRoles((prev) => ({ ...prev, [userId]: newRole }));
    const { error } = await updateUserRole(supabase, userId, newRole);
    if (error) {
      toast.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
      fetchUsers();
    } else {
      toast.success('Rôle mis à jour avec succès !');
    }
  };

  const handleBan = async (userId: string, durationDays: number | null, reason: string) => {
    const { error } = await banUser(supabase, userId, reason, durationDays);
    if (error) toast.error("Erreur lors du bannissement de l'utilisateur.");
    else {
      toast.success('Utilisateur banni.');
      fetchUsers();
    }
  };

  const handleUnban = async (userId: string) => {
    const { error } = await unbanUser(supabase, userId);
    if (error) toast.error('Erreur lors de la levée du bannissement.');
    else {
      toast.success('Bannissement levé.');
      fetchUsers();
    }
  };

  const filtered = search.trim()
    ? users.filter((u) => `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
    : users;

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'super_admin').length,
    editors: users.filter((u) => u.role === 'editor').length,
    banned: users.filter((u) => u.is_banned).length,
  };

  const columns: Column<User>[] = [
    {
      key: 'user',
      label: 'Utilisateur',
      render: (u) => (
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-ink">{u.username || '—'}</span>
          <span className="text-[12px] text-muted-foreground">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rôle',
      width: '180px',
      render: (u) => (
        <CustomSelect
          options={ROLE_OPTIONS}
          value={userRoles[u.id] || u.role}
          onChange={(newRole) => handleRoleChange(u.id, newRole as string)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '180px',
      render: (u) => u.is_banned ? (
        <div className="flex flex-col gap-1">
          <AdminBadge tone="rose" dot>
            {u.ban_expires_at
              ? `Banni jusqu'au ${new Date(u.ban_expires_at).toLocaleDateString('fr-FR')}`
              : 'Banni (Permanent)'}
          </AdminBadge>
          {u.ban_reason && <span className="text-[11px] text-muted-foreground">{u.ban_reason}</span>}
        </div>
      ) : (
        <AdminBadge tone={ROLE_TONE[u.role] || 'neutral'} dot>Actif</AdminBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      width: '220px',
      render: (u) => u.is_banned ? (
        <button
          onClick={() => handleUnban(u.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-colors"
        >
          <Shield className="w-3 h-3" /> Lever ban
        </button>
      ) : (
        <div className="inline-flex flex-wrap gap-1.5">
          <button
            onClick={() => setPendingBan({ user: u, days: 7 })}
            aria-label={`Bannir ${u.username || u.email} pour 7 jours`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ShieldAlert className="w-3 h-3" /> 7 j
          </button>
          <button
            onClick={() => setPendingBan({ user: u, days: null })}
            aria-label={`Bannir ${u.username || u.email} définitivement`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <ShieldOff className="w-3 h-3" /> Perm.
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Communauté"
        title={<>Gestion des <span className="text-accent">utilisateurs</span></>}
        description="Rôles, bannissements, recherche. Modifications appliquées en temps réel."
      />

      <AdminSection eyebrow="Vue d'ensemble" title="Statistiques">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <AdminStatCard label="Total" value={stats.total} accent="primary" icon={<UsersIcon className="w-5 h-5" />} />
          <AdminStatCard label="Super Admins" value={stats.admins} accent="rose" icon={<ShieldAlert className="w-5 h-5" />} />
          <AdminStatCard label="Éditeurs" value={stats.editors} accent="violet" />
          <AdminStatCard label="Bannis" value={stats.banned} accent={stats.banned > 0 ? 'amber' : 'emerald'} icon={<ShieldOff className="w-5 h-5" />} />
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Liste"
        title="Tous les utilisateurs"
        actions={
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom ou email)…"
            aria-label="Rechercher un utilisateur par nom ou email"
            className="w-64 rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60"
          />
        }
      >
        {loading ? (
          <AdminCard padding="lg">
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Chargement des utilisateurs…
            </div>
          </AdminCard>
        ) : (
          <AdminTable<User>
            columns={columns}
            rows={filtered}
            rowKey={(u) => u.id}
            empty={
              <AdminEmptyState
                icon={<UsersIcon className="w-6 h-6" />}
                title={search ? 'Aucun résultat' : 'Aucun utilisateur'}
                description={search ? `Aucun utilisateur ne correspond à "${search}"` : 'Aucun utilisateur enregistré pour l\'instant.'}
              />
            }
          />
        )}
      </AdminSection>

      {pendingBan && (
        <ConfirmationModal
          isOpen={!!pendingBan}
          onClose={() => setPendingBan(null)}
          onConfirm={async () => {
            await handleBan(pendingBan.user.id, pendingBan.days, 'Comportement inapproprié');
            setPendingBan(null);
          }}
          title={pendingBan.days ? `Bannir pour ${pendingBan.days} jour${pendingBan.days > 1 ? 's' : ''}` : 'Bannissement permanent'}
        >
          <p className="text-[14px] text-foreground">
            Bannir <strong>{pendingBan.user.username || pendingBan.user.email}</strong>
            {pendingBan.days
              ? <> pour <strong>{pendingBan.days} jour{pendingBan.days > 1 ? 's' : ''}</strong> ?</>
              : <> de manière <strong className="text-rose-700">permanente</strong> ?</>
            }
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            L'utilisateur ne pourra plus se connecter ni interagir avec la plateforme pendant la durée du bannissement.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
}
