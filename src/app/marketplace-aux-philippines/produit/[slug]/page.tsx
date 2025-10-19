import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductInteraction } from './ProductInteraction';
import { ProductReviews } from './ProductReviews';
import RelatedProducts from '@/components/shared/RelatedProducts';
import { ProductViewTracker } from './ProductViewTracker';
import ProductJsonLd from '@/components/shared/ProductJsonLd';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';
import { generateProductMetaDescription } from '@/utils/seo/metaDescriptionGenerator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
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
    title: `${product.name} | Marketplace Philippin'Easy`,
    description,
    keywords: ['marketplace Philippines', product.name, categoryName || '', 'acheter Philippines', 'produits philippins'],
    alternates: {
      canonical: canonicalUrl,
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

async function getProductBySlug(supabase: ReturnType<typeof createClient>, slug: string) {
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

async function checkUserHasPurchased(supabase: ReturnType<typeof createClient>, userId: string, productId: number) {
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
  const supabase = createClient();
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

  return (
    <div className="container mx-auto px-4 py-16 pt-32">
      <ProductViewTracker productId={product.id} />
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <ProductJsonLd product={product} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={product.image_urls?.[0] || 'https://via.placeholder.com/600x400'} 
              alt={product.name} 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          {product.vendor && (
            <Link href={`/marketplace-aux-philippines/vendeur/${product.vendor.id}`} className="text-lg text-muted-foreground hover:text-primary mb-6 block">
              Vendu par : <span className="font-semibold">{product.vendor.name}</span>
            </Link>
          )}
          <p className="text-3xl font-bold text-primary mb-6">{product.price.toFixed(2)} €</p>
          <div className="prose max-w-none mb-8">
            <p>{product.description}</p>
          </div>
          <ProductInteraction product={product} />
        </div>
      </div>

      <hr className="my-12" />

      <ProductReviews 
        productId={product.id}
        initialReviews={product.product_reviews}
        hasPurchased={hasPurchased}
      />

      <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
    </div>
  );
}
