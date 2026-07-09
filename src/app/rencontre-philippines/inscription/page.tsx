import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getDatingGateStatus } from '@/services/userService';
import InscriptionClientPage from './InscriptionClientPage';

export const metadata: Metadata = {
  title: 'Inscription Rencontre Philippines',
  description: 'Rejoignez notre communauté de rencontres en quelques étapes. Créez votre profil, ajoutez vos photos et commencez à rencontrer des célibataires.',
};

export default async function InscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ne pas laisser un visiteur déconnecté remplir 6 étapes pour échouer à la
  // soumission (audit 07/09). On le renvoie au login avec retour ici.
  if (!user) {
    redirect('/connexion?redirect=/rencontre-philippines/inscription');
  }

  // Un membre qui a déjà un profil ne repasse pas par l'inscription.
  const gateStatus = await getDatingGateStatus(supabase, user.id);
  if (gateStatus === 'pending') {
    redirect('/rencontre-philippines/en-attente');
  }
  if (gateStatus === 'validated') {
    redirect('/rencontre-philippines/swipe');
  }

  return <InscriptionClientPage />;
}
