import { createClient } from '@/utils/supabase/server';
import { PhotosClient } from './PhotosClient';
import { Camera } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminEmptyState } from '@/components/admin';

export default async function AdminDatingPhotosPage() {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from('dating_photos')
    .select('id, user_id, image_url, status, profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <AdminCard padding="lg">
        <p className="text-rose-700 font-medium">Erreur lors du chargement des photos: {error.message}</p>
      </AdminCard>
    );
  }

  const pending = photos?.filter((p: any) => p.status === 'pending').length || 0;
  const approved = photos?.filter((p: any) => p.status === 'approved').length || 0;
  const rejected = photos?.filter((p: any) => p.status === 'rejected').length || 0;

  return (
    <>
      <AdminPageHeader
        eyebrow="Modération · Rencontre"
        title={<>Modération des <span className="text-accent">photos</span></>}
        description={
          <>
            <span className="text-amber-700 font-semibold">{pending}</span> en attente ·{' '}
            <span className="text-emerald-700 font-semibold">{approved}</span> approuvées ·{' '}
            <span className="text-rose-700 font-semibold">{rejected}</span> rejetées
          </>
        }
      />

      {photos && photos.length > 0 ? (
        <PhotosClient photos={photos} />
      ) : (
        <AdminCard padding="lg">
          <AdminEmptyState
            icon={<Camera className="w-6 h-6" />}
            title="Aucune photo"
            description="Aucune photo dating uploadée pour le moment."
          />
        </AdminCard>
      )}
    </>
  );
}
