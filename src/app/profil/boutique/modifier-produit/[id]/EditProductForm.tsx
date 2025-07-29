'use client';

import { useState } from 'react';
import { handleUpdateProduct } from './actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomSelect } from '@/components/shared/CustomSelect';

type Category = {
  id: number;
  name: string;
};

type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category_id: number | null;
    image_urls: string[] | null;
};

type EditProductFormProps = {
  categories: Category[];
  product: Product;
};

export function EditProductForm({ categories, product }: EditProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(product.category_id || '');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('productId', product.id.toString());

    const result = await handleUpdateProduct(formData);

    if (result.success) {
      toast.success('Produit mis à jour avec succès !');
      router.push('/profil/boutique?tab=products');
    } else {
      toast.error(`Erreur: ${result.error}`);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg space-y-6">
      <div>
        <label htmlFor="name" className="block text-foreground mb-2 font-semibold">Nom du produit</label>
        <input type="text" id="name" name="name" defaultValue={product.name} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label htmlFor="description" className="block text-foreground mb-2 font-semibold">Description</label>
        <textarea id="description" name="description" defaultValue={product.description || ''} rows={5} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-foreground mb-2 font-semibold">Prix (€)</label>
          <input type="number" id="price" name="price" defaultValue={product.price} required step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="category" className="block text-foreground mb-2 font-semibold">Catégorie</label>
          <CustomSelect
            name="categoryId"
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            value={categoryId}
            onChange={(value) => setCategoryId(value as number)}
            placeholder="Sélectionnez une catégorie"
          />
        </div>
      </div>
      <div>
        <label htmlFor="image" className="block text-foreground mb-2 font-semibold">Changer l'image du produit</label>
        {product.image_urls && (
            <div className="my-2">
                <Image src={product.image_urls[0]} alt="Image actuelle" width={100} height={100} className="rounded-md" />
            </div>
        )}
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
        <p className="text-xs text-muted-foreground mt-1">Laissez vide pour conserver l'image actuelle.</p>
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50">
          {loading ? 'Mise à jour...' : 'Mettre à jour le produit'}
        </button>
      </div>
    </form>
  );
}
