import { createServiceRoleClient } from '@/utils/supabase/service-role';
import AddProfileClient from './AddProfileClient';
import Link from 'next/link';

export default async function AddProfilePage() {
  const supabase = createServiceRoleClient();

  const { data: interests, error } = await supabase
    .from('interests')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return <p className="text-red-500">Erreur chargement des centres d&apos;interet: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Ajouter un profil Rencontre</h1>
        <Link
          href="/admin/dating/profiles"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          &larr; Retour aux profils
        </Link>
      </div>
      <AddProfileClient interests={interests || []} />
    </div>
  );
}
