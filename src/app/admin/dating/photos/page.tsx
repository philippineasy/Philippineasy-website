import { createClient } from '@/utils/supabase/server';
import { PhotosClient } from './PhotosClient';

const AdminDatingPhotosPage = async () => {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from('dating_photos')
    .select('id, user_id, image_url, status, profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Erreur lors du chargement des photos: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Modération des Photos</h1>
      <PhotosClient photos={photos} />
    </div>
  );
};

export default AdminDatingPhotosPage;
