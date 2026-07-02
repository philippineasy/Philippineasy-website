import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faBed, faUtensils, faHotel } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'budget');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/budget';
  const description = page.subtitle || 'Guide complet pour gérer son budget aux Philippines : hébergement, nourriture, transport et activités.';

  return {
    title: page.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: page.title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
      site: '@philippineasy',
    },
  };
}

const BudgetPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'budget');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Maîtriser son"
        titleAccent="Budget"
        subtitle={page.subtitle || "Découvrez comment voyager-aux-philippines aux Philippines sans vous ruiner, que vous soyez backpacker ou en quête de confort."}
        imageUrl={page.hero_image_url || "/imagesHero/maitriser-son-budget-aux-philippines.webp"}
        imageAlt="Maîtriser son Budget"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2
            className="mb-10 text-center text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Estimations par Type de Voyageur
          </h2>
          <StatRow
            className="justify-center"
            stats={[
              { icon: <FontAwesomeIcon icon={faWallet} className="text-[18px]" />, value: '30-50€/j', label: 'Backpacker' },
              { icon: <FontAwesomeIcon icon={faBed} className="text-[18px]" />, value: '60-100€/j', label: 'Confort' },
              { icon: <FontAwesomeIcon icon={faUtensils} className="text-[18px]" />, value: '120€+/j', label: 'Luxe' },
            ]}
          />
        </div>
      </section>

      <SplitSection
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Marché local avec des fruits et légumes"
        title="Manger &"
        titleAccent="Boire"
      >
        <p>La nourriture est très abordable. Vous pouvez manger un repas complet dans un "carinderia" (petit restaurant local) pour quelques euros. Les bières locales comme la San Miguel sont également très bon marché.</p>
        <ul>
          <li><b>Repas local :</b> 2-4€</li>
          <li><b>Restaurant moyen :</b> 8-15€</li>
          <li><b>Bière locale :</b> ~1€</li>
        </ul>
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        imageUrl="/images/budget/chambre-vue-mer.webp"
        imageAlt="Chambre d'hôtel avec vue sur la mer"
        title="Hébergement & Activités"
      >
        <p>L'hébergement représente une part importante du budget. Les auberges de jeunesse (dortoirs) sont l'option la plus économique, tandis que les resorts de luxe peuvent coûter plusieurs centaines d'euros par nuit. Les activités comme la plongée ou les tours en bateau sont à prévoir dans votre budget.</p>
        <ul>
          <li><b>Dortoir :</b> 8-15€</li>
          <li><b>Chambre double simple :</b> 20-40€</li>
          <li><b>Tour en bateau (El Nido) :</b> ~20-25€</li>
        </ul>
      </SplitSection>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid columns={2}>
            <LinkCard
              title="Guide de la street food"
              href="/voyager-aux-philippines/budget/nourriture"
              icon={<FontAwesomeIcon icon={faUtensils} className="text-[18px]" />}
            />
            <LinkCard
              title="Comment trouver les meilleurs hôtels"
              href="/voyager-aux-philippines/budget/hebergement"
              icon={<FontAwesomeIcon icon={faBed} className="text-[18px]" />}
            />
          </CardGrid>
        </div>
      </section>

      <AffiliateRecommendation
        title="Nos recommandations pour economiser"
        icon={faHotel}
        location="budget_page"
        items={[
          {
            name: 'Booking.com',
            description:
              "Reservez a l'avance en haute saison (decembre-mai). Les meilleurs hotels partent vite, surtout a El Nido et Siargao. Annulation gratuite sur la plupart des reservations.",
            advantage: 'Prix negocie + annulation gratuite',
            url: 'https://www.booking.com/country/ph.fr.html',
            recommended: true,
          },
          {
            name: 'Wise',
            description:
              "Ne changez PAS a l'aeroport (taux horrible). Avec la carte Wise, vous payez au taux de change reel sans frais de conversion. Compte multi-devises EUR + PHP.",
            advantage: 'Economisez 3-5% sur chaque transaction EUR → PHP',
            url: 'https://wise.com/fr/send-money/send-money-to-philippines',
            recommended: true,
          },
        ]}
      />

    </div>
  );
};

export default BudgetPage;
