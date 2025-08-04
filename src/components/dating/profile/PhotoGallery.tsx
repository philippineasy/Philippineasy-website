'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { DatingProfile, DatingPhoto } from '@/types';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { uploadDatingGalleryImage } from '@/services/uploadService';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoGalleryProps {
  profile: DatingProfile;
  isOwnProfile: boolean;
}

const PhotoGallery = ({ profile, isOwnProfile }: PhotoGalleryProps) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<DatingPhoto[]>(profile.photos || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<DatingPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    
    const file = event.target.files[0];
    setIsUploading(true);

    const newImageUrl = await uploadDatingGalleryImage(supabase, file, user.id);

    if (newImageUrl) {
      // Refetch or optimistically update UI
      const { data: newPhotos } = await supabase
        .from('dating_photos')
        .select('id, image_url, sort_order, status')
        .eq('user_id', user.id)
        .order('sort_order');
      setPhotos(newPhotos || []);
    } else {
      toast.error("Erreur lors de l'upload de l'image.");
    }
    setIsUploading(false);
  };

  const handleDeleteRequest = (photo: DatingPhoto) => {
    setPhotoToDelete(photo);
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    const { error } = await supabase.from('dating_photos').delete().eq('id', photoToDelete.id);

    if (error) {
      toast.error("Erreur lors de la suppression de la photo.");
    } else {
      setPhotos(photos.filter(p => p.id !== photoToDelete.id));
      toast.success("Photo supprimée.");
    }
    setPhotoToDelete(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Photos</h2>
        {isOwnProfile && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold flex items-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : (
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
            )}
            Ajouter
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/png, image/jpeg"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-w-1 aspect-h-1 group relative">
            <img 
              src={photo.image_url} 
              alt={`Photo de ${profile.username}`} 
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedImage(photo.image_url)}
            />
            {isOwnProfile && (
              <>
                {photo.status === 'pending' && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    En attente
                  </div>
                )}
                {photo.status === 'rejected' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Rejetée
                  </div>
                )}
                <button 
                  onClick={() => handleDeleteRequest(photo)}
                  className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
        {photos.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">Aucune photo dans la galerie.</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
      >
        <p>Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.</p>
      </ConfirmationModal>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
