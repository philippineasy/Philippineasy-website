import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Services Premium Philippines : Buddy System, Itinéraires IA & Conciergerie",
  description:
    "Accompagnement IA + humain pour préparer votre voyage ou expatriation aux Philippines. Buddy System avec expats français, itinéraires sur-mesure, suivi WhatsApp 24/7, Pack Ultime tout-inclus. +10 000 voyageurs accompagnés.",
  keywords: [
    'services voyage philippines',
    'conciergerie philippines',
    'buddy system philippines',
    'accompagnement expatriation philippines',
    'itinéraire personnalisé philippines',
    'easy plus philippines',
    'pack ultime philippines',
    'support whatsapp voyage philippines',
    'mentor expat philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/services',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://philippineasy.com/services',
    title: "Services Premium Philippines : Buddy System & Conciergerie",
    description:
      "IA + Humain : itinéraires sur-mesure, expat français en relais 24/7, suivi WhatsApp pendant le séjour. +10 000 voyageurs accompagnés.",
    siteName: "Philippin'Easy",
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: "Services Premium Philippin'Easy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Services Premium Philippines : Buddy System & Conciergerie",
    description: "IA + Humain : itinéraires sur-mesure, expat français en relais 24/7, suivi WhatsApp pendant le séjour.",
    images: ['https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
