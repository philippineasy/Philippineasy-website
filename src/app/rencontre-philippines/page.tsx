import { Metadata } from 'next';
import RencontreClientPage from './RencontreClientPage';

export const metadata: Metadata = {
  title: 'Rencontre Philippines | Trouvez l\'amour avec Philippineasy',
  description: 'Rejoignez notre communauté de rencontres pour trouver des célibataires philippins et expatriés. Créez votre profil, discutez et trouvez votre moitié.',
};

const RencontrePage = () => {
  return <RencontreClientPage />;
};

export default RencontrePage;
