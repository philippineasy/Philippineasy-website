'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/layout/Modal';
import { updateHeroImage } from './actions';

interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSlug: string;
  currentImageUrl: string;
}

export const EditHeroModal = ({ isOpen, onClose, pageSlug, currentImageUrl }: EditHeroModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(formRef.current!);
      const result = await updateHeroImage(pageSlug, formData);

      if (result.error) {
        alert(result.error);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Une erreur est survenue lors du téléversement de l\'image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'image de couverture">
      <form ref={formRef} onSubmit={handleSubmit} className="p-4">
        <p className="mb-4">Image actuelle :</p>
        <img src={currentImageUrl} alt="Image de couverture actuelle" className="w-full h-48 object-cover rounded-lg mb-4" />
        
        <label htmlFor="heroImage" className="block mb-2 font-semibold">Nouvelle image :</label>
        <input
          type="file"
          id="heroImage"
          name="heroImage"
          accept="image/*"
          required
          className="w-full p-2 border rounded"
        />

        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Annuler</button>
          <button type="submit" disabled={isUploading} className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-400">
            {isUploading ? 'Téléversement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
