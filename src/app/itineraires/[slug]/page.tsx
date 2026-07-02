import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createBuildClient } from '@/utils/supabase/build-client';
import {
  getAllPublishedSlugs,
  getItineraryBySlug,
  getRelatedItineraries,
} from '@/services/destinationItinerariesService';
import { ItineraryHero } from '@/components/destinations/ItineraryHero';
import { ItineraryDayCard } from '@/components/destinations/ItineraryDayCard';
import { BudgetTable } from '@/components/destinations/BudgetTable';
import { FAQSection } from '@/components/destinations/FAQSection';
import { RelatedItineraries } from '@/components/destinations/RelatedItineraries';
import { Breadcrumb } from '@/components/destinations/Breadcrumb';

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const slugs = await getAllPublishedSlugs(supabase);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createBuildClient();
  if (!supabase) return { title: 'Itinéraire' };
  const itinerary = await getItineraryBySlug(supabase, slug);

  if (!itinerary) {
    return { title: 'Itinéraire non trouvé' };
  }

  const url = `https://philippineasy.com/itineraire-${itinerary.slug}`;

  return {
    title: itinerary.meta_title,
    description: itinerary.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: itinerary.meta_title,
      description: itinerary.meta_description,
      url,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'article',
      images: itinerary.hero_image
        ? [{ url: itinerary.hero_image, alt: itinerary.hero_image_alt || itinerary.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: itinerary.meta_title,
      description: itinerary.meta_description,
      site: '@philippineasy',
    },
  };
}

