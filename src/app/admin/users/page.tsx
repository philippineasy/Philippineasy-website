'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/client';
import { getAllUsers, updateUserRole, banUser, unbanUser } from '@/services/userService';
import toast from 'react-hot-toast';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';

interface User {
  id: number;
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
  { value: 'member', label: 'Member' },
];

const AdminUsersPage = () => {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Record<number, string>>({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getAllUsers(supabase);
    if (error) {
      toast.error("Erreur lors de la récupération des utilisateurs.");
      console.error('Error fetching users:', error);
    } else {
      const usersData = data || [];
      setUsers(usersData);
      setUserRoles(usersData.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUserRoles(prev => ({ ...prev, [userId]: newRole }));
    const { error } = await updateUserRole(supabase, userId, newRole);
    if (error) {
      toast.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
      fetchUsers(); // Revert optimistic update on error
    } else {
      toast.success('Rôle mis à jour avec succès !');
    }
  };

  const handleBan = async (userId: number, durationDays: number | null, reason: string) => {
    const { error } = await banUser(supabase, userId, reason, durationDays);
    if (error) {
      toast.error("Erreur lors du bannissement de l'utilisateur.");
    } else {
      toast.success('Utilisateur banni.');
      fetchUsers(); // Refresh user list
    }
  };

  const handleUnban = async (userId: number) => {
    const { error } = await unbanUser(supabase, userId);
    if (error) {
      toast.error("Erreur lors de la levée du bannissement.");
    } else {
      toast.success('Bannissement levé.');
      fetchUsers(); // Refresh user list
    }
  };

  if (loading) {
    return <div className="text-center p-8"><FontAwesomeIcon icon={faSpinner} className="fa-spin text-3xl" /></div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Gérer les Utilisateurs</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Utilisateur</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Actions</th>
              <th className="p-4">Statut Ban</th>
              <th className="p-4">Actions Ban</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <CustomSelect
                    options={ROLE_OPTIONS}
                    value={userRoles[user.id] || user.role}
                    onChange={(newRole) => handleRoleChange(user.id, newRole as string)}
                  />
                </td>
                <td className="p-4">
                  {/* The save is now automatic on change */}
                </td>
                <td className="p-4 text-xs">
                  {user.is_banned ? (user.ban_expires_at ? `Banni jusqu'au ${new Date(user.ban_expires_at).toLocaleDateString('fr-FR')}` : 'Banni (Permanent)') : 'Non banni'}
                  {user.ban_reason && ` (Raison: ${user.ban_reason})`}
                </td>
                <td className="p-4">
                  {user.is_banned ? (
                    <button onClick={() => handleUnban(user.id)} className="px-3 py-1 bg-green-500 text-card-foreground text-xs rounded hover:bg-green-600">Lever Ban.</button>
                  ) : (
                    <>
                      <button onClick={() => handleBan(user.id, 7, 'Comportement inapproprié')} className="px-3 py-1 bg-accent text-card-foreground text-xs rounded hover:bg-accent/90 mr-1">Bannir 7j</button>
                      <button onClick={() => handleBan(user.id, null, 'Comportement inapproprié')} className="px-3 py-1 bg-destructive text-card-foreground text-xs rounded hover:bg-destructive/90">Bannir Perm.</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUsersPage;
