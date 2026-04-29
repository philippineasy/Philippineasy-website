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
  if (!supabase) return { title: 'Itinéraire — Philippineasy' };
  const itinerary = await getItineraryBySlug(supabase, slug);

  if (!itinerary) {
    return { title: 'Itinéraire non trouvé — Philippineasy' };
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

export default async function ItinerairePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createBuildClient();
  if (!supabase) notFound();
  const itinerary = await getItineraryBySlug(supabase, slug);

  if (!itinerary) notFound();

  const related = itinerary.related_destinations?.length
    ? await getRelatedItineraries(supabase, itinerary.related_destinations)
    : [];

  return (
    <>
      <ItineraryHero
        name={itinerary.name}
        recommendedDays={itinerary.recommended_days}
        budgetMidrange={itinerary.budget_midrange}
        heroImage={itinerary.hero_image}
        heroImageAlt={itinerary.hero_image_alt}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Breadcrumb destinationName={itinerary.name} />

        <article className="mt-8 space-y-12">
          <section>
            <p className="text-lg leading-relaxed text-slate-700">{itinerary.intro_text}</p>
          </section>

          {(itinerary.best_season || itinerary.how_to_get_there) && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">Infos pratiques</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {itinerary.best_season && (
                  <div>
                    <dt className="text-sm font-semibold text-slate-700">Meilleure saison</dt>
                    <dd className="mt-1 text-slate-600">{itinerary.best_season}</dd>
                  </div>
                )}
                {itinerary.how_to_get_there && (
                  <div>
                    <dt className="text-sm font-semibold text-slate-700">Comment y aller</dt>
                    <dd className="mt-1 text-slate-600">{itinerary.how_to_get_there}</dd>
                  </div>
                )}
                {itinerary.recommended_days && (
                  <div>
                    <dt className="text-sm font-semibold text-slate-700">Durée recommandée</dt>
                    <dd className="mt-1 text-slate-600">{itinerary.recommended_days} jours</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {itinerary.itinerary?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">Itinéraire jour par jour</h2>
              <div className="mt-5 space-y-4">
                {itinerary.itinerary.map((day) => (
                  <ItineraryDayCard key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}

          <BudgetTable
            budgetBackpacker={itinerary.budget_backpacker}
            budgetMidrange={itinerary.budget_midrange}
            budgetLuxury={itinerary.budget_luxury}
            recommendedDays={itinerary.recommended_days}
          />

          {itinerary.practical_tips?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">Conseils pratiques</h2>
              <ul className="mt-4 space-y-2">
                {itinerary.practical_tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 rounded-lg bg-blue-50 p-4 text-slate-800"
                  >
                    <span className="text-blue-600">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FAQSection faq={itinerary.faq} />

          <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white">
            <h2 className="text-2xl font-bold">
              Cet itinéraire ne vous convient pas parfaitement&nbsp;?
            </h2>
            <p className="mt-2 text-blue-100">
              Notre IA crée votre itinéraire {itinerary.name} sur-mesure selon vos envies, votre
              budget et votre durée. Prêt en 30 secondes, dès 9,99 €.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/itineraire-personnalise-pour-les-philippines"
                className="rounded-full bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Créer mon itinéraire avec l&apos;IA
              </Link>
              <Link
                href="/itineraires-philippines"
                className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Voir tous les itinéraires
              </Link>
            </div>
          </section>

          <RelatedItineraries related={related} />

          <section className="border-t border-slate-200 pt-8 text-sm text-slate-600">
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Ressources complémentaires
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/voyager-aux-philippines"
                  className="text-blue-600 hover:underline"
                >
                  Guide complet pour voyager aux Philippines
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/quand-partir"
                  className="text-blue-600 hover:underline"
                >
                  Quand partir aux Philippines
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/budget"
                  className="text-blue-600 hover:underline"
                >
                  Budget détaillé Philippines
                </Link>
              </li>
              <li>
                <Link
                  href="/voyager-aux-philippines/conseils-voyage"
                  className="text-blue-600 hover:underline"
                >
                  Conseils voyage Philippines
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
