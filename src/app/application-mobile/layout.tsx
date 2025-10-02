import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Mobile Philippin\'Easy : Voyage Hors Ligne | iOS & Android',
  description: 'Téléchargez l\'app mobile Philippin\'Easy : cartes hors ligne, traducteur tagalog, itinéraires personnalisés, accès forum. Disponible sur App Store et Google Play.',
  keywords: [
    'application Philippines',
    'app mobile Philippines',
    'carte hors ligne Philippines',
    'traducteur tagalog',
    'guide Philippines offline',
    'iOS Android Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/application-mobile',
  },
  openGraph: {
    title: 'Application Mobile Philippin\'Easy - iOS & Android',
    description: 'Votre compagnon de voyage aux Philippines : cartes offline, traducteur, itinéraires.',
    url: 'https://philippineasy.com/application-mobile',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Mobile Philippin\'Easy',
    description: 'Voyage aux Philippines hors ligne',
    site: '@philippineasy',
  },
};

export default function ApplicationMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
