import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/shared/ProductCard';
import { getProductsByCategorySlug } from '@/services/productService';
import { getProductCategoryBySlug } from '@/services/categoryService';
import type { Metadata } from 'next';

// ✅ params en Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: category } = await getProductCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  return {
    title: `${category.name} | Marketplace Philippin'Easy`,
    description: category.description || `Produits dans la catégorie ${category.name}.`,
  };
}

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: products, error } = await getProductsByCategorySlug(supabase, slug);

  if (error || !products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Catégorie non trouvée</h1>
        <p>Aucun produit trouvé dans cette catégorie.</p>
      </div>
    );
  }

  const categoryName = products[0].product_categories?.[0]?.name || 'Catégorie';

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}