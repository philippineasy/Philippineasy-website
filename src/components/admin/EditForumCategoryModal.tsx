'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { updateForumCategory } from '@/services/forumService';
import Modal from '@/components/layout/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditForumCategoryModal = ({ category, isOpen, onClose, onSuccess }: EditCategoryModalProps) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description);
      setSortOrder(category.sort_order);
    } else {
      // Reset for new category
      setName('');
      setSlug('');
      setDescription('');
      setSortOrder(0);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const categoryData = {
      name,
      slug,
      description,
      sort_order: sortOrder,
    };

    // Here you would have a function to either create or update a category
    // For now, we only implement update
    if (category) {
      const result = await updateForumCategory(supabase, category.id, categoryData);
      if (result.error) {
        toast.error("Erreur lors de la mise à jour.");
        console.error(result.error);
      } else {
        toast.success('Catégorie mise à jour !');
        onSuccess();
        onClose();
      }
    }
    // else { ... create logic here ... }
    
    setIsSaving(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cat-name" className="block text-sm font-medium text-foreground">Nom</label>
          <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <label htmlFor="cat-slug" className="block text-sm font-medium text-foreground">Slug</label>
          <Input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <label htmlFor="cat-desc" className="block text-sm font-medium text-foreground">Description</label>
          <textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-1 border-border rounded-md shadow-sm focus:ring-ring focus:border-primary" />
        </div>
        <div>
          <label htmlFor="cat-sort" className="block text-sm font-medium text-foreground">Ordre d'affichage</label>
          <Input id="cat-sort" type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10))} className="mt-1" />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">
            Annuler
          </button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-card-foreground bg-primary hover:bg-primary/90 rounded-md disabled:bg-gray-400">
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
