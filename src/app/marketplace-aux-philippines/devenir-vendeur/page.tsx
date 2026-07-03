import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import VendorApplicationClientPage from './VendorApplicationClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devenir Vendeur sur Marketplace Philippines',
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

export default async function DevenirVendeurPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (existingVendor) {
      const statusCard = {
        pending: {
          tone: 'bg-accent/10 text-accent-strong',
          title: 'Candidature en cours d’examen',
          message: 'Merci ! Votre candidature a bien été reçue et est en cours d’examen par notre équipe. Nous vous contacterons très bientôt par e-mail.',
        },
        approved: {
          tone: 'bg-success/10 text-success',
          title: 'Candidature approuvée',
          message: 'Félicitations ! Votre candidature a été approuvée. Vous pouvez dès maintenant accéder à votre espace vendeur et publier vos produits.',
        },
        rejected: {
          tone: 'bg-destructive/10 text-destructive',
          title: 'Candidature non retenue',
          message: 'Nous sommes désolés, votre candidature n’a pas été retenue pour le moment. N’hésitez pas à nous contacter pour en savoir plus.',
        },
      }[existingVendor.status as 'pending' | 'approved' | 'rejected'] ?? {
        tone: 'bg-muted text-muted-foreground',
        title: 'Votre candidature',
        message: 'Le statut de votre candidature est en cours de traitement.',
      };

      return (
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-lg rounded-2xl border-[0.5px] border-border bg-card p-8 text-center shadow-card-rest md:p-10">
            <span className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full ${statusCard.tone}`}>
              <StoreIcon />
            </span>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{statusCard.title}</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {statusCard.message}
            </p>
            <Link
              href="/profil/boutique"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Accéder à mon espace vendeur
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <VendorApplicationClientPage user={user} applicationSuccess={success === 'true'} />
    </div>
  );
}

const StoreIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
);
