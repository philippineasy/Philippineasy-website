import { Metadata } from 'next';
import InscriptionClientPage from './InscriptionClientPage';

export const metadata: Metadata = {
  title: 'Inscription Rencontre Philippines | Créez votre profil sur Philippineasy',
  description: 'Rejoignez notre communauté de rencontres en quelques étapes. Créez votre profil, ajoutez vos photos et commencez à rencontrer des célibataires.',
};

export default function InscriptionPage() {
  return <InscriptionClientPage />;
}
