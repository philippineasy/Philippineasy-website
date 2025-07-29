'use client';

import { useState } from 'react';
import Link from 'next/link';
import { approvePhoto, rejectPhoto } from './actions';

// Helper to determine badge color based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <span className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Approuvée</span>;
    case 'rejected':
      return <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Rejetée</span>;
    case 'pending':
    default:
      return <span className="absolute top-1 right-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">En attente</span>;
  }
};

export const PhotosClient = ({ photos }: { photos: any[] }) => {
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const handleApprove = async (photoId: number) => {
    setIsSubmitting(photoId);
    await approvePhoto(photoId);
    setIsSubmitting(null);
  };

  const handleReject = async (photoId: number) => {
    setIsSubmitting(photoId);
    await rejectPhoto(photoId);
    setIsSubmitting(null);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {photos.map((photo: any) => (
        <div key={photo.id} className="relative bg-white p-2 rounded-lg shadow-md">
          {getStatusBadge(photo.status)}
          <img src={photo.image_url} alt={`Photo de ${photo.profiles?.username || 'Utilisateur inconnu'}`} className="w-full h-48 object-cover rounded-md" />
          <div className="mt-2 text-center">
            <Link href={`/rencontre/profil/${photo.user_id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
              {photo.profiles?.username || 'Utilisateur inconnu'}
            </Link>
            <div className="flex justify-around mt-2">
              <button
                onClick={() => handleApprove(photo.id)}
                disabled={isSubmitting === photo.id || photo.status === 'approved'}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
              >
                {isSubmitting === photo.id ? '...' : 'Approuver'}
              </button>
              <button
                onClick={() => handleReject(photo.id)}
                disabled={isSubmitting === photo.id || photo.status === 'rejected'}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
              >
                {isSubmitting === photo.id ? '...' : 'Rejeter'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
