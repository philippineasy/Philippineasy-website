import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductInteraction } from './ProductInteraction';
import { ProductGallery } from './ProductGallery';
import { ProductReviews } from './ProductReviews';
import RelatedProducts from '@/components/shared/RelatedProducts';
import { ProductViewTracker } from './ProductViewTracker';
import ProductJsonLd from '@/components/shared/ProductJsonLd';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';
import { generateProductMetaDescription } from '@/utils/seo/metaDescriptionGenerator';

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('status', 'published');

  if (!products) {
    return [];
  }

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProductBySlug(supabase, slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  // Récupérer la catégorie du produit pour la meta description
  const { data: categoryData } = await supabase
    .from('product_categories')
    .select('name')
    .eq('id', product.category_id)
    .single();

  const categoryName = categoryData?.name;

  const description = generateProductMetaDescription(
    product.name,
    product.description,
    product.price,
    categoryName,
    { maxLength: 155, addEllipsis: true }
  );

  const canonicalUrl = `https://philippineasy.com/marketplace-aux-philippines/produit/${slug}`;

  return {
    title: `${product.name} - Marketplace`,
    description,
    keywords: ['marketplace Philippines', product.name, categoryName || '', 'acheter Philippines', 'produits philippins'],
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
      title: product.name,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      images: [
        {
          url: product.image_urls?.[0] || '',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [product.image_urls?.[0] || ''],
      site: '@philippineasy',
    },
  };
}

async function getProductBySlug(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      image_urls,
      category_id,
      product_categories (
        id,
        name,
        slug
      ),
      vendors (
        id,
        name
      ),
      product_reviews (
        id,
        rating,
        comment,
        created_at,
        profiles (
            username,
            avatar_url
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .limit(1);

  if (error) {
    console.error("Error fetching product by slug:", error);
    notFound();
  }
  
  if (!data || data.length === 0) {
    notFound();
  }

  const productData = data[0];
  const formattedReviews = productData.product_reviews.map((r: any) => ({
    ...r,
    profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles,
  }));

  return {
    ...productData,
    vendor: Array.isArray(productData.vendors) ? productData.vendors[0] : productData.vendors,
    product_reviews: formattedReviews,
    category: Array.isArray(productData.product_categories) ? productData.product_categories[0] : productData.product_categories,
  };
}

async function checkUserHasPurchased(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, productId: number) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_items(product_id)')
    .eq('user_id', userId)
    .eq('status', 'succeeded')
    .eq('order_items.product_id', productId);

  if (error) {
    console.error("Error checking purchase history:", error);
    return false;
  }

  return data && data.length > 0;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const product = await getProductBySlug(supabase, slug);
  const hasPurchased = await checkUserHasPurchased(supabase, user?.id || '', product.id);

  const breadcrumbItems: Array<{ href?: string; label: string }> = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace-aux-philippines', label: 'Marketplace' },
  ];

  if (product.category) {
    breadcrumbItems.push({
      href: `/marketplace-aux-philippines/categorie/${product.category.slug}`,
      label: product.category.name,
    });
  }

  breadcrumbItems.push({
    label: product.name,
  });

  const breadcrumbJsonLdItems = breadcrumbItems.map(item => ({
    name: item.label,
    item: item.href || `/marketplace-aux-philippines/produit/${slug}`,
  }));

  const reviews = product.product_reviews ?? [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewCount
    : 0;
  const roundedRating = Math.round(avgRating);

  const priceLabel = product.price.toLocaleString('fr-FR', {
    minimumFractionDigits: product.price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const reassurance = [
    { icon: <LockIcon />, label: 'Paiement sécurisé', sub: 'Via Stripe · CB & Apple Pay' },
    { icon: <ShieldCheckIcon />, label: 'Vendeur vérifié', sub: 'Sélection contrôlée par notre équipe' },
    { icon: <ChatIcon />, label: 'Support francophone', sub: 'Une question ? On vous répond' },
  ];

  return (
    <div className="pb-4">
      <ProductViewTracker productId={product.id} />
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <ProductJsonLd product={product} />

      <div className="container mx-auto px-4 pt-10 md:pt-12">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Gallery */}
            <ProductGallery images={product.image_urls} name={product.name} />

            {/* Buy box */}
            <div className="flex flex-col">
              {product.category && (
                <Link
                  href={`/marketplace-aux-philippines/categorie/${product.category.slug}`}
                  className="inline-flex w-fit items-center self-start rounded bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-primary transition-colors hover:bg-primary/15"
                >
                  {product.category.name}
                </Link>
              )}

              <h1
                className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-foreground"
                style={{ letterSpacing: '-0.02em', lineHeight: 1.12 }}
              >
                {product.name}
              </h1>

              {product.vendor && (
                <Link
                  href={`/marketplace-aux-philippines/vendeur/${product.vendor.id}`}
                  className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Vendu par <span className="font-semibold text-foreground">{product.vendor.name}</span>
                </Link>
              )}

              {reviewCount > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="text-[15px] tracking-[0.05em] text-accent-strong"
                    aria-hidden="true"
                  >
                    {'★'.repeat(roundedRating)}
                    <span className="text-muted-foreground/40">{'★'.repeat(5 - roundedRating)}</span>
                  </span>
                  <span className="text-sm font-medium text-foreground">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} avis)
                  </span>
                </div>
              )}

              {/* Price + purchase card */}
              <div className="mt-6 rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
                <div className="mb-5 flex items-baseline gap-2">
                  <span
                    className="text-[2rem] font-bold tabular-nums text-foreground"
                    style={{ letterSpacing: '-0.02em', lineHeight: 1 }}
                  >
                    {priceLabel} €
                  </span>
                  <span className="text-sm text-muted-foreground">TTC</span>
                </div>

                <ProductInteraction product={product} />

                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {reassurance.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                        <span className="block text-[13px] text-muted-foreground">{item.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-14 max-w-3xl">
              <h2
                className="text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold text-foreground"
                style={{ letterSpacing: '-0.01em' }}
              >
                Description
              </h2>
              <div className="mt-4 whitespace-pre-line text-[16px] leading-[1.7] text-foreground/85">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <ProductReviews
            productId={product.id}
            initialReviews={product.product_reviews}
            hasPurchased={hasPurchased}
          />
        </div>
      </div>

      {/* Related products — parent padding absorbs the band's negative margins */}
      <div className="container mx-auto px-6 md:px-10">
        <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
      </div>
    </div>
  );
}

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
