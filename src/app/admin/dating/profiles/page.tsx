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

  // Fetch emails individually per user (more robust than listUsers)
  const emailMap = new Map<string, string>();
  const userResults = await Promise.allSettled(
    profiles.map(p => supabase.auth.admin.getUserById(p.user_id))
  );
  userResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.data?.user?.email) {
      emailMap.set(profiles[index].user_id, result.value.data.user.email);
    }
  });

  const profilesWithEmail = profiles.map(profile => ({
    ...profile,
    email: emailMap.get(profile.user_id),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des Profils Rencontre</h1>
        <Link href="/admin/dating/profiles/add" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
          + Ajouter un profil
        </Link>
      </div>

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