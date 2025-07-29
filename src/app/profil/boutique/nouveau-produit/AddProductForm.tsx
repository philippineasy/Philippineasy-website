'use client';

import { useState } from 'react';
import { handleAddProduct } from './actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CustomSelect } from '@/components/shared/CustomSelect';

type Category = {
  id: number;
  name: string;
};

type AddProductFormProps = {
  categories: Category[];
  vendorId: number;
};

export function AddProductForm({ categories, vendorId }: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('vendorId', vendorId.toString());

    const result = await handleAddProduct(formData);

    if (result.success) {
      toast.success('Produit ajouté avec succès !');
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
        <input type="text" id="name" name="name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label htmlFor="description" className="block text-foreground mb-2 font-semibold">Description</label>
        <textarea id="description" name="description" rows={5} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-foreground mb-2 font-semibold">Prix (€)</label>
          <input type="number" id="price" name="price" required step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="category" className="block text-foreground mb-2 font-semibold">Catégorie</label>
          <CustomSelect
            name="categoryId"
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            value={categoryId}
            onChange={(value) => setCategoryId(value as string)}
            placeholder="Sélectionnez une catégorie"
          />
        </div>
      </div>
      <div>
        <label htmlFor="image" className="block text-foreground mb-2 font-semibold">Image du produit</label>
        <input type="file" id="image" name="image" required accept="image/png, image/jpeg" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50">
          {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </div>
    </form>
  );
}
