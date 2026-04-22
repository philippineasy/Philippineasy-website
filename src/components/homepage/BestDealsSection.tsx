'use client';

import Image from 'next/image';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import {
  palawanActivities,
  cebuActivities,
  siargaoActivities,
} from '@/components/affiliate/klook-activities-data';
import type { KlookActivity } from '@/components/affiliate/klook-activities-data';
import type { Article } from '@/types';

interface BestDealsSectionProps {
  /** @deprecated kept for back-compat with page.tsx — not rendered after step 7 refactor */
  initialDeals?: Article[];
}

type FeaturedDeal = {
  source: KlookActivity;
  location: string;
  tag: string;
  tagClass: 'amber' | 'emerald' | 'blue';
};

const featuredDeals: FeaturedDeal[] = [
  {
    source: palawanActivities[0],
    location: 'Palawan · El Nido',
    tag: 'Adventure',
    tagClass: 'amber',
  },
  {
    source: cebuActivities[0],
    location: 'Cebu · Oslob',
    tag: 'Nature',
    tagClass: 'emerald',
  },
  {
    source: siargaoActivities[0],
    location: 'Siargao · General Luna',
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
            const { source } = deal;
            return (
              <article
                key={source.id}
                className="group flex flex-col bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none"
              >
                <div className="relative w-full h-[180px] overflow-hidden">
                  <Image
                    src={source.image}
                    alt={source.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  />
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
                    dès&nbsp;{source.priceFrom}&nbsp;€
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
                    {source.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className="text-accent font-bold text-[14px]"
                      aria-label={`Note ${source.rating} sur 5`}
                    >
                      ★ {source.rating}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      ({source.reviews})
                    </span>
                  </div>
                  <a
                    href={source.url}
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