// === Decoratif : grands chiffres "1 / 2 / 3" pour les infos pratiques (style HowItWorks home) ===
const PracticalCard = ({
  index,
  label,
  value,
  iconPath,
}: {
  index: number;
  label: string;
  value: string;
  iconPath: string;
}) => (
  <div className="relative bg-card rounded-2xl p-6 border-[0.5px] border-border shadow-card-rest hover:shadow-card transition-shadow duration-300">
    <div className="flex items-start justify-between mb-4">
      <span
        className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
        style={{ backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
      </span>
      <span
        className="text-[40px] font-bold tabular-nums leading-none select-none"
        style={{
          color: 'rgba(59, 91, 219, 0.10)',
          letterSpacing: '-0.04em',
        }}
        aria-hidden="true"
      >
        0{index}
      </span>
    </div>
    <span
      className="block text-[11px] font-bold uppercase mb-1.5 text-muted-foreground"
      style={{ letterSpacing: '0.10em' }}
    >
      {label}
    </span>
    <p
      className="text-[15px] text-ink leading-[1.5]"
      style={{ letterSpacing: '-0.005em' }}
    >
      {value}
    </p>
  </div>
);

// === CTA inline mid-page — version compacte du gradient bleu home ===
const InlineCTA = ({ destinationName }: { destinationName: string }) => (
  <div
    className="relative overflow-hidden rounded-2xl text-white px-6 sm:px-8 py-7 sm:py-8 my-2"
    style={{
      background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
    }}
  >
    <span
      className="absolute pointer-events-none rounded-full hidden sm:block"
      style={{
        width: '220px',
        height: '220px',
        top: '-90px',
        right: '-60px',
        border: '2px dashed rgba(255, 255, 255, 0.13)',
      }}
      aria-hidden="true"
    />
    <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
      <div className="flex-1">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase mb-2.5"
          style={{
            letterSpacing: '0.10em',
            color: 'rgba(255, 255, 255, 0.78)',
          }}
        >
          <span className="text-accent" aria-hidden="true">✦</span>
          Cet itinéraire vous inspire&nbsp;?
        </span>
        <h3
          className="font-semibold text-white mb-1.5"
          style={{
            fontSize: 'clamp(1.125rem, 2.4vw, 1.375rem)',
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          }}
        >
          Faites-le adapter à <span className="text-accent">votre voyage</span>
        </h3>
        <p
          className="text-[14px]"
          style={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.5 }}
        >
          Notre IA crée votre itinéraire {destinationName} sur-mesure selon
          votre durée, votre style et votre budget. Prêt en 30 secondes.
        </p>
      </div>
      <Link
        href="/itineraire-personnalise-pour-les-philippines"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold text-[14px] shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary shrink-0"
      >
        Personnaliser
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  </div>
);

export default async function ItinerairePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createBuildClient();
  if (!supabase) notFound();
  const itinerary = await getItineraryBySlug(supabase, slug);

  if (!itinerary) notFound();

  const related = itinerary.related_destinations?.length
    ? await getRelatedItineraries(supabase, itinerary.related_destinations)
    : [];

  const days = itinerary.itinerary ?? [];
  // Insertion d'un CTA inline au milieu du parcours pour CRO (entre J3 et J4 si >= 5 jours)
  const insertCtaAfterDay =
    days.length >= 5 ? Math.floor(days.length / 2) : -1;

  return (
    <main className="bg-background">
      <ItineraryHero
        name={itinerary.name}
        recommendedDays={itinerary.recommended_days}
        budgetMidrange={itinerary.budget_midrange}
        bestSeason={itinerary.best_season}
        heroImage={itinerary.hero_image}
        heroImageAlt={itinerary.hero_image_alt}
      />

      {/* Breadcrumb compact, fond doux */}
      <div className="bg-soft-blue/40 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <Breadcrumb destinationName={itinerary.name} />
        </div>
      </div>

      {/* === Section 1 : Intro editoriale === */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span
            className="block text-[12px] font-bold uppercase text-primary mb-3"
            style={{ letterSpacing: '0.10em' }}
          >
            ✦ L&apos;essentiel
          </span>
          {/* Split intelligent en paragraphes pour eviter le mur de texte :
              prefere les double-newlines explicites, sinon decoupe naturellement
              tous les ~2 phrases (split sur ". " avec gestion des abreviations). */}
          {(() => {
            const text = itinerary.intro_text || '';
            // Si l'auteur a mis des \n\n explicites, on les respecte.
            const explicitParas = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
            let paragraphs: string[];
            if (explicitParas.length > 1) {
              paragraphs = explicitParas;
            } else {
              // Auto-split en regroupant 2 phrases par paragraphe (vise 3 paragraphes au total)
              const sentences = text.match(/[^.!?]+[.!?]+["»]?\s*/g) || [text];
              const targetParas = Math.min(4, Math.max(2, Math.ceil(sentences.length / 2)));
              const perPara = Math.ceil(sentences.length / targetParas);
              paragraphs = [];
              for (let i = 0; i < sentences.length; i += perPara) {
                paragraphs.push(sentences.slice(i, i + perPara).join('').trim());
              }
            }
            return paragraphs.map((para, i) => (
              <p
                key={i}
                className={`text-ink ${i > 0 ? 'mt-5' : ''}`}
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
                  lineHeight: 1.65,
                  letterSpacing: '-0.005em',
                }}
              >
                {para}
              </p>
            ));
          })()}
        </div>
      </section>

      {/* === Section 2 : Infos pratiques en 3 cards style HowItWorks === */}
      {(itinerary.best_season ||
        itinerary.how_to_get_there ||
        itinerary.recommended_days) && (
        <section className="py-14 md:py-18 bg-soft-blue">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span
                className="text-[12px] font-bold uppercase text-primary"
                style={{ letterSpacing: '0.10em' }}
              >
                ✦ Avant de partir
              </span>
              <h2
                className="text-ink font-semibold mt-3 mb-3"
                style={{
                  fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                Les infos pratiques en bref
              </h2>
              <p className="text-[15.5px] text-muted-foreground leading-[1.6]">
                Tout ce qu&apos;il faut savoir avant de boucler les valises
                pour {itinerary.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {itinerary.recommended_days && (
                <PracticalCard
                  index={1}
                  label="Durée recommandée"
                  value={`${itinerary.recommended_days} jour${itinerary.recommended_days > 1 ? 's' : ''} pour profiter sans courir`}
                  iconPath="M12 8v4l3 2M12 22a10 10 0 110-20 10 10 0 010 20z"
                />
              )}
              {itinerary.best_season && (
                <PracticalCard
                  index={itinerary.recommended_days ? 2 : 1}
                  label="Meilleure saison"
                  value={itinerary.best_season}
                  iconPath="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              )}
              {itinerary.how_to_get_there && (
                <PracticalCard
                  index={
                    [itinerary.recommended_days, itinerary.best_season].filter(
                      Boolean
                    ).length + 1
                  }
                  label="Comment y aller"
                  value={itinerary.how_to_get_there}
                  iconPath="M2 12l2 6h16l2-6M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4M9 4V2M15 4V2"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* === Section 3 : Itineraire jour par jour (cur du contenu) === */}
      {days.length > 0 && (
        <section
          id="itineraire-jour-par-jour"
          className="py-14 md:py-20 scroll-mt-24"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-10 max-w-2xl">
              <span
                className="text-[12px] font-bold uppercase text-primary"
                style={{ letterSpacing: '0.10em' }}
              >
                ✦ Le programme
              </span>
              <h2
                className="text-ink font-semibold mt-3 mb-3"
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Itinéraire jour par jour
              </h2>
              <p className="text-[16px] text-muted-foreground leading-[1.6]">
                {days.length} journée{days.length > 1 ? 's' : ''} préparée
                {days.length > 1 ? 's' : ''} avec horaires, transports et
                hébergements suggérés.
              </p>
            </div>

            <div className="space-y-6">
              {days.map((day, idx) => {
                const isLastDay = idx === days.length - 1;
                const showCtaAfter = idx === insertCtaAfterDay;
                return (
                  <div key={day.day}>
                    <ItineraryDayCard day={day} isLast={isLastDay && !showCtaAfter} />
                    {showCtaAfter && (
                      <div className="mt-6">
                        <InlineCTA destinationName={itinerary.name} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* === Section 4 : Budget === */}
      <section className="py-14 md:py-18 bg-soft-blue">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <BudgetTable
            budgetBackpacker={itinerary.budget_backpacker}
            budgetMidrange={itinerary.budget_midrange}
            budgetLuxury={itinerary.budget_luxury}
            recommendedDays={itinerary.recommended_days}
          />
        </div>
      </section>

      {/* === Section 5 : Conseils pratiques === */}
      {itinerary.practical_tips?.length > 0 && (
        <section className="py-14 md:py-18">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-7 max-w-2xl">
              <span
                className="text-[12px] font-bold uppercase text-primary"
                style={{ letterSpacing: '0.10em' }}
              >
                ✦ Bons à savoir
              </span>
              <h2
                className="text-ink font-semibold mt-3 mb-2"
                style={{
                  fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                Conseils terrain pour réussir votre séjour
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {itinerary.practical_tips.map((tip, idx) => (
                <li
                  key={idx}
                  className="relative flex gap-3.5 rounded-2xl p-4 sm:p-5 bg-card border-[0.5px] border-border shadow-card-rest hover:border-primary/30 transition-colors duration-200"
                >
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl text-accent"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.13)' }}
                    aria-hidden="true"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17a2 2 0 002 2h4a2 2 0 002-2v-2.3A7 7 0 0012 2z" />
                    </svg>
                  </span>
                  <span
                    className="text-[14.5px] text-ink"
                    style={{ lineHeight: 1.55, letterSpacing: '-0.005em' }}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* === Section 6 : FAQ === */}
      <section className="py-14 md:py-18 bg-soft-blue">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FAQSection faq={itinerary.faq} />
        </div>
      </section>

      {/* === Section 7 : CTA conversion finale (full block style ItineraireIABlock) === */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl text-white"
            style={{
              background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
            }}
          >
            <span
              className="absolute pointer-events-none rounded-full"
              style={{
                width: '320px',
                height: '320px',
                top: '-120px',
                right: '-80px',
                border: '2px dashed rgba(255, 255, 255, 0.13)',
              }}
              aria-hidden="true"
            />
            <span
              className="absolute pointer-events-none rounded-full"
              style={{
                width: '200px',
                height: '200px',
                bottom: '-60px',
                left: '-40px',
                border: '2px dashed rgba(255, 255, 255, 0.13)',
              }}
              aria-hidden="true"
            />

            <div className="relative max-w-2xl">
              <span
                className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase mb-4"
                style={{
                  letterSpacing: '0.10em',
                  color: 'rgba(255, 255, 255, 0.78)',
                }}
              >
                <span className="text-accent" aria-hidden="true">✦</span>
                Itinéraire personnalisé
              </span>
              <h2
                className="font-bold text-white mb-4"
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Cet itinéraire ne vous convient pas{' '}
                <span className="text-accent">parfaitement&nbsp;?</span>
              </h2>
              <p
                className="mb-7"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6,
                  fontSize: '16px',
                }}
              >
                Notre IA crée votre itinéraire {itinerary.name} sur-mesure
                selon vos envies, votre budget et votre durée. Une seule
                version, prête en 30 secondes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/itineraire-personnalise-pour-les-philippines"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold text-[15px] shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                  </svg>
                  Créer mon itinéraire avec l&apos;IA
                </Link>
                <Link
                  href="/itineraires-philippines"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-[14px] text-white backdrop-blur-md transition-all duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.10)',
                    border: '0.5px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  Voir tous les itinéraires
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Section 8 : Related === */}
      {related.length > 0 && (
        <section className="py-14 md:py-18 bg-soft-blue">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <RelatedItineraries related={related} />
          </div>
        </section>
      )}

      {/* === Section 9 : Ressources complementaires (footer link cluster, discret) === */}
      <section className="py-12 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="border-t border-border pt-8">
            <span
              className="block text-[11.5px] font-bold uppercase text-muted-foreground mb-4"
              style={{ letterSpacing: '0.10em' }}
            >
              Ressources complémentaires
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              <li>
                <Link
                  href="/voyager-aux-philippines"
                  className="inline-flex items-center gap-1.5 text-[14px] text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Guide complet pour voyager aux Philippines
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/quand-partir"
                  className="inline-flex items-center gap-1.5 text-[14px] text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Quand partir aux Philippines
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/budget"
                  className="inline-flex items-center gap-1.5 text-[14px] text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Budget détaillé Philippines
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/conseils-voyage"
                  className="inline-flex items-center gap-1.5 text-[14px] text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Conseils voyage Philippines
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
