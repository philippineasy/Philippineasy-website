import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { EditProductForm } from './EditProductForm';

async function getProductById(supabase: Awaited<ReturnType<typeof createClient>>, productId: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) {
    notFound();
  }
  return data;
}

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

export default async function ModifierProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const productId = parseInt(id, 10);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const product = await getProductById(supabase, productId);
  
  // Security check: ensure the user owns this product
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', product.vendor_id)
    .single();

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p>Vous n'êtes pas autorisé à modifier ce produit.</p>
      </div>
    );
  }

  const categories = await getProductCategories(supabase);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Modifier le produit</h1>
        <EditProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
