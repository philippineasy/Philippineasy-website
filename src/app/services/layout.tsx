import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Services & Accompagnement Philippines | Philippin'Easy",
  description:
    "Itinéraires IA personnalisés, mentorat avec expats français sur place, suivi WhatsApp pendant votre voyage. Accompagnement unique pour voyager et vivre aux Philippines.",
  keywords: [
    'accompagnement philippines',
    'guide expatriation philippines',
    'itinéraire personnalisé philippines',
    'mentor expat philippines',
    'buddy system philippines',
    'voyage accompagné philippines',
  ],
  openGraph: {
    title: "Services & Accompagnement | Philippin'Easy",
    description:
      "Buddy System, Pack Voyage Serein, Pack Ultime - Des services uniques pour réussir votre projet Philippines.",
    type: 'website',
    locale: 'fr_FR',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
