import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { AdminForumClientPage } from './AdminForumClientPage';

const AdminForumPage = async () => {
  const supabase = createClient();
  const { data: categories, error } = await getForumCategories(supabase);

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les catégories du forum pour l'administration.</p>;
  }

  return (
    <AdminForumClientPage initialCategories={categories || []} />
  );
};

export default AdminForumPage;
