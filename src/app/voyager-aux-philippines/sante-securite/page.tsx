import { Metadata } from 'next';
import { PageHero, SplitSection, StatRow } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faFirstAid, faShieldAlt, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'sante-securite');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/sante-securite';
  const description = page.subtitle || 'Conseils santé et sécurité pour voyager aux Philippines : vaccins, assurance et précautions.';

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

const SanteSecuritePage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'sante-securite');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Santé &"
        titleAccent="Sécurité"
        subtitle={page.subtitle || "Nos conseils pour voyager l'esprit tranquille et faire face à tous les imprévus."}
        imageUrl={page.hero_image_url || "/imagesHero/securite-et-sante-aux-philippines.webp"}
        imageAlt="Santé & Sécurité"
      />

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Essentiels à ne pas Oublier</h2>
          <div className="flex justify-center">
            <StatRow
              stats={[
                { value: 'Vaccins', label: 'Hépatites A/B, Tétanos recommandés', icon: <FontAwesomeIcon icon={faSyringe} className="text-[18px]" /> },
                { value: 'Trousse', label: 'Anti-moustiques et pansements indispensables', icon: <FontAwesomeIcon icon={faFirstAid} className="text-[18px]" /> },
                { value: 'Assurance', label: 'Indispensable pour couvrir les frais médicaux', icon: <FontAwesomeIcon icon={faShieldAlt} className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitSection
        title="Préparer sa"
        titleAccent="Santé"
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Flacons de vaccins"
      >
        <p>Avant de partir, consultez votre médecin pour vérifier que vos vaccins sont à jour. Les vaccins contre l'hépatite A, l'hépatite B et le tétanos sont fortement recommandés. La protection contre les moustiques est également cruciale pour éviter la dengue et le chikungunya.</p>
        <Link href="/voyager-aux-philippines/sante-securite/vaccins" className="text-accent font-bold hover:underline mt-4 inline-block">Liste des vaccins recommandés →</Link>
      </SplitSection>

      <SplitSection
        title="Rester en"
        titleAccent="Sécurité"
        imageUrl="/images/sante/controle-police-philippines.webp"
        imageAlt="Cadenas sur un sac à dos"
        reverse
        tone="muted"
      >
        <p>Les Philippines sont un pays globalement sûr pour les touristes. Cependant, comme partout, il convient de prendre des précautions de base : ne pas exposer ses objets de valeur, être vigilant dans les zones très fréquentées et se renseigner sur les zones déconseillées par les autorités.</p>
        <Link href="/voyager-aux-philippines/sante-securite/conseils" className="text-accent font-bold hover:underline mt-4 inline-block">Nos conseils de sécurité →</Link>
      </SplitSection>

      <AffiliateRecommendation
        title="Protegez-vous avant de partir"
        icon={faShieldHalved}
        location="sante_securite_page"
        items={[
          {
            name: 'Chapka Assurances',
            description:
              "L'assurance voyage n'est pas obligatoire pour les Philippines (visa touriste 30 jours), mais elle est fortement recommandee. Les frais medicaux ne sont pas couverts par la Secu — une hospitalisation peut couter plusieurs milliers d'euros. Souscrivez AVANT de partir.",
            advantage: 'A partir de 22 EUR/mois — rapatriement, frais medicaux, bagages inclus',
            url: 'https://www.chapkadirect.fr/assurance-voyage.html',
            recommended: true,
          },
          {
            name: 'NordVPN',
            description:
              "Les Wi-Fi des hotels et cafes aux Philippines sont rarement securises. Un VPN chiffre votre connexion et protege vos donnees bancaires et mots de passe sur les reseaux publics.",
            advantage: 'A partir de 3 EUR/mois — protegez vos donnees bancaires',
            url: 'https://nordvpn.com/fr/',
            recommended: false,
          },
        ]}
      />

    </div>
  );
};

export default SanteSecuritePage;
