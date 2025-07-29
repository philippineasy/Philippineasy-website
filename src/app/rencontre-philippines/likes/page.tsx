import { Metadata } from 'next';
import LikesClientPage from './LikesClientPage';

export const metadata: Metadata = {
  title: 'Qui a aimé votre profil ? | Philippineasy Rencontre',
  description: 'Découvrez la liste des personnes qui ont manifesté un intérêt pour votre profil. Une fonctionnalité exclusive pour nos membres Premium.',
};

const LikesPage = () => {
  return <LikesClientPage />;
};

export default LikesPage;
