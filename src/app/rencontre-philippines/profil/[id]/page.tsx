import { Metadata } from 'next';
import ProfileClientPage from './ProfileClientPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // In a real scenario, you'd fetch minimal data for title/description.
  return {
    title: `Profil de rencontre philippines sur Philippineasy`,
    description: `Découvrez le profil, les photos et les centres d'intérêt de ce membre.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ProfilePage() {
  return <ProfileClientPage />;
}
