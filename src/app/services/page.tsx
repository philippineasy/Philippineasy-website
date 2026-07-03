'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ServiceCard from '@/components/services/ServiceCard';
import ServicesJsonLd from '@/components/shared/ServicesJsonLd';
import { PageHero, CardGrid, FaqAccordion, type StatItem } from '@/components/sections';
import { cn } from '@/lib/utils';

// Descriptions détaillées pour les infobulles
const TOOLTIPS = {
  itineraireConciergerie:
    "Programme jour par jour 100% personnalisé, hébergements recommandés avec liens booking, Google Maps intégré, modifications illimitées, contact WhatsApp direct avec Hugo",
  buddySystem:
    "2-4 calls de 30min avec un expatrié français vivant aux Philippines, contact WhatsApp direct avec votre buddy, conseils locaux personnalisés avant/pendant/après voyage",
  suiviWhatsapp:
    "Support en temps réel pendant votre voyage : problèmes de transport, recommandations restaurants, urgences. Réponse garantie sous 2h max",
  easyPlus:
    "-20% chez tous nos partenaires (hôtels, activités, transports), support prioritaire 24/7, guides premium offerts, assistant IA illimité WhatsApp/Telegram",
  rencontrePremium:
    "Profil vérifié et mis en avant, likes illimités, voir qui vous a liké, filtres avancés (localisation, âge, centres d'intérêt), messagerie prioritaire",
  guidePdf:
    "Accès à tous les guides PDF Philippineasy pendant la durée de ton pack (Visa Philippines, Coût de la vie, Destinations secrètes, et tous les nouveaux guides à venir) — format PDF téléchargeable et imprimable",
  groupePrive:
    "Accès à vie au Discord/Telegram exclusif avec la communauté d'expats et voyageurs francophones aux Philippines - entraide, bons plans, rencontres",
  itinerairePremium:
    "Itinéraire IA personnalisé avec modifications gratuites, export PDF, liens Google Maps, recommandations hébergements et restaurants",
  callAvantDepart:
    "Call vidéo de 30min avec Hugo pour préparer votre voyage : derniers conseils, check-list personnalisée, réponse à toutes vos questions",
  checklistPersonnalisee:
    "Liste complète et personnalisée : documents, vaccins, applications à télécharger, objets à emporter, budget à prévoir",
};

// Single source of truth for the Services FAQ — feeds BOTH the visible
// <FaqAccordion> and its FAQPage JSON-LD (via withSchema). The 4 canvas Q/R
// and the historical serviceFAQs are identical, so no de-dup merge is needed;
// the Pack Ultime answer was cross-checked against the real pack features
// (Conciergerie, Buddy, WhatsApp, Easy+ 1 an, Rencontre Premium 6 mois, guides
// PDF pendant le pack, groupe privé à vie).
const serviceFAQs = [
  {
    q: "Qu'est-ce que le Buddy System ?",
    a: "Le Buddy System vous met en relation avec un expatrié français vivant aux Philippines. Vous bénéficiez de calls avant, pendant et après votre voyage, ainsi qu'un contact WhatsApp direct pour des conseils personnalisés et locaux.",
  },
  {
    q: 'Comment fonctionne le suivi WhatsApp ?',
    a: "Pendant votre voyage, vous avez un accès direct à notre équipe via WhatsApp. Problème de transport, question sur un restaurant, besoin d'aide en urgence ? Nous sommes là pour vous répondre rapidement.",
  },
  {
    q: 'Le Pack Ultime inclut-il vraiment tout ?',
    a: "Oui : itinéraire Conciergerie, Buddy System complet, suivi WhatsApp pendant tout le séjour, Easy+ 1 an, Rencontre Premium 6 mois, tous nos guides PDF pendant la durée du pack, et l'accès à vie au groupe privé.",
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Pour les packs supérieurs à 200 €, nous proposons le paiement en 2 ou 3 fois sans frais. Contactez-nous pour en discuter.',
  },
];

