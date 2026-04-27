import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion Vendeur — Marketplace',
  description: 'Page de connexion réservée aux vendeurs partenaires de la marketplace Philippin\'Easy.',
  robots: { index: false, follow: false },
};

export default function VendeurConnexionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
