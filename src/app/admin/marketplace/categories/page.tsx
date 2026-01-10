import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CategoryManagementClient } from './CategoryManagementClient';

async function getProductCategories(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
  return data;
}

export default async function AdminProductCategoriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'super_admin') {
    return (
      <div>
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  const categories = await getProductCategories(supabase);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gérer les Catégories de la Marketplace</h1>
      <CategoryManagementClient initialCategories={categories} />
    </div>
  );
}
