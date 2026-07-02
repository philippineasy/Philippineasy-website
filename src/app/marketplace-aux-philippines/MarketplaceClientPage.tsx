'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/shared/ProductCard';

type Category = {
  id: number;
  name: string;
  slug: string;
};

type MarketplaceClientPageProps = {
  initialProducts: any[]; // Using any to avoid type issues with vendors
  categories: Category[];
};

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export function MarketplaceClientPage({ initialProducts, categories }: MarketplaceClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(p => selectedCategory === null || p.category_id === selectedCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [initialProducts, selectedCategory, searchTerm]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  const chipBase =
    'inline-flex h-11 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <section className="bg-background py-14 md:py-16">
      <div className="container mx-auto px-4">
        {/* Toolbar — search + category chips */}
        <div className="mx-auto mb-8 max-w-6xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-[22px] font-semibold text-foreground"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Explorer la boutique
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length > 1 ? 'produits disponibles' : 'produit disponible'}
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <SearchIcon />
                </span>
                <label htmlFor="marketplace-search" className="sr-only">
                  Rechercher un produit
                </label>
                <input
                  type="search"
                  id="marketplace-search"
                  placeholder="Rechercher un produit…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Category bar — horizontal scroll on mobile */}
            {categories.length > 0 && (
              <div
                className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
                style={{ scrollbarWidth: 'none' }}
                role="tablist"
                aria-label="Filtrer par catégorie"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === null}
                  onClick={() => setSelectedCategory(null)}
                  className={
                    chipBase +
                    (selectedCategory === null
                      ? ' border-primary bg-primary text-primary-foreground shadow-sm'
                      : ' border-border bg-card text-foreground hover:border-primary/40 hover:text-primary')
                  }
                >
                  Tout
                </button>
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={
                        chipBase +
                        (active
                          ? ' border-primary bg-primary text-primary-foreground shadow-sm'
                          : ' border-border bg-card text-foreground hover:border-primary/40 hover:text-primary')
                      }
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Products grid */}
        <div className="mx-auto max-w-6xl">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border-[0.5px] border-border bg-card px-6 py-16 text-center shadow-card-rest">
              <span
                className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <SearchIcon />
              </span>
              <p className="text-[15px] font-semibold text-foreground">
                Aucun produit ne correspond
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Essayez un autre mot-clé ou explorez toutes les catégories.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
