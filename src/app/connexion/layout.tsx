import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion | Philippin\'Easy',
  description: 'Connectez-vous ou créez votre compte Philippin\'Easy pour accéder aux fonctionnalités exclusives.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
