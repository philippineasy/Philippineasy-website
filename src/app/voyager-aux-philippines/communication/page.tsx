import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSimCard, faLanguage, faWifi } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/communication';
  const description = page.subtitle || 'Guide pour communiquer aux Philippines : carte SIM, internet et expressions utiles en Tagalog.';

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

const CommunicationPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Communiquer aux"
        titleAccent="Philippines"
        subtitle={page.subtitle || "De la carte SIM locale aux bases du Tagalog, tous nos conseils pour échanger et rester connecté."}
        imageUrl={page.hero_image_url || "/imagesHero/antennes-reseaux-aux-philippines.webp"}
        imageAlt="Communiquer aux Philippines"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2
            className="mb-10 text-center text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            La Communication en Bref
          </h2>
          <StatRow
            className="justify-center"
            stats={[
              { icon: <FontAwesomeIcon icon={faSimCard} className="text-[18px]" />, value: 'Globe & Smart', label: 'Principaux opérateurs mobiles' },
              { icon: <FontAwesomeIcon icon={faLanguage} className="text-[18px]" />, value: 'Anglais', label: 'Langue officielle et très répandue' },
              { icon: <FontAwesomeIcon icon={faWifi} className="text-[18px]" />, value: 'Variable', label: 'Qualité du WiFi selon les zones' },
            ]}
          />
        </div>
      </section>

      <SplitSection
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Personne tenant un smartphone avec une carte SIM"
        title="Acheter une Carte"
        titleAccent="SIM Locale"
      >
        <p>C'est la première chose à faire en arrivant. Vous trouverez des stands des opérateurs Globe et Smart directement à l'aéroport. Acheter une carte SIM prépayée avec un forfait data est très simple et économique.</p>
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Personnes de différentes cultures discutant"
        title="Langues et"
        titleAccent="Expressions Utiles"
      >
        <p>L'anglais est parlé par la grande majorité de la population, ce qui facilite grandement la communication. Apprendre quelques mots de Tagalog (ou de la langue locale de la région que vous visitez) sera cependant très apprécié.</p>
        <ul>
          <li><b>Salamat :</b> Merci</li>
          <li><b>Magkano :</b> Combien ça coûte ?</li>
          <li><b>Paalam :</b> Au revoir</li>
        </ul>
      </SplitSection>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid columns={2}>
            <LinkCard
              title="Guide pour choisir son opérateur"
              href="/voyager-aux-philippines/communication/carte-sim"
              icon={<FontAwesomeIcon icon={faSimCard} className="text-[18px]" />}
            />
            <LinkCard
              title="Apprendre les bases du Tagalog"
              href="/voyager-aux-philippines/communication/expressions"
              icon={<FontAwesomeIcon icon={faLanguage} className="text-[18px]" />}
            />
          </CardGrid>
        </div>
      </section>

      <AffiliateRecommendation
        title="Rester connecte et en securite"
        icon={faSimCard}
        location="communication_page"
        items={[
          {
            name: 'Airalo',
            description:
              "eSIM data pour les Philippines. Achetez et activez AVANT de partir — internet disponible des l'atterrissage. Plus besoin de chercher un shop SIM a l'aeroport.",
            advantage: "A partir de 5 USD pour 1 GB — internet des l'atterrissage",
            url: 'https://www.airalo.com/philippines-esim',
            recommended: true,
          },
          {
            name: 'NordVPN',
            description:
              "Securisez votre connexion sur les Wi-Fi d'hotels et cafes aux Philippines. Accedez aussi a Netflix France, Canal+ et la TV francaise depuis l'etranger.",
            advantage: 'A partir de 3 EUR/mois — Netflix France depuis les Philippines',
            url: 'https://nordvpn.com/fr/',
            recommended: true,
          },
        ]}
      />

    </div>
  );
};

export default CommunicationPage;
