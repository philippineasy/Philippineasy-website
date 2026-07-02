import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
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

/* -------------------------------------------------------------------------- */
/* En-tête de section : eyebrow uppercase + h2 avec UN mot en amber vif.       */
/* Repris à l'identique du pattern validé sur                                  */
/* /vivre-aux-philippines/visas-et-formalites.                                 */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) => (
  <div className="max-w-2xl">
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
    {description && (
      <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{description}</p>
    )}
  </div>
);

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

      {/* Vue d'ensemble — bande muette remplaçant l'ancien StatRow non numérique */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Avant de partir" title="Les essentiels à" accent="anticiper" />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Un voyage aux Philippines se prépare aussi côté santé. Avant de boucler la valise,
              trois questions valent la peine d'être posées : vos vaccins sont-ils à jour, votre
              trousse contient-elle de quoi parer aux petits bobos, et votre assurance
              couvre-t-elle les frais médicaux sur place ?
            </p>
            <p>
              Les deux sections qui suivent détaillent chacun de ces points, vaccins puis
              sécurité au quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Chapitre 1 — Vaccins */}
      <SplitSection
        eyebrow="Côté vaccins"
        title="Préparer sa"
        titleAccent="Santé"
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Flacons de vaccins"
      >
        <p>
          Avant de faire vos valises, un point s'impose : consultez votre médecin pour vérifier
          que vos vaccins sont à jour. Les vaccins contre l'hépatite A, l'hépatite B et le
          tétanos sont fortement recommandés, tout comme une bonne protection contre les
          moustiques, seule vraie parade contre la dengue et le chikungunya.
        </p>
        <Link href="/voyager-aux-philippines/sante-securite/vaccins" className="text-accent font-bold hover:underline mt-4 inline-block">Liste des vaccins recommandés →</Link>
      </SplitSection>

      {/* Chapitre 2 — Sécurité */}
      <SplitSection
        eyebrow="Au quotidien"
        title="Rester en"
        titleAccent="Sécurité"
        imageUrl="/images/sante/controle-police-philippines.webp"
        imageAlt="Cadenas sur un sac à dos"
        reverse
        tone="muted"
      >
        <p>
          Niveau sécurité, les Philippines restent un pays globalement sûr pour les touristes.
          Comme partout, quelques précautions de base s'imposent : ne pas exposer ses objets de
          valeur, rester vigilant dans les zones très fréquentées, et se renseigner sur les zones
          déconseillées par les autorités avant de s'y aventurer.
        </p>
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
