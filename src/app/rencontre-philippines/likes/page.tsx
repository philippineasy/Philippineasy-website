import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LikesClientPage from './LikesClientPage';
import { createClient } from '@/utils/supabase/server';
import { getDatingGateStatus } from '@/services/userService';

export const metadata: Metadata = {
  title: 'Qui a aimé votre profil ? - Rencontre',
  description: 'Découvrez la liste des personnes qui ont manifesté un intérêt pour votre profil. Une fonctionnalité exclusive pour nos membres Premium.',
};

const LikesPage = async () => {
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

  return <LikesClientPage />;
};

export default LikesPage;
