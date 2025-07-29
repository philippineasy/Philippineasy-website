import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ProfilesClient } from './ProfilesClient';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export default async function AdminDatingProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; plan?: string }>;
}) {
  const { q, status, plan } = await searchParams;

  const supabase = createServiceRoleClient();

  let query = supabase
    .from('dating_profiles')
    .select('*, profiles!inner(*)')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('profiles.username', `%${q}%`);
  }
  if (status) {
    query = query.eq('is_validated', status === 'validated');
  }
  if (plan) {
    query = query.eq('profiles.plan', plan);
  }

  const { data: profiles, error } = await query;

  if (error) {
    return <p className="text-red-500">Erreur lors du chargement des profils: {error.message}</p>;
  }

  const userIds = profiles.map(p => p.user_id);
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    return <p className="text-red-500">Erreur lors du chargement des utilisateurs: {usersError.message}</p>;
  }

  const profilesWithEmail = profiles.map(profile => {
    const user = users.users.find(u => u.id === profile.user_id);
    return {
      ...profile,
      email: user?.email,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Profils Rencontre</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <form className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Rechercher par nom..."
            className="p-2 border rounded"
          />
          <select name="status" defaultValue={status} className="p-2 border rounded">
            <option value="">Tous les statuts</option>
            <option value="validated">Validé</option>
            <option value="pending">En attente</option>
          </select>
          <select name="plan" defaultValue={plan} className="p-2 border rounded">
            <option value="">Tous les abonnements</option>
            <option value="premium">Premium</option>
            <option value="free">Gratuit</option>
          </select>
          <button type="submit" className="p-2 bg-blue-600 text-white rounded">Filtrer</button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abonnement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit le</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <ProfilesClient profiles={profilesWithEmail} />
        </table>
      </div>
    </div>
  );
}