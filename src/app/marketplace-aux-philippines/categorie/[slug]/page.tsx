import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/shared/ProductCard';
import { getProductsByCategorySlug } from '@/services/productService';
import { getProductCategoryBySlug } from '@/services/categoryService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
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

  const canonicalUrl = `https://philippineasy.com/marketplace-aux-philippines/categorie/${slug}`;
  const description = category.description || `Découvrez tous les produits ${category.name} disponibles sur notre marketplace Philippines : achat sécurisé, livraison rapide.`;

  return {
    title: `${category.name} - Marketplace Philippines | Philippin'Easy`,
    description,
    keywords: ['marketplace Philippines', category.name, 'acheter Philippines', 'produits philippins', 'e-commerce'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} - Marketplace Philippines`,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - Marketplace`,
      description,
      site: '@philippineasy',
    },
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

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace-aux-philippines', label: 'Marketplace' },
    { label: categoryName },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Marketplace', item: '/marketplace-aux-philippines' },
    { name: categoryName, item: `/marketplace-aux-philippines/categorie/${slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-16 pt-32">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}