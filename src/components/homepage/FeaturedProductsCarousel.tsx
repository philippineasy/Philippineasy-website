'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { createClient } from '@/utils/supabase/client';
import { ProductCard } from '@/components/shared/ProductCard';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_urls: string[] | null;
  vendors: { name: string } | null;
};

export const FeaturedProductsCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000 })]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            price,
            image_urls,
            vendors (
              name
            )
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          throw error;
        }

        if (data) {
          const formattedData = data.map(p => ({ ...p, vendors: Array.isArray(p.vendors) ? p.vendors[0] : p.vendors }));
          setProducts(formattedData as Product[]);
        }
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
        setError('Impossible de charger les produits pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <p>Aucun produit à afficher pour le moment.</p>
        </div>
    );
  }

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Découvrez l'Artisanat <span className="text-accent">Local</span></h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
            <Link href="/marketplace" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
                Explorer la Marketplace
            </Link>
        </div>
      </div>
    </section>
  );
};
