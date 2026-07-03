import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/shared/ProductCard';
import { getProductsByCategorySlug } from '@/services/productService';
import { getProductCategoryBySlug } from '@/services/categoryService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const { data: categories } = await supabase
    .from('product_categories')
    .select('slug');

  if (!categories) {
    return [];
  }

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// ✅ params en Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await getProductCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  const canonicalUrl = `https://philippineasy.com/marketplace-aux-philippines/categorie/${slug}`;
  const description = category.description || `Découvrez tous les produits ${category.name} disponibles sur notre marketplace Philippines : achat sécurisé, livraison rapide.`;

  return {
    title: `${category.name} - Marketplace Philippines`,
    description,
    keywords: ['marketplace Philippines', category.name, 'acheter Philippines', 'produits philippins', 'e-commerce'],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
  const supabase = await createClient();

  // A slug that maps to no category is a genuine 404 (true not-found status),
  // distinct from an existing category that simply has no products yet.
  const { data: category } = await getProductCategoryBySlug(supabase, slug);
  if (!category) {
    notFound();
  }

  const { data: products } = await getProductsByCategorySlug(supabase, slug);
  const productList = products ?? [];

  const categoryName = category.name;
  const productCount = productList.length;

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
    <div>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      {/* Category header band */}
      <section className="border-b border-border bg-muted py-10 md:py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Marketplace
          </span>
          <h1
            className="mt-3 text-[clamp(1.875rem,4vw,2.75rem)] font-bold text-foreground"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {categoryName}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {productCount > 0
              ? `${productCount} ${productCount > 1 ? 'produits sélectionnés' : 'produit sélectionné'} dans la catégorie ${categoryName.toLowerCase()} — paiement sécurisé, vendeurs vérifiés.`
              : `Paiement sécurisé et vendeurs vérifiés pour la catégorie ${categoryName.toLowerCase()}.`}
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          {productCount > 0 ? (
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
              {productList.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border-[0.5px] border-border bg-card px-6 py-14 text-center shadow-card-rest">
              <h2 className="text-lg font-bold text-foreground">Aucun produit pour le moment</h2>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Cette catégorie ne contient pas encore de produits. Revenez bientôt ou explorez le
                reste de la marketplace.
              </p>
              <Link
                href="/marketplace-aux-philippines"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explorer la marketplace
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

          {productCount > 0 && (
            <div className="mx-auto mt-12 max-w-6xl text-center">
              <Link
                href="/marketplace-aux-philippines"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5">
                  ←
                </span>
                Voir toute la marketplace
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}