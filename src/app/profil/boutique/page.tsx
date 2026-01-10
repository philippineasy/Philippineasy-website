import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { BoutiqueClientPage } from './BoutiqueClientPage';

async function getVendorData(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (vendorError || !vendor) {
    return { vendor: null, products: [], monthlySales: 0, monthlyViews: 0 };
  }

  const [productsResult, salesResult, viewsResult] = await Promise.all([
    supabase.from('products').select('*').eq('vendor_id', vendor.id).order('created_at', { ascending: false }),
    supabase.rpc('get_vendor_monthly_sales', { vendor_id_param: vendor.id }),
    supabase.rpc('get_vendor_monthly_views', { vendor_id_param: vendor.id })
  ]);

  if (productsResult.error) {
    console.error('Error fetching products:', productsResult.error);
  }
  if (salesResult.error) {
    console.error('Error fetching monthly sales:', salesResult.error);
  }
  if (viewsResult.error) {
    console.error('Error fetching monthly views:', viewsResult.error);
  }

  return { 
    vendor, 
    products: productsResult.data || [],
    monthlySales: salesResult.data || 0,
    monthlyViews: viewsResult.data || 0,
  };
}

export default async function BoutiquePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['vendor', 'super_admin'].includes(profile.role)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p>Vous devez être un vendeur approuvé pour accéder à cette page.</p>
      </div>
    );
  }

  const { vendor, products, monthlySales, monthlyViews } = await getVendorData(supabase, user.id);

  if (!vendor) {
     return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Erreur</h1>
        <p>Impossible de charger les informations de votre boutique. Veuillez contacter le support.</p>
      </div>
    );
  }

  return <BoutiqueClientPage vendor={vendor} initialProducts={products} monthlySales={monthlySales} monthlyViews={monthlyViews} />;
}
