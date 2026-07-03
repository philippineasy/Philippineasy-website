import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faWandMagicSparkles,
  faComments,
  faHeart,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { PageHero, CardGrid, LinkCard, CTABand } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import WebPageJsonLd from '@/components/shared/WebPageJsonLd';

const PAGE_TITLE = 'À propos';
const PAGE_DESCRIPTION =
  "Philippin'Easy est un guide francophone indépendant sur les Philippines, fondé par Hugo, un Français installé sur place. Pas une agence de voyage : des guides gratuits, un itinéraire sur mesure et une communauté francophone.";
const CANONICAL_URL = 'https://philippineasy.com/a-propos';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
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
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { label: 'À propos' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'À propos', item: '/a-propos' },
];

const FEATURES = [
  {
    title: 'Des guides gratuits',
    desc: "Voyage, visas, logement, budget, travail : des dizaines d'articles pratiques, mis à jour, sans mur payant.",
    href: '/vivre-aux-philippines',
    icon: faBookOpen,
  },
  {
    title: 'Un itinéraire sur mesure',
    desc: "Un parcours généré selon vos dates, votre budget et vos envies, affiné avec la connaissance du terrain.",
    href: '/itineraire-personnalise-pour-les-philippines',
    icon: faWandMagicSparkles,
  },
  {
    title: 'Un forum actif',
    desc: 'Un espace pour poser vos questions et échanger avec des voyageurs et des expatriés francophones.',
    href: '/forum-sur-les-philippines',
    icon: faComments,
  },
  {
    title: 'Un espace rencontres',
    desc: "Pensé pour la communauté francophone des Philippines, loin des applications généralistes.",
    href: '/rencontre-philippines',
    icon: faHeart,
  },
  {
    title: 'Une marketplace',
    desc: 'Des bons plans et des produits utiles pour préparer un voyage ou une installation.',
    href: '/marketplace-aux-philippines',
    icon: faStore,
  },
];

const AProposPage = () => {
  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <WebPageJsonLd title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/a-propos" />

      <PageHero
        eyebrow="Notre histoire"
        title="À propos de"
        titleAccent="Philippin'Easy"
        subtitle="Un guide francophone indépendant sur les Philippines, écrit et testé sur place."
        imageUrl="/imagesHero/nouveau-depart-aux-philippines.webp"
        imageAlt="Voyageur arrivant avec ses valises aux Philippines"
      />

      <section className="bg-background py-14 md:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mx-auto max-w-2xl article-content">
            <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Qui est derrière ce site
            </span>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Un guide, pas une <span className="text-accent">agence</span>
            </h2>

            <div className="mt-5 space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Philippin&apos;Easy est né d&apos;un constat simple : il existe très peu de ressources
                fiables en français sur les Philippines. C&apos;est un site indépendant, fondé et tenu
                par Hugo, un Français installé sur place, qui écrit et vérifie le contenu au fil de
                son quotidien dans l&apos;archipel.
              </p>
              <p>
                Une précision importante : nous ne sommes <strong>pas une agence de voyage</strong> ni
                un tour-opérateur. Nous ne vendons pas de séjours clé en main. Notre travail consiste
                à rassembler, vérifier et tenir à jour l&apos;information — visas, budget, logement,
                culture — pour que vous puissiez organiser vous-même votre voyage ou votre
                installation, en confiance.
              </p>
              <p>
                Pour les projets qui demandent un accompagnement plus poussé, comme un itinéraire
                sur mesure, nous combinons l&apos;IA pour construire une base adaptée à vos dates, votre
                budget et vos envies, avec la connaissance du terrain d&apos;un francophone qui vit aux
                Philippines — plutôt que de remplacer l&apos;un par l&apos;autre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Sur le site"
            title="Ce que vous trouverez"
            titleAccent="ici"
            subtitle="Cinq espaces pensés pour couvrir un projet philippin, du premier guide de voyage à l'installation."
            columns={3}
          >
            {FEATURES.map((feature) => (
              <LinkCard
                key={feature.title}
                title={feature.title}
                desc={feature.desc}
                href={feature.href}
                icon={<FontAwesomeIcon icon={feature.icon} className="text-[16px]" />}
              />
            ))}
          </CardGrid>
        </div>
      </section>

      <CTABand
        title="Une question, une remarque, un"
        titleAccent="projet ?"
        subtitle="Écrivez-nous directement : nous répondons personnellement, sous 48h en général."
        primary={{ label: 'Nous contacter', href: '/contact' }}
        secondary={{ label: 'Voir les guides', href: '/vivre-aux-philippines' }}
      />
    </div>
  );
};

export default AProposPage;
