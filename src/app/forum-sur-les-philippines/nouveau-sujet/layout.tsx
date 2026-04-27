import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nouveau sujet — Forum',
  description: 'Page protégée — connexion requise pour poster un sujet.',
  robots: { index: false, follow: false },
};

export default function NouveauSujetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
