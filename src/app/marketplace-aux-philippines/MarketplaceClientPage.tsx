'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/shared/ProductCard';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_urls: string[] | null;
  vendors: {
    name: string;
  } | null;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type MarketplaceClientPageProps = {
  initialProducts: any[]; // Using any to avoid type issues with vendors
  categories: Category[];
};

export function MarketplaceClientPage({ initialProducts, categories }: MarketplaceClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(p => selectedCategory === null || p.category_id === selectedCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [initialProducts, selectedCategory, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-lg text-muted-foreground mt-2">Découvrez les trésors de l'artisanat et des produits locaux philippins.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Filtres</h3>
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">Rechercher</label>
              <input
                type="text"
                id="search"
                placeholder="Nom du produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Catégories</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-1 rounded ${!selectedCategory ? 'font-bold text-primary' : 'hover:text-primary'}`}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1 rounded ${selectedCategory === cat.id ? 'font-bold text-primary' : 'hover:text-primary'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="w-full lg:w-3/4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
