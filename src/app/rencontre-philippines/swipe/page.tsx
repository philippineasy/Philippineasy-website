import { createClient } from '@/utils/supabase/server';
import SwipeClientPage from './SwipeClientPage';
import { redirect } from 'next/navigation';

const SwipePage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion');
  }

  // On ne charge plus les profils ici. On passe un tableau vide.
  return <SwipeClientPage initialProfiles={[]} hasMoreInitial={true} />;
};

export default SwipePage;
