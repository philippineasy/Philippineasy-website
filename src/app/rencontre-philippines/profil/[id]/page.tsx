import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProfileClientPage from './ProfileClientPage';
import { createClient } from '@/utils/supabase/server';
import { getDatingGateStatus } from '@/services/userService';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // In a real scenario, you'd fetch minimal data for title/description.
  return {
    title: `Profil de rencontre Philippines`,
    description: `Découvrez le profil, les photos et les centres d'intérêt de ce membre.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProfilePage() {
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

  return <ProfileClientPage />;
}
