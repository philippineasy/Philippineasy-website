import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MessagesClientPage from './MessagesClientPage';
import { Message } from '@/types';

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion');
  }

  const { data: matchesWithLastMessage, error } = await supabase
    .rpc('get_matches_with_details', { p_user_id: user.id });

  if (error) {
    console.error('Error fetching matches with details:', error);
    return <div>Erreur lors du chargement des conversations.</div>;
  }

  return <MessagesClientPage initialMatches={matchesWithLastMessage || []} currentUserId={user.id} />;
}
