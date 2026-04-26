import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { AdminForumClientPage } from './AdminForumClientPage';
import { AdminPageHeader, AdminCard } from '@/components/admin';

export default async function AdminForumPage() {
  const supabase = await createClient();
  const { data: categories, error } = await getForumCategories(supabase);

  if (error) {
    return (
      <AdminCard padding="lg">
        <p className="text-rose-700 font-medium">
          Impossible de charger les catégories du forum pour l'administration.
        </p>
      </AdminCard>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Communauté"
        title={<>Gestion du <span className="text-accent">forum</span></>}
        description={`${(categories || []).length} catégorie${(categories || []).length > 1 ? 's' : ''}. Création, lock/pin de sujets, gestion structure.`}
      />
      <AdminForumClientPage initialCategories={categories || []} />
    </>
  );
}
