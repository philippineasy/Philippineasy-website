import { Metadata } from 'next';
import RencontreClientPage from './RencontreClientPage';

export const metadata: Metadata = {
  title: 'Rencontre Philippines : Trouvez l\'Amour | Philippin\'Easy',
  description: 'Site de rencontre pour célibataires aux Philippines. Rencontrez des Philippins et expatriés, créez des connexions authentiques. Inscription gratuite.',
  keywords: [
    'rencontre Philippines',
    'dating Philippines',
    'célibataires Philippines',
    'mariage Philippines',
    'filipina rencontre',
    'site rencontre Philippines',
    'expatriés Philippines',
    'amour Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/rencontre-philippines',
  },
  openGraph: {
    title: 'Rencontre Philippines : Trouvez l\'Amour',
    description: 'Communauté de rencontres pour célibataires aux Philippines. Créez des connexions authentiques avec des Philippins et expatriés.',
    url: 'https://philippineasy.com/rencontre-philippines',
    siteName: 'Philippin\'Easy',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Couple heureux aux Philippines - Rencontre et amour',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rencontre Philippines : Trouvez l\'Amour',
    description: 'Site de rencontre pour célibataires aux Philippines. Inscription gratuite.',
    images: ['https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp'],
  },
};

const RencontrePage = () => {
  return <RencontreClientPage />;
};

export default RencontrePage;
