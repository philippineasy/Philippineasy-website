'use client';

import { useState } from 'react';
import Image from 'next/image';
import { updateCategoryAndRevalidate } from '@/app/actions/categoryActions';
import Modal from '@/components/layout/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  description: string;
  heroImage?: string;
}

interface EditCategoryModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCategory: Category) => void;
}

export const EditCategoryModal = ({ category, isOpen, onClose, onUpdate }: EditCategoryModalProps) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updates: { name?: string; description?: string; imageFile?: File } = {};
    if (name !== category.name) updates.name = name;
    if (description !== category.description) updates.description = description;
    if (imageFile) updates.imageFile = imageFile;

    const { success, data, error } = await updateCategoryAndRevalidate(category.id, updates);

    if (success) {
      toast.success('Catégorie mise à jour avec succès !');
      onUpdate(data);
      onClose();
    } else {
      toast.error("Erreur lors de la mise à jour.");
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier la catégorie "${category.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cat-name" className="block text-sm font-medium text-foreground">Nom</label>
          <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cat-desc" className="block text-sm font-medium text-foreground">Description</label>
          <textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-1 border-border rounded-md shadow-sm focus:ring-ring focus:border-primary" />
        </div>
        <div>
          <label htmlFor="cat-image" className="block text-sm font-medium text-foreground">Image de la catégorie</label>
          <Input id="cat-image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
          {category.heroImage && (
            <div className="w-full h-32 relative mt-2">
              <Image src={category.heroImage} alt="Aperçu" fill className="object-cover rounded-md" />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={isSaving} variant="default">
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