const heroStats: StatItem[] = [
  { value: '47', label: 'Guides gratuits' },
  { value: '93', label: 'Itinéraires générés' },
  { value: '100 %', label: 'Francophone' },
  { value: '7j/7', label: 'Support WhatsApp' },
];

// --- Aperçu des offres itinéraire (renvoi vers le générateur IA) ---
const itineraryTiers = [
  { name: 'Express', price: '9,99 € – 29,99 €', desc: '100 % IA, livraison instantanée', popular: false },
  { name: 'Premium', price: '29 € – 99 €', desc: 'IA + retouches + support e-mail', popular: true },
  { name: 'Conciergerie', price: '79 € – 219 €', desc: 'Sur-mesure + WhatsApp direct', popular: false },
];

// --- Panneau signature : la différence humaine ---
const diffBullets = [
  "IA + humain : la technologie prépare, un vrai Français vous guide.",
  "Pas une agence : un guide francophone qui vit l'archipel au quotidien.",
  "Des conseils testés sur le terrain, jamais recopiés d'un guide touristique.",
  'Un accompagnement humain par des Français installés aux Philippines depuis 2020.',
];

// --- Icônes inline (feather, stroke 1.8) ---
const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const SparkleIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
    <path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
  </svg>
);

const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const StarIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PanelCheck = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const humanPillars = [
  {
    icon: <SparkleIcon />,
    title: 'Itinéraire IA en 30 secondes',
    text: 'Un plan jour par jour, prêt avant même votre premier échange.',
  },
  {
    icon: <UsersIcon />,
    title: 'Un buddy expat français',
    text: 'Il vit aux Philippines, connaît le terrain et vous répond en français.',
  },
  {
    icon: <ChatIcon />,
    title: 'Suivi WhatsApp 7j/7',
    text: 'Un souci sur place ? Réponse sous 2h, avant, pendant et après.',
  },
];

