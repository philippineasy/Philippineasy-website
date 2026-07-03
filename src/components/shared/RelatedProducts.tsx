import { createClient } from '@/utils/supabase/server';
import { getRelatedProducts } from '@/services/productService';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

const RelatedProducts = async ({ categoryId, currentProductId }: RelatedProductsProps) => {
  const supabase = await createClient();
  const { data } = await getRelatedProducts(supabase, categoryId, currentProductId);

  const products = (data ?? []).map((p: any) => ({
    ...p,
    vendors: Array.isArray(p.vendors) ? p.vendors[0] : p.vendors,
  }));

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 -mx-6 bg-muted px-6 py-12 md:-mx-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            À découvrir aussi
          </span>
          <h2
            className="mt-2 text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold text-foreground"
            style={{ letterSpacing: '-0.01em' }}
          >
            Produits similaires
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
