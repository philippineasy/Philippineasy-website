import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AddProductForm } from './AddProductForm';

async function getProductCategories(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
  return data;
}

export default async function NouveauProduitPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single();

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p>Vous devez avoir une boutique approuvée pour ajouter un produit.</p>
      </div>
    );
  }

  const categories = await getProductCategories(supabase);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau produit</h1>
        <AddProductForm categories={categories} vendorId={vendor.id} />
      </div>
    </div>
  );
}