// --- Communauté & abonnements ---
const rencontrePlans = [
  { label: '1 mois', price: '19,99 €', unit: '/mois', best: false },
  { label: '3 mois', price: '14,99 €', unit: '/mois', best: false },
  { label: '6 mois', price: '9,99 €', unit: '/mois', best: true },
];
const easyPlusPlans = [
  { label: 'Mensuel', price: '29,99 €', unit: '/mois', best: false },
  { label: 'Annuel (−31 %)', price: '249 €', unit: '/an', best: true },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesJsonLd />

      {/* Hero — editorial photo + stats (H1 unique) */}
      <PageHero
        eyebrow="Services Easy+ · Accompagnement humain"
        title="Un accompagnement humain aux"
        titleAccent="Philippines"
        subtitle="IA + expat français sur place : Buddy System, itinéraires sur-mesure et suivi WhatsApp 7j/7. Ce qu'aucune agence ne peut offrir."
        imageUrl="/imagesHero/comment-voyager-aux-philippines.webp"
        imageAlt="Voyageurs accompagnés par Philippin'Easy aux Philippines"
        stats={heroStats}
      />

      {/* Section 1 — Itinéraires IA (aperçu des offres) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Pour les voyageurs"
            title="Un itinéraire sur-mesure en"
            titleAccent="30 secondes"
            subtitle="Choisissez votre niveau d'accompagnement : 100 % IA, IA avec retouches, ou conciergerie avec un contact direct."
            columns={3}
          >
            {itineraryTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'relative flex h-full flex-col rounded-2xl bg-card px-[26px] py-7 transition-all duration-200 hover:-translate-y-1 motion-reduce:hover:transform-none',
                  tier.popular
                    ? 'border-[1.5px] border-primary shadow-[0_4px_6px_rgba(0,0,0,0.07)]'
                    : 'border-[0.5px] border-border shadow-card-rest hover:border-primary/30 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)]'
                )}
              >
                {tier.popular && (
                  <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
                    Populaire
                  </span>
                )}
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">{tier.name}</h3>
                <p className="mt-[3px] text-[13px] leading-[1.4] text-muted-foreground">{tier.desc}</p>
                {/* Price ranges kept at 26px (a full 32px overflows on small mobile). */}
                <p
                  className={cn(
                    'mt-[18px] text-[26px] font-bold leading-none tabular-nums tracking-[-0.02em]',
                    tier.popular ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {tier.price}
                </p>
                <p className="mt-[6px] text-[12px] text-muted-foreground">Paiement unique</p>
              </div>
            ))}
          </CardGrid>

          <div className="mt-10 text-center">
            <Link
              href="/itineraire-personnalise-pour-les-philippines"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Créer mon itinéraire
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — Panneau signature : la différence humaine */}
      <section className="bg-muted py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl text-white"
            style={{
              background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
            }}
          >
            <span
              className="pointer-events-none absolute rounded-full"
              style={{
                width: '320px',
                height: '320px',
                top: '-120px',
                right: '-80px',
                border: '2px dashed rgba(255,255,255,0.13)',
              }}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute rounded-full"
              style={{
                width: '200px',
                height: '200px',
                bottom: '-60px',
                left: '-40px',
                border: '2px dashed rgba(255,255,255,0.13)',
              }}
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
              {/* Gauche — pitch éditorial */}
              <div>
                <span
                  className="mb-4 inline-block text-[13px] font-medium uppercase"
                  style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.95)' }}
                >
                  <span className="mr-1.5 text-accent" aria-hidden="true">
                    ✦
                  </span>
                  La différence Philippin&apos;Easy
                </span>
                <h2
                  className="mb-4 font-bold text-white"
                  style={{
                    fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  Des Français qui vivent <span className="text-accent">sur place</span>
                </h2>
                <p className="mb-6 text-[15px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Nos concurrents vendent un PDF ou un chatbot. Nous, on vous met en relation avec
                  quelqu&apos;un qui connaît vraiment le terrain — et qui parle votre langue.
                </p>
                <ul className="flex flex-col gap-2.5" role="list">
                  {diffBullets.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-[14px]"
                      style={{ color: 'rgba(255,255,255,0.92)' }}
                    >
                      <span
                        className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent"
                        aria-hidden="true"
                      >
                        <PanelCheck />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Droite — carte "méthode" */}
              <div className="overflow-hidden rounded-2xl bg-card text-foreground shadow-mockup">
                <div className="border-b border-border/60 bg-muted px-6 py-3.5">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    La méthode Philippin&apos;Easy
                  </span>
                </div>
                <ul className="divide-y divide-border/60">
                  {humanPillars.map((pillar) => (
                    <li key={pillar.title} className="flex items-start gap-4 px-6 py-5">
                      <span
                        className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        {pillar.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                          {pillar.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-[1.5] text-muted-foreground">
                          {pillar.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Buddy System (ancre #buddy) */}
      <section id="buddy" className="scroll-mt-32 bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Exclusif · Buddy System"
            title="Un expat français devient votre"
            titleAccent="buddy"
            subtitle="Il vit aux Philippines. Calls, WhatsApp et bons plans testés sur place : un mentor rien que pour vous, avant, pendant et après le voyage."
            columns={3}
          >
            <ServiceCard
              name="Buddy Court Séjour"
              description="3-5 jours"
              features={[
                { text: '2 calls de 30min', tooltip: 'Calls vidéo avec votre buddy expatrié : 1 avant le départ + 1 pendant le voyage' },
                { text: 'WhatsApp 1 semaine', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Conseils locaux personnalisés', tooltip: 'Recommandations basées sur vos goûts : restaurants, activités, bonnes adresses testées par votre buddy' },
              ]}
              price={79}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=buddy_short"
            />
            <ServiceCard
              name="Buddy Standard"
              description="1-2 semaines"
              features={[
                { text: '3 calls de 30min', tooltip: 'Calls vidéo avec votre buddy : 1 avant départ + 1 à mi-parcours + 1 debriefing' },
                { text: 'WhatsApp 2 semaines', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Conseils locaux personnalisés', tooltip: 'Recommandations basées sur vos goûts : restaurants, activités, bonnes adresses testées par votre buddy' },
                { text: 'Support pendant le voyage', tooltip: 'Aide en cas de problème : traduction, négociation, urgences - votre buddy est joignable' },
              ]}
              price={119}
              badge="Populaire"
              highlighted
              ctaText="Choisir"
              ctaHref="/checkout/services?type=buddy_medium"
            />
            <ServiceCard
              name="Buddy Long Séjour"
              description="3+ semaines"
              features={[
                { text: '4 calls de 30min', tooltip: 'Calls vidéo réguliers : préparation + pendant voyage + debriefing + suivi expatriation' },
                { text: 'WhatsApp 1 mois', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Conseils locaux personnalisés', tooltip: 'Recommandations basées sur vos goûts : restaurants, activités, bonnes adresses testées par votre buddy' },
                { text: 'Support complet', tooltip: 'Accompagnement total : recherche logement, démarches administratives, intégration locale' },
                { text: "Réseau d'entraide", tooltip: "Accès au réseau de contacts de votre buddy : autres expats, locaux de confiance, bons plans exclusifs" },
              ]}
              price={149}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=buddy_long"
            />
          </CardGrid>
        </div>
      </section>

      {/* Section 4 — Pack Voyage Serein */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Pack Voyage Serein"
            title="Itinéraire Premium + accompagnement"
            titleAccent="humain"
            subtitle="Un plan sur-mesure, un call avec Hugo avant le départ, et un suivi WhatsApp pendant tout le séjour."
            columns={3}
          >
            <ServiceCard
              name="Serein Court"
              description="3-5 jours"
              features={[
                { text: 'Itinéraire Premium inclus', tooltip: TOOLTIPS.itinerairePremium },
                { text: 'Call 30min avant départ', tooltip: TOOLTIPS.callAvantDepart },
                { text: 'Suivi WhatsApp 1 semaine', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Checklist personnalisée', tooltip: TOOLTIPS.checklistPersonnalisee },
              ]}
              price={99}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=voyage_serein_short"
            />
            <ServiceCard
              name="Serein Standard"
              description="1-2 semaines"
              features={[
                { text: 'Itinéraire Premium inclus', tooltip: TOOLTIPS.itinerairePremium },
                { text: 'Call 30min avant départ', tooltip: TOOLTIPS.callAvantDepart },
                { text: 'Suivi WhatsApp 2 semaines', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Checklist personnalisée', tooltip: TOOLTIPS.checklistPersonnalisee },
                { text: 'Support en cas de problème', tooltip: 'Assistance réactive si imprévu : annulation vol, problème hôtel, urgence médicale - on gère avec vous' },
              ]}
              price={149}
              badge="Populaire"
              highlighted
              ctaText="Choisir"
              ctaHref="/checkout/services?type=voyage_serein_medium"
            />
            <ServiceCard
              name="Serein Long"
              description="3+ semaines"
              features={[
                { text: 'Itinéraire Premium inclus', tooltip: TOOLTIPS.itinerairePremium },
                { text: 'Call 30min avant départ', tooltip: TOOLTIPS.callAvantDepart },
                { text: 'Suivi WhatsApp 3 semaines', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Checklist personnalisée', tooltip: TOOLTIPS.checklistPersonnalisee },
                { text: 'Support prioritaire', tooltip: "Réponse garantie sous 1h en cas d'urgence, assistance VIP tout au long du voyage" },
              ]}
              price={199}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=voyage_serein_long"
            />
          </CardGrid>
        </div>
      </section>

      {/* Section 5 — Pack Ultime (ancre #pack-ultime) */}
      <section id="pack-ultime" className="scroll-mt-32 bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Le plus complet"
            title="Pack"
            titleAccent="Ultime"
            subtitle="Itinéraire conciergerie, Buddy System, Easy+, Rencontre Premium et accès à tous nos guides. Le pack le plus complet du marché."
            columns={3}
          >
            <ServiceCard
              name="Jusqu'à 2 semaines"
              description="Le tout-inclus, format court"
              features={[
                { text: 'Itinéraire Conciergerie', tooltip: TOOLTIPS.itineraireConciergerie },
                { text: 'Buddy System complet', tooltip: TOOLTIPS.buddySystem },
                { text: 'Suivi WhatsApp 2 sem.', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Easy+ 1 an', tooltip: TOOLTIPS.easyPlus },
                { text: 'Rencontre Premium 6 mois', tooltip: TOOLTIPS.rencontrePremium },
              ]}
              price={369}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=pack_ultime_medium"
            />
            <ServiceCard
              name="3 semaines – 1 mois"
              description="Notre séjour complet"
              features={[
                { text: 'Itinéraire Conciergerie', tooltip: TOOLTIPS.itineraireConciergerie },
                { text: 'Buddy System complet', tooltip: TOOLTIPS.buddySystem },
                { text: 'Suivi WhatsApp 4 sem.', tooltip: TOOLTIPS.suiviWhatsapp },
                { text: 'Easy+ 1 an', tooltip: TOOLTIPS.easyPlus },
                { text: 'Rencontre Premium 6 mois', tooltip: TOOLTIPS.rencontrePremium },
                { text: 'Accès à TOUS les guides PDF pendant ton pack', tooltip: TOOLTIPS.guidePdf },
                { text: 'Groupe privé à vie', tooltip: TOOLTIPS.groupePrive },
              ]}
              price={449}
              badge="Best Value"
              highlighted
              ctaText="Choisir"
              ctaHref="/checkout/services?type=pack_ultime_long"
            />
            <ServiceCard
              name="Expatriation (+1 mois)"
              description="Installation longue durée"
              features={[
                { text: 'Itinéraire Conciergerie', tooltip: TOOLTIPS.itineraireConciergerie },
                { text: 'Buddy System complet', tooltip: TOOLTIPS.buddySystem },
                { text: 'Suivi WhatsApp illimité', tooltip: "Support WhatsApp sans limite de durée - idéal pour l'expatriation. On reste avec vous aussi longtemps que nécessaire" },
                { text: 'Easy+ 1 an', tooltip: TOOLTIPS.easyPlus },
                { text: 'Rencontre Premium 6 mois', tooltip: TOOLTIPS.rencontrePremium },
                { text: 'Tous les Guides PDF', tooltip: "Accès à l'intégralité de nos guides : Visa 2026, Coût de la vie, Destinations secrètes - valeur 50€ offerte" },
                { text: 'Groupe privé à vie', tooltip: TOOLTIPS.groupePrive },
              ]}
              price={549}
              ctaText="Choisir"
              ctaHref="/checkout/services?type=pack_ultime_expat"
            />
          </CardGrid>
        </div>
      </section>

      {/* Section 6 — Communauté & abonnements */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Communauté & abonnements"
            title="Restez connecté à la communauté"
            titleAccent="francophone"
            subtitle="Rejoignez les voyageurs et expatriés francophones qui vivent les Philippines au quotidien."
            columns={2}
          >
            {/* Rencontre Premium — subscription variant of the price-card pattern:
                same card chrome + bordered CTA, but keeps the multi-tier price
                table (monthly/quarterly/half-yearly) and its per-row units, which
                stand in for the payment mention. Icon retained for product identity. */}
            <div className="group relative flex h-full flex-col rounded-2xl border-[0.5px] border-border bg-card px-[26px] py-7 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] motion-reduce:hover:transform-none">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <HeartIcon />
                </span>
                <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-foreground">
                  Rencontre Premium
                </h3>
              </div>
              <p className="mt-3 text-[14px] leading-[1.6] text-muted-foreground">
                Rencontrez des personnes qui partagent votre passion pour les Philippines.
              </p>
              <ul className="mt-[18px] flex flex-1 flex-col gap-2.5 border-t-[0.5px] border-border pt-4">
                {rencontrePlans.map((p) => (
                  <li key={p.label} className="flex items-baseline justify-between text-[14px]">
                    <span className={p.best ? 'font-medium text-primary' : 'text-muted-foreground'}>
                      {p.label}
                    </span>
                    <span className={cn('font-bold tabular-nums', p.best ? 'text-primary' : 'text-foreground')}>
                      {p.price}
                      <span className="text-[12px] font-normal text-muted-foreground">{p.unit}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/rencontre-philippines/premium"
                className="mt-[22px] block rounded-lg border border-border bg-card px-[18px] py-[11px] text-center text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Découvrir
              </Link>
            </div>

            {/* Easy+ — highlighted subscription variant: pattern highlight chrome
                (1.5px primary border + primary badge) and solid-accent CTA. Keeps
                the monthly/annual tiers; per-row units are the payment mention. */}
            <div className="relative flex h-full flex-col rounded-2xl border-[1.5px] border-primary bg-card px-[26px] py-7 shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-200 hover:-translate-y-1 motion-reduce:hover:transform-none">
              <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
                VIP
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"
                  aria-hidden="true"
                >
                  <StarIcon />
                </span>
                <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-foreground">Easy+</h3>
              </div>
              <p className="mt-3 text-[14px] leading-[1.6] text-muted-foreground">
                Abonnement privilège : −20 % chez nos partenaires, support prioritaire et guides premium.
              </p>
              <ul className="mt-[18px] flex flex-1 flex-col gap-2.5 border-t-[0.5px] border-border pt-4">
                {easyPlusPlans.map((p) => (
                  <li key={p.label} className="flex items-baseline justify-between text-[14px]">
                    <span className={p.best ? 'font-medium text-primary' : 'text-muted-foreground'}>
                      {p.label}
                    </span>
                    <span className={cn('font-bold tabular-nums', p.best ? 'text-primary' : 'text-foreground')}>
                      {p.price}
                      <span className="text-[12px] font-normal text-muted-foreground">{p.unit}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/meilleurs-plans-aux-philippines"
                className="mt-[22px] block rounded-lg bg-accent px-[18px] py-[11px] text-center text-sm font-semibold text-accent-foreground shadow-[0_10px_15px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                En savoir plus
              </Link>
            </div>
          </CardGrid>
        </div>
      </section>

      {/* Section 7 — FAQ (visible + FAQPage schema, source unique serviceFAQs) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Tout est"
            titleAccent="clair ?"
            faqs={serviceFAQs}
            footnote="Paiement en 2 ou 3 fois sans frais pour les packs supérieurs à 200 € — écrivez-nous."
            withSchema
          />
        </div>
      </section>

      {/* CTA final — panneau signature (ancre #contact) */}
      <section id="contact" className="scroll-mt-32 bg-background py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl text-center text-white"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3B5BDB 100%)',
              padding: 'clamp(3rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 2rem)',
            }}
          >
            <span
              className="pointer-events-none absolute rounded-full"
              style={{
                width: '280px',
                height: '280px',
                top: '-110px',
                right: '-70px',
                border: '2px dashed rgba(255,255,255,0.12)',
              }}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute rounded-full"
              style={{
                width: '180px',
                height: '180px',
                bottom: '-56px',
                left: '-36px',
                border: '2px dashed rgba(255,255,255,0.12)',
              }}
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-3xl">
              <h2
                className="mb-5 font-bold text-white"
                style={{ fontSize: 'clamp(1.875rem, 4vw, 2.375rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
              >
                Prêt à préparer votre <span className="text-accent">aventure ?</span>
              </h2>
              <p
                className="mx-auto mb-8 max-w-xl text-[16px]"
                style={{ color: 'rgba(255,255,255,0.95)', lineHeight: 1.55 }}
              >
                Écrivez-nous pour trouver l&apos;offre qui colle à votre projet — voyage découverte,
                grand tour ou installation longue durée.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/itineraire-personnalise-pour-les-philippines"
                  className="group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Créer mon itinéraire
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <a
                  href="https://wa.me/639565628289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
