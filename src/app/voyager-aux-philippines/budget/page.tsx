import { Metadata } from 'next';
import { AFFILIATE_LINKS } from '@/config/affiliates';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faBed, faUtensils, faHotel } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

// FAQ 100 % factuelle — reformule les repères prix déjà donnés plus haut sur la
// page (StatRow, DataTables manger/hébergement) et le bloc de recommandations.
// Feed le visible ET le FAQPage schema via <FaqAccordion withSchema>.
const BUDGET_FAQS = [
  {
    q: 'Quel budget prévoir par jour aux Philippines ?',
    a: "Trois profils reviennent le plus souvent chez nos lecteurs : entre 30 et 50 € par jour et par personne en mode backpacker, entre 60 et 100 € pour un séjour confortable, et à partir de 120 € pour un voyage plus luxueux. Ces montants couvrent l'ensemble des dépenses quotidiennes.",
  },
  {
    q: 'Combien coûte un repas aux Philippines ?',
    a: "Un repas complet dans une carinderia, ces petits restaurants de quartier sans chichi, revient entre 2 et 4 €. Comptez plutôt 8 à 15 € dans un restaurant milieu de gamme, et à peine 1 € pour une bière San Miguel bien fraîche.",
  },
  {
    q: 'Quel budget prévoir pour se loger ?',
    a: "L'hébergement absorbe souvent la plus grosse part du budget. Un lit en dortoir se loue entre 8 et 15 € la nuit, une chambre double simple entre 20 et 40 €, tandis qu'un resort en bord de mer peut multiplier la facture par dix.",
  },
  {
    q: 'Combien coûte une excursion en bateau à El Nido ?',
    a: "Un tour en bateau parmi les plus courus, comme ceux d'El Nido, reste autour de 20 à 25 € par personne. Les activités comme la plongée ou les sorties en bateau viennent ensuite s'ajouter au budget, île par île.",
  },
  {
    q: 'Comment économiser sur son voyage aux Philippines ?',
    a: "Réservez votre hébergement à l'avance en haute saison (décembre-mai), notamment à El Nido et Siargao où les meilleurs hôtels partent vite. Côté change, évitez de changer de l'argent à l'aéroport et privilégiez une carte comme Wise, qui applique le taux de change réel sans frais de conversion.",
  },
];

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

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, table de repères prix.  */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({
  eyebrow,
  title,
  accent,
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  center?: boolean;
}) => (
  <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
    <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2
      className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
      style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
    >
      {title}
      {accent && (
        <>
          {' '}
          <span className="text-accent">{accent}</span>
        </>
      )}
    </h2>
  </div>
);

// Table de repères prix compacte (recette visas-et-formalites / logement).
const DataTable = ({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; value: string }[];
}) => (
  <div className="mt-6 overflow-hidden rounded-xl border-[0.5px] border-border bg-card">
    <div className="border-b border-border bg-muted px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {caption}
    </div>
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-[14px] text-foreground">{r.label}</dt>
          <dd className="whitespace-nowrap text-[14px] font-semibold tabular-nums text-foreground">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

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
        subtitle={page.subtitle || "Découvrez comment voyager aux Philippines sans vous ruiner, que vous soyez backpacker ou en quête de confort."}
        imageUrl={page.hero_image_url || "/imagesHero/maitriser-son-budget-aux-philippines.webp"}
        imageAlt="Maîtriser son Budget"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader center eyebrow="Trois façons de voyager" title="Un budget pour chaque" accent="voyageur" />
          <div className="mx-auto mt-5 max-w-2xl space-y-4 text-center text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Aux Philippines, la vraie question n&apos;est pas de savoir si vous pouvez voyager
              léger, mais jusqu&apos;où vous voulez pousser le confort. Un repas en carinderia
              revient entre 2 et 4 €, un dortoir se loue entre 8 et 15 € la nuit, et même un tour
              en bateau couru comme ceux d&apos;El Nido reste autour de 20 à 25 €.
            </p>
            <p>
              Ces repères se combinent différemment selon le rythme de chacun. Voici les trois
              profils qui reviennent le plus souvent chez nos lecteurs, en dépense quotidienne par
              personne.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <StatRow
              className="justify-center"
              stats={[
                { icon: <FontAwesomeIcon icon={faWallet} className="text-[18px]" />, value: '30-50€/j', label: 'Backpacker' },
                { icon: <FontAwesomeIcon icon={faBed} className="text-[18px]" />, value: '60-100€/j', label: 'Confort' },
                { icon: <FontAwesomeIcon icon={faUtensils} className="text-[18px]" />, value: '120€+/j', label: 'Luxe' },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Boire et manger sur place"
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Marché local avec des fruits et légumes"
        title="Manger &"
        titleAccent="boire"
      >
        <p>
          La nourriture est l&apos;un des grands plaisirs, et l&apos;une des grandes économies,
          d&apos;un voyage aux Philippines. Dans une carinderia — ces petits restaurants de
          quartier sans chichi, marmites en inox et grand sourire au comptoir — un repas complet se
          prend pour quelques euros à peine. Même chose côté boisson : une San Miguel bien fraîche
          coûte à peine plus qu&apos;une bouteille d&apos;eau.
        </p>
        <DataTable
          caption="Repères prix · repas et boissons"
          rows={[
            { label: 'Repas en carinderia', value: '2 – 4 €' },
            { label: 'Restaurant milieu de gamme', value: '8 – 15 €' },
            { label: 'Bière locale (San Miguel)', value: '~1 €' },
          ]}
        />
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        eyebrow="Où dormir, quoi faire"
        imageUrl="/images/budget/chambre-vue-mer.webp"
        imageAlt="Chambre d'hôtel avec vue sur la mer"
        title="Hébergement et"
        titleAccent="activités"
      >
        <p>
          L&apos;hébergement absorbe souvent la plus grosse part du budget, mais l&apos;écart de
          prix est immense selon le niveau de confort recherché&nbsp;: un lit en dortoir se
          réserve pour presque rien, tandis qu&apos;un resort en bord de mer peut multiplier la
          facture par dix. Les activités comme la plongée ou les sorties en bateau viennent ensuite
          s&apos;ajouter à l&apos;addition, île par île.
        </p>
        <DataTable
          caption="Repères prix · logement et sorties"
          rows={[
            { label: 'Dortoir', value: '8 – 15 €' },
            { label: 'Chambre double simple', value: '20 – 40 €' },
            { label: 'Tour en bateau à El Nido', value: '~20 – 25 €' },
          ]}
        />
      </SplitSection>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="Pour aller plus loin" title="Deux guides pour" titleAccent="approfondir" columns={2}>
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

      {/* FAQ — visible + FAQPage schema (source unique BUDGET_FAQS) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Vos questions"
            titleAccent="budget"
            faqs={BUDGET_FAQS}
            withSchema
          />
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
            url: AFFILIATE_LINKS.booking,
            recommended: true,
          },
          {
            name: 'Wise',
            description:
              "Ne changez PAS a l'aeroport (taux horrible). Avec la carte Wise, vous payez au taux de change reel sans frais de conversion. Compte multi-devises EUR + PHP.",
            advantage: 'Economisez 3-5% sur chaque transaction EUR → PHP',
            url: AFFILIATE_LINKS.wise,
            recommended: true,
          },
        ]}
      />

    </div>
  );
};

export default BudgetPage;
