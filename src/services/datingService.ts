import { createClient } from '@/utils/supabase/client';
import { DatingProfile, DatingQuestionAnswer, Interest } from '@/types';

const supabase = createClient();

export const checkHasProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('dating_profiles')
    .select('user_id, is_validated')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking profile:', error);
    throw error;
  }
  return data ? { hasProfile: true, isValidated: data.is_validated } : { hasProfile: false, isValidated: false };
};

export const getUserExtras = async (userId: string) => {
  const { data: answers, error: answersError } = await supabase
    .from('dating_question_answers')
    .select('*')
    .eq('profile_id', userId);

  if (answersError) {
    console.error('Error fetching user answers:', answersError);
  }

  const { data: interestsData, error: interestsError } = await supabase
    .from('dating_profile_interests')
    .select('interests(*)')
    .eq('profile_id', userId);
  
  if (interestsError) {
    console.error('Error fetching user interests:', interestsError);
  }

  const interests = interestsData ? interestsData.map((i: any) => i.interests) : [];

  return { answers: (answers || []) as DatingQuestionAnswer[], interests };
};

import { DatingFilters } from '@/components/dating/SwipeFilters';

export const getProfiles = async (page: number, limit: number, filters?: Partial<DatingFilters> | null, excludeUserId?: string): Promise<{ profiles: DatingProfile[], hasMore: boolean }> => {
  let queryString = `page=${page}&limit=${limit}`;
  if (excludeUserId) {
    queryString += `&exclude=${excludeUserId}`;
  }
  if (filters) {
    if (filters.ageRange) {
      queryString += `&minAge=${filters.ageRange.min}&maxAge=${filters.ageRange.max}`;
    }
    if (filters.heightRange) {
      queryString += `&minHeight=${filters.heightRange.min}&maxHeight=${filters.heightRange.max}`;
    }
    if (filters.city) {
      queryString += `&city=${encodeURIComponent(filters.city)}`;
    }
    if (filters.interests && filters.interests.length > 0) {
      queryString += `&interests=${filters.interests.join(',')}`;
    }
    if (filters.religion) {
      queryString += `&religion=${encodeURIComponent(filters.religion)}`;
    }
    if (filters.education) {
      queryString += `&education=${encodeURIComponent(filters.education)}`;
    }
    if (filters.dating_intent) {
      queryString += `&dating_intent=${encodeURIComponent(filters.dating_intent)}`;
    }
    if (filters.gender) {
      queryString += `&gender=${encodeURIComponent(filters.gender)}`;
    }
  }

  const response = await fetch(`/api/dating/profiles?${queryString}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  const data = await response.json();
  return {
    profiles: data.profiles,
    hasMore: data.profiles.length > 0,
  };
};

export const getFullProfile = async (profileId: string, currentUserId: string) => {
  const { data, error } = await supabase.rpc('get_full_profile', {
    p_profile_id: profileId,
    p_current_user_id: currentUserId,
  });

  if (error) {
    console.error('Error fetching full profile:', error);
    return { profile: null, compatibility: 0, isMatch: false };
  }

  const profileData = data.profile;
  const interests = data.interests || [];
  const answers = data.answers || [];
  const photos = data.photos || [];
  const isMatch = data.is_match;

  const fetchedProfile: DatingProfile = {
    ...profileData,
    interests,
    answers,
    photos,
    age: profileData.birth_date ? new Date().getFullYear() - new Date(profileData.birth_date).getFullYear() : undefined,
  };
  
  const compatibility = data.compatibility;

  return { profile: fetchedProfile, compatibility, isMatch };
};

export const getInterests = async () => {
  const { data, error } = await supabase.from('interests').select('*');
  if (error) {
    console.error('Error fetching interests:', error);
    return [];
  }
  return data;
};

export const checkExistingDatingProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('dating_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking for existing profile:', error);
    return false;
  }
  return !!data;
};

export const likeUser = async (toUserId: string, direction: string) => {
  const response = await fetch('/api/dating/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to_user_id: toUserId, direction }),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || 'Failed to like user');
  }
  return await response.json();
};

export const getLikers = async () => {
  const response = await fetch('/api/dating/likes');
  if (!response.ok) {
    throw new Error('Failed to fetch likers');
  }
  return await response.json();
};

export const superLikeUser = async (toUserId: string) => {
  const response = await fetch('/api/dating/super-like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to_user_id: toUserId }),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || 'Failed to send Super Like');
  }
  return await response.json();
};
