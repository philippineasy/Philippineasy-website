import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductInteraction } from './ProductInteraction';
import { ProductReviews } from './ProductReviews';
import RelatedProducts from '@/components/shared/RelatedProducts';
import { ProductViewTracker } from './ProductViewTracker';
import ProductJsonLd from '@/components/shared/ProductJsonLd';
import type { Metadata } from 'next';

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

  return {
    title: `${product.name} | Marketplace Philippin'Easy`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
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
  };
}

async function getProductBySlug(supabase: ReturnType<typeof createClient>, slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image_urls,
      category_id,
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

  return (
    <div className="container mx-auto px-4 py-16">
      <ProductViewTracker productId={product.id} />
      <ProductJsonLd product={product} />
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
