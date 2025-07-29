'use client';

import { useState } from 'react';
import Image from 'next/image';
import { updateArticleAndRevalidate } from '@/app/actions/articleActions';
import Modal from '@/components/layout/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

// Define a simplified Article type for the modal
interface Article {
  id: number;
  title: string;
  image?: string;
  // Add other fields if they are needed for display or update
}

interface EditArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedArticle: Article) => void;
}

export const EditArticleModal = ({ article, isOpen, onClose, onUpdate }: EditArticleModalProps) => {
  const [title, setTitle] = useState(article.title);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updates: { title?: string; imageFile?: File; image?: string; } = {};
    if (title !== article.title) updates.title = title;
    if (imageFile) updates.imageFile = imageFile;
    
    // Pass the original image URL for comparison in the backend
    if (article.image) updates.image = article.image;


    if (!updates.title && !updates.imageFile) {
      toast('Aucune modification détectée.');
      setIsSaving(false);
      onClose();
      return;
    }

    const { success, data, error } = await updateArticleAndRevalidate(article.id, updates);

    if (success) {
      toast.success('Article mis à jour avec succès !');
      onUpdate(data);
      onClose();
    } else {
      toast.error("Erreur lors de la mise à jour de l'article.");
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier l'article "${article.title}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="art-title" className="block text-sm font-medium text-foreground">Titre</label>
          <Input id="art-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="art-image" className="block text-sm font-medium text-foreground">Image de l'article</label>
          <Input id="art-image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
          {article.image && (
            <div className="w-full h-32 relative mt-2">
              <Image src={article.image} alt="Aperçu" fill className="object-cover rounded-md" />
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
