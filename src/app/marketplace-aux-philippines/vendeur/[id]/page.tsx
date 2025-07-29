import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ProductCard } from '@/components/shared/ProductCard';

async function getVendorDetails(supabase: ReturnType<typeof createClient>, vendorId: number) {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select(`
      name,
      description,
      logo_url,
      products (
        id,
        name,
        slug,
        price,
        image_urls,
        vendors (name)
      )
    `)
    .eq('id', vendorId)
    .eq('status', 'approved')
    .single();

  if (error || !vendor) {
    notFound();
  }

  return vendor;
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const vendorId = parseInt(id, 10);
  const vendor = await getVendorDetails(supabase, vendorId);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center mb-12">
        {vendor.logo_url && (
          <div className="relative w-32 h-32 rounded-full mb-4 overflow-hidden border-4 border-primary/20">
            <Image src={vendor.logo_url} alt={`Logo de ${vendor.name}`} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold">{vendor.name}</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">{vendor.description}</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Produits de {vendor.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vendor.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
