import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import VendorApplicationClientPage from './VendorApplicationClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devenir Vendeur sur Marketplace Philippines | Philippin\'Easy',
  description: 'Vendez vos produits sur la marketplace Philippines leader en France. Inscription gratuite, commission équitable, accès à une communauté de passionnés des Philippines.',
  keywords: [
    'devenir vendeur Philippines',
    'vendre sur marketplace',
    'e-commerce Philippines',
    'inscription vendeur',
    'vendre produits philippins',
    'commerce en ligne Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/marketplace-aux-philippines/devenir-vendeur',
  },
  openGraph: {
    title: 'Devenir Vendeur - Marketplace Philippines',
    description: 'Vendez vos produits Philippines en France. Inscription gratuite et accès à une large communauté.',
    url: 'https://philippineasy.com/marketplace-aux-philippines/devenir-vendeur',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Devenir Vendeur Philippines',
    description: 'Vendez vos produits sur la marketplace',
    site: '@philippineasy',
  },
};

export default async function DevenirVendeurPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (existingVendor) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Votre Candidature</h1>
          {existingVendor.status === 'pending' && (
            <p className="text-lg text-yellow-500 mb-8">Votre candidature est en cours d'examen. Nous vous contacterons bientôt.</p>
          )}
          {existingVendor.status === 'approved' && (
            <p className="text-lg text-green-500 mb-8">Félicitations ! Votre candidature a été approuvée. Vous pouvez maintenant accéder à votre tableau de bord.</p>
          )}
          {existingVendor.status === 'rejected' && (
            <p className="text-lg text-red-500 mb-8">Nous sommes désolés, mais votre candidature n'a pas été retenue pour le moment.</p>
          )}
           <Link href="/profil/boutique" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
            Accéder à mon espace vendeur
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <VendorApplicationClientPage user={user} />
    </div>
  );
}
