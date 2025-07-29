import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'articles';

export const uploadImage = async (supabase: SupabaseClient, file: File) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (!publicUrlData) {
        throw new Error('Could not get public URL for uploaded image');
    }

    return {
      success: 1,
      file: {
        url: publicUrlData.publicUrl,
      },
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: 0,
    };
  }
};

export const uploadArticleThumbnail = async (supabase: SupabaseClient, file: File): Promise<string | null> => {
  try {
    const fileName = `thumbnail_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    if (!publicUrlData) {
        throw new Error('Could not get public URL for uploaded thumbnail');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return null;
  }
}

export const uploadDatingGalleryImage = async (supabase: SupabaseClient, file: File, userId: string): Promise<string | null> => {
  try {
    // Path will be user_id/filename to keep storage organized and secure with RLS
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dating_profile_pictures')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('dating_profile_pictures')
      .getPublicUrl(uploadData.path);
    
    if (!publicUrlData) {
        throw new Error('Could not get public URL for uploaded gallery image');
    }

    const imageUrl = publicUrlData.publicUrl;

    // Now, insert the record into the database
    const { error: dbError } = await supabase
      .from('dating_photos')
      .insert({ user_id: userId, image_url: imageUrl });

    if (dbError) {
      // TODO: Maybe delete the uploaded file if DB insert fails
      throw dbError;
    }

    return imageUrl;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return null;
  }
}

export const uploadPageHero = async (supabase: SupabaseClient, file: File): Promise<string | null> => {
  try {
    const fileName = `hero_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('page-heroes')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('page-heroes')
      .getPublicUrl(data.path);
    
    if (!publicUrlData) {
        throw new Error('Could not get public URL for uploaded hero');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading hero image:', error);
    return null;
  }
}

export const uploadDatingProfilePicture = async (supabase: SupabaseClient, file: File, userId: string): Promise<string | null> => {
  try {
    const fileName = `profile_${userId}_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('dating_profile_pictures')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('dating_profile_pictures')
      .getPublicUrl(data.path);
    
    if (!publicUrlData) {
        throw new Error('Could not get public URL for uploaded profile picture');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
}
