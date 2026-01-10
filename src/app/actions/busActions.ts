'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getBusRoutes(filters: { departureCity?: string; arrivalCity?: string; date?: string; company?: string; }) {
  const supabase = await createClient();
  let query = supabase.from('bus_routes').select('*');

  if (filters.departureCity) {
    query = query.ilike('departure_city', `%${filters.departureCity}%`);
  }
  if (filters.arrivalCity) {
    query = query.ilike('arrival_city', `%${filters.arrivalCity}%`);
  }
  if (filters.date) {
    query = query.eq('departure_date', filters.date);
  }
  if (filters.company) {
    query = query.ilike('company', `%${filters.company}%`);
  }

  const { data: routes, error } = await query.order('departure_date').order('departure_time');

  if (error) {
    console.error('Error fetching bus routes:', error);
    return { data: null, error };
  }

  if (!routes) {
    return { data: [], error: null };
  }

  const userIds = routes.map(route => route.user_id).filter((id): id is string => id !== null);
  if (userIds.length === 0) {
    return { data: routes, error: null };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return { data: routes, error: null }; // Return routes without profiles
  }

  const profilesById = profiles.reduce((acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  }, {} as Record<string, { id: string; username: string; avatar_url: string; }>);

  const data = routes.map(route => ({
    ...route,
    profiles: route.user_id ? profilesById[route.user_id] : null,
  }));

  return { data, error: null };
}

export async function addBusRoute(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to add a route.' };
  }

  const rawFormData = {
    departure_city: formData.get('departure_city') as string,
    arrival_city: formData.get('arrival_city') as string,
    departure_date: formData.get('departure_date') as string,
    departure_time: formData.get('departure_time') as string,
    company: formData.get('company') as string,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    user_id: user.id,
  };

  const { error } = await supabase.from('bus_routes').insert(rawFormData);

  if (error) {
    console.error('Error adding bus route:', error);
    return { error: error.message };
  }

  revalidatePath('/voyager-aux-philippines/transport/bus');
  return { error: null };
}
