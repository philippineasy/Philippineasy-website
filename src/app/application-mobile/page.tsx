import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import {
  Route,
  BookOpen,
  MessagesSquare,
  Heart,
  BadgePercent,
  Bell,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHero, CTABand } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { AppWindowPanel } from '@/components/sections/AppWindowPanel';
import NotifyForm from './NotifyForm';

export const metadata: Metadata = {
  title: 'Application mobile : bientôt disponible',
  description:
    "L'application mobile Philippin'Easy arrive bientôt. Laissez votre email pour être prévenu du lancement et retrouver vos itinéraires, guides et la communauté dans votre poche.",
  alternates: {
    canonical: 'https://philippineasy.com/application-mobile',
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
    title: "Application mobile Philippin'Easy : bientôt disponible",
    description:
      "L'app Philippin'Easy arrive. Inscrivez-vous pour être prévenu du lancement.",
    url: 'https://philippineasy.com/application-mobile',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/imagesHero/comment-voyager-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: "Application mobile Philippin'Easy — bientôt disponible",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Application mobile Philippin'Easy : bientôt disponible",
    description: "L'app arrive. Soyez prévenu du lancement.",
    site: '@philippineasy',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { label: 'Application mobile' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Application mobile', item: '/application-mobile' },
];

// Sober, honest "coming soon" store badge — NOT a link. Signals availability
// without pretending the app is downloadable yet.
const StoreBadge = ({
  icon,
  store,
}: {
  icon: typeof faApple;
  store: string;
}) => (
  <div
    className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-foreground shadow-card-rest"
    role="group"
    aria-label={`${store} — bientôt disponible`}
  >
    <FontAwesomeIcon icon={icon} className="text-2xl text-foreground" aria-hidden="true" />
    <span className="text-left leading-tight">
      <span className="block text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        Bientôt sur
      </span>
      <span className="block text-[15px] font-semibold">{store}</span>
    </span>
    <span className="ml-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-accent-strong">
      Prochainement
    </span>
  </div>
);

// Roadmap feature — anti-rainbow: every icon sits on the same primary chip.
// Grounded in features the SITE already ships (itineraries, guides, forum,
// dating, deals, notifications) — presented as "in your pocket". No invented
// capabilities (no AR, no offline translator).
const RoadmapFeature = ({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
    <span
      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
      aria-hidden="true"
    >
      {icon}
    </span>
    <h3 className="mb-1.5 text-[17px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
      {title}
    </h3>
    <p className="text-[14px] leading-[1.6] text-muted-foreground">{desc}</p>
  </div>
);

const roadmap = [
  {
    icon: <Route className="h-5 w-5" />,
    title: 'Vos itinéraires, hors-ligne',
    desc: "Générés par notre IA sur le web, retrouvés dans l'app même sans réseau sur le terrain.",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Tous les guides dans votre poche',
    desc: 'Voyager, vivre, visas : notre bibliothèque complète, consultable où que vous soyez.',
  },
  {
    icon: <MessagesSquare className="h-5 w-5" />,
    title: 'La communauté avec vous',
    desc: 'Le forum et les discussions, pour demander un conseil directement depuis le terrain.',
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: 'Rencontres en déplacement',
    desc: 'Votre profil et vos messages accessibles, même en vadrouille entre deux îles.',
  },
  {
    icon: <BadgePercent className="h-5 w-5" />,
    title: 'Bons plans & marketplace',
    desc: 'Les meilleures offres et la boutique communautaire, à portée de main.',
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: 'Notifications utiles',
    desc: "Une alerte quand votre itinéraire est prêt ou qu'on répond à votre message.",
  },
];

export default function ApplicationMobilePage() {
  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Application mobile · Bientôt disponible"
        title="L'app Philippin'Easy arrive"
        titleAccent="bientôt"
        subtitle="Bientôt, tout Philippin'Easy tiendra dans votre poche : vos itinéraires, nos guides et la communauté, même loin du Wi-Fi. En attendant, laissez-nous votre email — vous serez prévenu le jour du lancement."
        imageUrl="/imagesHero/comment-voyager-aux-philippines.webp"
        imageAlt="Voyageur explorant les Philippines, smartphone en main"
      />

      {/* Contexte honnête + badges stores non cliquables */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 max-w-2xl">
            <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Le point sur l&apos;application
            </span>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              L&apos;app n&apos;est pas encore là, <span className="text-accent">le site fait déjà tout</span>
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-muted-foreground">
              Soyons transparents : l&apos;application mobile est en préparation, elle n&apos;est pas
              encore téléchargeable. Pas d&apos;impatience à avoir — tout ce qu&apos;elle proposera
              est déjà disponible aujourd&apos;hui sur le site, depuis votre navigateur mobile.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreBadge icon={faApple} store="App Store" />
            <StoreBadge icon={faGooglePlay} store="Google Play" />
          </div>
        </div>
      </section>

      {/* Ce qu'on prépare — la roadmap (features réelles du site, dans l'app) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[720px] text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Ce qu&apos;on prépare
            </span>
            <h2
              className="mt-3 text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
            >
              Philippin&apos;Easy, <span className="text-accent">dans votre poche</span>
            </h2>
            <p className="mt-4 text-[17px] leading-[1.6] text-muted-foreground">
              L&apos;app reprendra ce que le site fait déjà, pensé pour le voyage : consultable en
              déplacement, pratique sur le terrain.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {roadmap.map((f) => (
              <RoadmapFeature key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-muted-foreground">
            Fonctionnalités prévues — la feuille de route peut évoluer d&apos;ici le lancement.
          </p>
        </div>
      </section>

      {/* Capture d'intérêt — liste d'attente branchée sur /api/newsletter */}
      <AppWindowPanel
        eyebrow="Liste d'attente"
        title="Soyez prévenu du"
        titleAccent="lancement"
        bullets={[
          'Parmi les premiers informés le jour de la sortie',
          'Votre email ne sert qu’à ça, rien d’autre',
          'Désinscription en un clic, à tout moment',
        ]}
        windowTitle="Être prévenu du lancement"
      >
        <div className="py-1">
          <p className="mb-4 text-[14px] leading-[1.6] text-muted-foreground">
            Laissez votre email et recevez un message dès que l&apos;application est disponible sur
            l&apos;App Store et Google Play.
          </p>
          <NotifyForm />
        </div>
      </AppWindowPanel>

      {/* Maillage — en attendant, utiliser l'outil web */}
      <CTABand
        title="En attendant l'app, créez votre"
        titleAccent="itinéraire"
        subtitle="Notre générateur d'itinéraires par IA fonctionne déjà sur mobile, directement dans votre navigateur. Testez-le en quelques minutes."
        primary={{
          label: 'Créer mon itinéraire',
          href: '/itineraire-personnalise-pour-les-philippines',
        }}
        secondary={{ label: 'Parcourir les guides', href: '/voyager-aux-philippines' }}
      />
    </div>
  );
}
