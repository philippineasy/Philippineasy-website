import { createClient } from '@/utils/supabase/server';
import { StatusMessage } from '@/components/shared/StatusMessage';
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
      <StatusMessage
        title="Accès non autorisé"
        description="Vous devez avoir une boutique approuvée pour ajouter un produit."
      />
    );
  }

  const categories = await getProductCategories(supabase);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-1">Ma boutique</span>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground mb-8">Ajouter un nouveau produit</h1>
        <AddProductForm categories={categories} vendorId={vendor.id} />
      </div>
    </div>
  );
}
