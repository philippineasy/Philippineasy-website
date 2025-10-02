import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer un Itinéraire Personnalisé Philippines avec IA | Philippin\'Easy',
  description: 'Créez votre itinéraire de voyage personnalisé pour les Philippines en quelques clics grâce à notre assistant IA. Budget, durée, style de voyage - nous planifions tout pour vous.',
  keywords: [
    'itinéraire Philippines',
    'voyage personnalisé',
    'IA voyage',
    'planification Philippines',
    'assistant voyage',
    'créer itinéraire Philippines',
    'planifier voyage Philippines',
    'voyage sur mesure Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/itineraire-personnalise-pour-les-philippines',
  },
  openGraph: {
    title: 'Créer un Itinéraire Personnalisé Philippines avec IA',
    description: 'Assistant IA pour créer votre voyage sur mesure aux Philippines. Budget, durée, style - nous planifions tout pour vous.',
    url: 'https://philippineasy.com/itineraire-personnalise-pour-les-philippines',
    siteName: 'Philippin\'Easy',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Créer votre itinéraire personnalisé pour les Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Créer un Itinéraire Personnalisé Philippines avec IA',
    description: 'Assistant IA pour créer votre voyage sur mesure aux Philippines',
    images: ['https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp'],
  },
};

export default function ItineraireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
