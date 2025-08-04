'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { getRelatedProducts } from '@/services/productService';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

const RelatedProducts = ({ categoryId, currentProductId }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const { data } = await getRelatedProducts(supabase, categoryId, currentProductId);
      if (data) {
        setRelatedProducts(data as any);
      }
    };

    fetchRelated();
  }, [supabase, categoryId, currentProductId]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 py-12 bg-muted -mx-6 md:-mx-10 px-6 md:px-10">
      <h2 className="text-2xl font-bold mb-8 text-center">Produits similaires</h2>
      <div className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory">
        {relatedProducts.map(product => (
          <div key={product.id} className="snap-center flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
