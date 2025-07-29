'use client';

import { useState } from 'react';
import { handleAddCategory, handleDeleteCategory } from './actions';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryManagementClientProps = {
  initialCategories: Category[];
};

export function CategoryManagementClient({ initialCategories }: CategoryManagementClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    const result = await handleAddCategory(newCategoryName);

    if (result.success && result.data) {
      toast.success('Catégorie ajoutée !');
      setCategories(prev => [...prev, ...result.data!]);
      setNewCategoryName('');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setLoading(false);
  };

  const handleDeleteRequest = (category: Category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    const result = await handleDeleteCategory(categoryToDelete.id);
    if (result.success) {
      toast.success('Catégorie supprimée.');
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setCategoryToDelete(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <form onSubmit={handleAdd} className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Ajouter une catégorie</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-foreground mb-1">Nom de la catégorie</label>
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: Artisanat"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50">
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
      <div className="md:col-span-2">
        <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Catégories existantes</h3>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/40">
                        <span>{cat.name}</span>
                        <button onClick={() => handleDeleteRequest(cat)} className="text-red-500 hover:text-red-700">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                ))}
                {categories.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Aucune catégorie pour le moment.</p>
                )}
            </ul>
        </div>
      </div>

      {categoryToDelete && (
        <ConfirmationModal
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
        >
          <p>Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete.name}" ?</p>
        </ConfirmationModal>
      )}
    </div>
  );
}
