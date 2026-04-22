'use client';

import Image from 'next/image';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import {
  palawanActivities,
  cebuActivities,
  siargaoActivities,
} from '@/components/affiliate/klook-activities-data';
import type { Article } from '@/types';

interface BestDealsSectionProps {
  /** @deprecated kept for back-compat with page.tsx — not rendered after step 7 refactor */
  initialDeals?: Article[];
}

type FeaturedDeal = {
  title: string;
  location: string;
  image: string;
  imageAlt?: string;
  placeholder?: 'whaleshark';
  rating: number;
  reviews: string;
  priceFrom: number;
  url: string;
  tag: string;
  tagClass: 'amber' | 'emerald' | 'blue';
};

const palawanHero = palawanActivities[0];
const cebuHero = cebuActivities[0];
const siargaoHero = siargaoActivities[0];

const featuredDeals: FeaturedDeal[] = [
  {
    title: palawanHero?.title ?? 'Island Hopping El Nido — Tour A',
    location: 'Palawan · El Nido',
    image: '/images/palawan/vue-aerienne-coron.webp',
    imageAlt:
      'Vue aérienne de Coron, lagons turquoise et îles karstiques',
    rating: palawanHero?.rating ?? 4.8,
    reviews: palawanHero?.reviews ?? '3 200+ avis',
    priceFrom: palawanHero?.priceFrom ?? 20,
    url: palawanHero?.url ?? '/meilleurs-plans-aux-philippines',
    tag: 'Adventure',
    tagClass: 'amber',
  },
  {
    title: cebuHero?.title ?? 'Nage avec les requins-baleines',
    location: 'Cebu · Oslob',
    image: '',
    placeholder: 'whaleshark',
    rating: cebuHero?.rating ?? 4.7,
    reviews: cebuHero?.reviews ?? '4 500+ avis',
    priceFrom: cebuHero?.priceFrom ?? 55,
    url: cebuHero?.url ?? '/meilleurs-plans-aux-philippines',
    tag: 'Nature',
    tagClass: 'emerald',
  },
  {
    title: siargaoHero?.title ?? 'Cours de surf à Cloud 9',
    location: 'Siargao · General Luna',
    image: '/images/siargao/surf-a-siargao.webp',
    imageAlt:
      'Surfeur sur une vague à Siargao avec cocotiers en arrière-plan',
    rating: siargaoHero?.rating ?? 4.8,
    reviews: siargaoHero?.reviews ?? '500+ avis',
    priceFrom: siargaoHero?.priceFrom ?? 28,
    url: siargaoHero?.url ?? '/meilleurs-plans-aux-philippines',
    tag: 'Surf',
    tagClass: 'blue',
  },
];

const tagStyles: Record<FeaturedDeal['tagClass'], { bg: string; color: string }> = {
  amber: { bg: '#FEF3C7', color: '#854D0E' },
  emerald: { bg: '#D1FAE5', color: '#065F46' },
  blue: { bg: '#DBEAFE', color: '#1E40AF' },
};

const PinIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// TODO: remplacer par photo Supabase quand disponible (Cebu Oslob whaleshark)
const WhalesharkPlaceholder = () => (
  <svg
    viewBox="0 0 400 220"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration océan profond avec silhouette de requin-baleine"
  >
    <defs>
      <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="60%" stopColor="#075985" />
        <stop offset="100%" stopColor="#082f49" />
      </linearGradient>
      <radialGradient id="lightShaft" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="220" fill="url(#oceanBg)" />
    {/* Light shafts from surface */}
    <rect width="400" height="220" fill="url(#lightShaft)" />
    {/* Whaleshark silhouette */}
    <g fill="#0c4a6e" opacity="0.85">
      <ellipse cx="220" cy="130" rx="120" ry="32" />
      <path d="M 100 130 L 140 110 L 145 130 L 140 150 Z" />
      <ellipse cx="290" cy="115" rx="14" ry="8" />
      <path d="M 320 130 Q 340 100, 350 110 Q 345 130, 320 130 Z" />
      <path d="M 320 130 Q 340 160, 350 150 Q 345 130, 320 130 Z" />
    </g>
    {/* White spots characteristic of whalesharks */}
    <g fill="#ffffff" opacity="0.4">
      <circle cx="200" cy="125" r="3" />
      <circle cx="220" cy="118" r="2.5" />
      <circle cx="240" cy="128" r="3" />
      <circle cx="260" cy="122" r="2.5" />
      <circle cx="190" cy="138" r="2" />
      <circle cx="215" cy="142" r="2.5" />
      <circle cx="245" cy="138" r="2" />
      <circle cx="275" cy="125" r="2" />
    </g>
    {/* Bubbles */}
    <g fill="#ffffff" opacity="0.5">
      <circle cx="60" cy="80" r="3" />
      <circle cx="80" cy="60" r="2" />
      <circle cx="55" cy="50" r="2.5" />
      <circle cx="350" cy="170" r="2.5" />
      <circle cx="365" cy="190" r="2" />
    </g>
  </svg>
);

export const BestDealsSection = (_props: BestDealsSectionProps) => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Partenariat Klook · GetYourGuide
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3 mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Nos meilleurs <span className="text-accent">bons plans</span>
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6]">
            Les activités et expériences sélectionnées par notre équipe locale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px] max-w-6xl mx-auto">
          {featuredDeals.map((deal) => {
            const tagStyle = tagStyles[deal.tagClass];
            return (
              <article
                key={deal.title}
                className="group flex flex-col bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none"
              >
                <div className="relative w-full h-[180px] overflow-hidden">
                  {deal.placeholder === 'whaleshark' ? (
                    <WhalesharkPlaceholder />
                  ) : (
                    <Image
                      src={deal.image}
                      alt={deal.imageAlt || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    />
                  )}
                  {/* Tag badge top-left */}
                  <span
                    className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold"
                    style={{
                      backgroundColor: tagStyle.bg,
                      color: tagStyle.color,
                    }}
                  >
                    {deal.tag}
                  </span>
                  {/* Price overlay bottom-right */}
                  <span
                    className="absolute bottom-3 right-3 inline-flex items-center px-3 py-1.5 rounded bg-card text-accent text-[13px] font-bold shadow-md"
                  >
                    dès&nbsp;{deal.priceFrom}&nbsp;€
                  </span>
                </div>

                <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground uppercase font-medium mb-2 tracking-[0.04em]">
                    <PinIcon />
                    {deal.location}
                  </div>
                  <h3
                    className="text-[16px] font-semibold text-foreground mb-2.5 leading-[1.35]"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {deal.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className="text-accent font-bold text-[14px]"
                      aria-label={`Note ${deal.rating} sur 5`}
                    >
                      ★ {deal.rating}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      ({deal.reviews})
                    </span>
                  </div>
                  <a
                    href={deal.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Réserver
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Klook affiliate carousel — kept for revenue value (not in proto) */}
        <div className="max-w-6xl mx-auto mt-20">
          <KlookCarousel
            activities={[
              palawanActivities[1],
              cebuActivities[1],
              siargaoActivities[1],
              palawanActivities[2],
              cebuActivities[2],
              siargaoActivities[2],
            ].filter(Boolean)}
            destination="homepage"
            title="Plus d'activités à réserver aux Philippines"
            subtitle="Notre sélection complète d'expériences à Palawan, Cebu et Siargao."
          />
        </div>
      </div>
    </section>
  );
};
