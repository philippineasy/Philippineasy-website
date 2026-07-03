import { createClient } from '@/utils/supabase/server';
import SwipeClientPage from './SwipeClientPage';
import { redirect } from 'next/navigation';
import { getDatingGateStatus } from '@/services/userService';

const SwipePage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion');
  }

  const gateStatus = await getDatingGateStatus(supabase, user.id);
  if (gateStatus === 'no-profile') {
    redirect('/rencontre-philippines/inscription');
  }
  if (gateStatus === 'pending') {
    redirect('/rencontre-philippines/en-attente');
  }

  // On ne charge plus les profils ici. On passe un tableau vide.
  return <SwipeClientPage initialProfiles={[]} hasMoreInitial={true} />;
};

export default SwipePage;
