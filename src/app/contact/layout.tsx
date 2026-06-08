import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Philippin'Easy pour toute question sur votre voyage, expatriation ou nos services premium aux Philippines.",
  alternates: { canonical: 'https://philippineasy.com/contact' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://philippineasy.com/contact',
    title: "Contactez Philippin'Easy",
    description: "Une question sur votre voyage ou expatriation aux Philippines ? Notre équipe vous répond sous 24h.",
    siteName: "Philippin'Easy",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
