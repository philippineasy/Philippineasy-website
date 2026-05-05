'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { trackCtaClicked } from '@/lib/analytics';
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

type TagClass = 'amber' | 'emerald' | 'blue';

type Deal = {
  source: KlookActivity;
  location: string;
  tag: string;
  tagClass: TagClass;
};

const tagStyles: Record<TagClass, { bg: string; color: string }> = {
  amber: { bg: '#FEF3C7', color: '#854D0E' },
  emerald: { bg: '#D1FAE5', color: '#065F46' },
  blue: { bg: '#DBEAFE', color: '#1E40AF' },
};

// All Klook activities, mapped to editorial tags by destination
const allDeals: Deal[] = [
  ...palawanActivities.map((a) => ({
    source: a,
    location: 'Palawan',
    tag: 'Adventure',
    tagClass: 'amber' as TagClass,
  })),
  ...cebuActivities.map((a) => ({
    source: a,
    location: 'Cebu & Visayas',
    tag: 'Nature',
    tagClass: 'emerald' as TagClass,
  })),
  ...siargaoActivities.map((a) => ({
    source: a,
    location: 'Siargao',
    tag: 'Surf',
    tagClass: 'blue' as TagClass,
  })),
].filter((d) => Boolean(d.source));

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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 4500,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleClick = (deal: Deal) => {
    trackCtaClicked({
      cta_text: `klook_${deal.source.id}`,
      cta_location: 'best_deals_homepage',
      destination_url: deal.source.url,
    });
  };

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header — centered */}
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Partenariat Klook · GetYourGuide
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3 mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Nos meilleurs <span className="text-accent-strong">bons plans</span>
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6]">
            Les activités et expériences sélectionnées par notre équipe locale.
          </p>
        </div>

        {/* Embla viewport */}
        <div
          className="overflow-hidden max-w-6xl mx-auto"
          ref={emblaRef}
          aria-roledescription="carousel"
          aria-label="Activités à réserver aux Philippines"
        >
          <div className="flex -mx-[11px]">
            {allDeals.map((deal) => {
              const tagStyle = tagStyles[deal.tagClass];
              const { source } = deal;
              return (
                <div
                  key={source.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-[11px]"
                >
                  <article className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none">
                    <div className="relative w-full h-[180px] overflow-hidden">
                      <Image
                        src={source.image}
                        alt={source.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
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
                      <span className="absolute bottom-3 right-3 inline-flex items-center px-3 py-1.5 rounded bg-card text-accent-strong text-[13px] font-bold shadow-md">
                        dès&nbsp;{source.priceFrom}&nbsp;€
                      </span>
                    </div>

                    <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground uppercase font-medium mb-2 tracking-[0.04em]">
                        <PinIcon />
                        {deal.location}
                      </div>
                      <h3
                        className="text-[16px] font-semibold text-foreground mb-2.5 leading-[1.35] line-clamp-2"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {source.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span
                          className="text-accent-strong font-bold text-[14px]"
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
                        onClick={() => handleClick(deal)}
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Nav controls — arrows + dots, all centered */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={scrollPrev}
            aria-label="Activité précédente"
            className="w-11 h-11 rounded-full border-[0.5px] border-border bg-card hover:bg-muted hover:border-primary/40 transition-colors duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-foreground text-[13px]" />
          </button>

          <div className="flex gap-1" role="tablist" aria-label="Pagination du carrousel">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Aller à l'activité ${i + 1}`}
                role="tab"
                aria-selected={i === selectedIndex}
                className="group h-11 inline-flex items-center justify-center px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === selectedIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/40 group-hover:bg-muted-foreground/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Activité suivante"
            className="w-11 h-11 rounded-full border-[0.5px] border-border bg-card hover:bg-muted hover:border-primary/40 transition-colors duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-foreground text-[13px]" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Liens d&apos;affiliation — aucun coût supplémentaire pour vous.{' '}
          <Link href="/partenaires" className="underline hover:text-foreground transition-colors">
            En savoir plus
          </Link>
        </p>
      </div>
    </section>
  );
};
