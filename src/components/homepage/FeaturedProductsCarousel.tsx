'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { supabase } from '@/utils/supabase/client';
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
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-12 animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest">
                  <div className="h-[180px] bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Découvrez l&apos;artisanat <span className="text-accent">local</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Produits authentiques de nos vendeurs philippins, sélectionnés avec soin.
          </p>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 max-w-md mx-auto">
          <Link
            href="/marketplace-aux-philippines"
            className="group flex items-center gap-4 bg-card rounded-2xl px-5 py-4 border-[0.5px] border-border shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary"
              style={{ width: '40px', height: '40px' }}
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-foreground" style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Explorer la marketplace
              </span>
              <span className="block mt-0.5 text-muted-foreground" style={{ fontSize: '12px' }}>
                Tous nos produits locaux &amp; vendeurs vérifiés.
              </span>
            </span>
            <span className="flex-shrink-0 text-primary text-sm transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
