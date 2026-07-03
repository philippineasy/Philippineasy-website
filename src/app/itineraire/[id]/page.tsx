'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, ArrowRight, Download, Pencil, MapPin,
  Lightbulb, Loader2, AlertTriangle, Star, Bus, Hotel,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PlacePhoto } from '@/components/itinerary/PlacePhoto';
import {
  DURATION_LABELS, OFFER_LABELS,
  type Duration, type OfferType,
} from '@/config/itinerary-pricing';

const ItineraryMap = dynamic(() => import('@/components/itinerary/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[320px] bg-muted flex items-center justify-center">
      <span className="text-[13px] text-muted-foreground">Chargement de la carte…</span>
    </div>
  ),
});

// Types
interface Coordinates { lat: number; lng: number; }
interface Activity { time?: string; name: string; description?: string; cost?: string; coordinates?: Coordinates; google_maps_url?: string; google_rating?: number; }
interface Meal { restaurant?: string; dish?: string; cost?: string; coordinates?: Coordinates; google_maps_url?: string; google_rating?: number; }
interface Accommodation { name?: string; type?: string; cost?: string; coordinates?: Coordinates; google_maps_url?: string; google_rating?: number; }
interface Transport { method?: string; duration?: string; cost?: string; times?: string; from?: string; to?: string; coordinates?: Coordinates; }

interface Day {
  day: number;
  title?: string;
  location?: string;
  activities?: Activity[];
  meals?: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; };
  accommodation?: Accommodation;
  transport?: Transport;
}

interface SelectedVariant { name: string; title: string; description: string; days: Day[]; tips: string[]; total_budget: string; }

interface Itinerary {
  id: string; user_id: string; preferences?: { duration?: string; travelType?: string; };
  offer_type: string; modifications_remaining: number; payment_status: string;
  created_at: string; delivered_at?: string; selected_variant: SelectedVariant;
}

interface MapPoint { id: string; name: string; type: 'attraction' | 'restaurant' | 'accommodation' | 'activity' | 'beach'; coordinates: { lat: number; lng: number }; day: number; period: string; }
interface PageProps { params: Promise<{ id: string }>; }

// Variant identity — pill tones declined for dark like the existing patterns.
const VARIANT_LABEL: Record<string, string> = {
  relax: 'Relax',
  balanced: 'Équilibré',
  adventure: 'Aventure',
};
const VARIANT_TONE: Record<string, string> = {
  relax: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  balanced: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  adventure: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
};
const VARIANT_TONE_FALLBACK = 'bg-primary/10 text-primary';

function mapsUrl(item: { google_maps_url?: string; coordinates?: Coordinates }): string | null {
  if (item.google_maps_url) return item.google_maps_url;
  if (item.coordinates) return `https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`;
  return null;
}

// Accent the last word of the title (AA-safe accent token).
function TitleWithAccent({ text }: { text: string }) {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= 1) return <span className="text-accent-strong">{text}</span>;
  const last = parts.pop();
  return <>{parts.join(' ')} <span className="text-accent-strong">{last}</span></>;
}

export default function ItineraryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome banner if coming from checkout
  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/itinerary/${resolvedParams.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erreur lors du chargement');
        setItinerary(data.itinerary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      if (!user) router.push('/connexion');
      else fetchItinerary();
    }
  }, [user, authLoading, resolvedParams.id, router]);

  const mapPoints: MapPoint[] = itinerary?.selected_variant?.days?.flatMap((day) => {
    const points: MapPoint[] = [];
    day.activities?.forEach((activity, actIndex) => {
      if (activity.coordinates) points.push({ id: `day-${day.day}-act-${actIndex}`, name: activity.name, type: 'activity', coordinates: activity.coordinates, day: day.day, period: activity.time || `Activite ${actIndex + 1}` });
    });
    if (day.meals?.breakfast?.coordinates) points.push({ id: `day-${day.day}-breakfast`, name: day.meals.breakfast.restaurant || 'Petit-dejeuner', type: 'restaurant', coordinates: day.meals.breakfast.coordinates, day: day.day, period: 'Petit-dejeuner' });
    if (day.meals?.lunch?.coordinates) points.push({ id: `day-${day.day}-lunch`, name: day.meals.lunch.restaurant || 'Dejeuner', type: 'restaurant', coordinates: day.meals.lunch.coordinates, day: day.day, period: 'Dejeuner' });
    if (day.meals?.dinner?.coordinates) points.push({ id: `day-${day.day}-dinner`, name: day.meals.dinner.restaurant || 'Diner', type: 'restaurant', coordinates: day.meals.dinner.coordinates, day: day.day, period: 'Diner' });
    if (day.accommodation?.coordinates) points.push({ id: `day-${day.day}-accommodation`, name: day.accommodation.name || 'Hebergement', type: 'accommodation', coordinates: day.accommodation.coordinates, day: day.day, period: 'Hebergement' });
    return points;
  }) || [];

  const handlePointClick = useCallback((pointId: string) => {
    setSelectedPointId(pointId);
    document.getElementById(pointId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const isUnlimited = itinerary?.offer_type === 'conciergerie' && itinerary?.modifications_remaining === -1;
  const canModify = isUnlimited || (itinerary?.modifications_remaining ?? 0) > 0;

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] pt-32">
        <Loader2 className="w-9 h-9 animate-spin text-primary mb-4" />
        <p className="text-[14px] text-muted-foreground">Chargement de l&apos;itinéraire…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 max-w-lg">
        <div className="bg-card p-8 rounded-2xl border border-destructive/20 shadow-card text-center">
          <span className="inline-flex w-14 h-14 rounded-full bg-destructive/10 items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </span>
          <h1 className="text-lg font-bold text-ink mb-2">Une erreur est survenue</h1>
          <p className="text-[14px] text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/mon-espace/itineraires">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à mes itinéraires
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;
  const { selected_variant } = itinerary;

  // Real header meta
  const variantKey = selected_variant?.name || 'balanced';
  const variantLabel = VARIANT_LABEL[variantKey] || (variantKey.charAt(0).toUpperCase() + variantKey.slice(1));
  const variantTone = VARIANT_TONE[variantKey] || VARIANT_TONE_FALLBACK;

  const duration = itinerary.preferences?.duration as Duration | undefined;
  const durationLabel = duration ? DURATION_LABELS[duration] : null;
  const offerName = OFFER_LABELS[itinerary.offer_type as OfferType]?.name || itinerary.offer_type;
  const budget = selected_variant?.total_budget && selected_variant.total_budget !== 'N/A'
    ? selected_variant.total_budget : null;
  const metaLine = [
    durationLabel,
    offerName ? `Formule ${offerName}` : null,
    budget ? `Budget estimé ${budget}` : null,
  ].filter(Boolean).join(' · ');

  const days = selected_variant?.days || [];
  const title = selected_variant?.title || 'Mon itinéraire';

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sticky tool bar */}
      <div className="sticky top-32 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/mon-espace/itineraires"
              aria-label="Retour à mes itinéraires"
              className="inline-flex items-center justify-center w-[34px] h-[34px] shrink-0 rounded-[10px] bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="text-[15px] font-bold text-ink truncate">{title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/api/itinerary/pdf/${itinerary.id}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-foreground/80 hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Download className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Télécharger le PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-[12px]">
              <Pencil className="w-3 h-3 text-primary" aria-hidden="true" />
              {isUnlimited ? (
                <span className="font-medium text-foreground/80">Modifications illimitées</span>
              ) : (
                <span className="text-foreground/80">
                  <span className="font-bold text-primary">{itinerary.modifications_remaining}</span>
                  {' '}modification{itinerary.modifications_remaining > 1 ? 's' : ''} restante{itinerary.modifications_remaining > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[860px] px-4 sm:px-6 pb-16">
        {/* Welcome banner after checkout */}
        {showWelcome && (
          <div className="mt-6 animate-fade-in-up rounded-2xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.08)] px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🎉</span>
            <div className="min-w-0">
              <p className="font-semibold text-[hsl(var(--success))] text-[14px]">Votre itinéraire est prêt !</p>
              <p className="text-[13px] text-muted-foreground">Bon voyage aux Philippines.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              aria-label="Fermer la notification"
              className="ml-auto shrink-0 text-muted-foreground hover:text-foreground text-xl leading-none px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              &times;
            </button>
          </div>
        )}

        {/* Header */}
        <header className="pt-9 pb-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className={['inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em]', variantTone].join(' ')}>
              {variantLabel}
            </span>
            {metaLine && (
              <span className="text-[12.5px] text-muted-foreground">{metaLine}</span>
            )}
          </div>
          <h1 className="text-[clamp(1.625rem,4vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
            <TitleWithAccent text={title} />
          </h1>
          {selected_variant?.description && (
            <p className="mt-3 max-w-[620px] text-[16px] leading-[1.65] text-muted-foreground">
              {selected_variant.description}
            </p>
          )}
        </header>

        {/* Map — only when real interactive points exist */}
        {mapPoints.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-[17px] font-bold text-ink">Votre parcours</h2>
              <span className="text-[12px] text-muted-foreground tabular-nums">
                {days.length} jour{days.length > 1 ? 's' : ''} · {mapPoints.length} étape{mapPoints.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="rounded-[20px] overflow-hidden border border-border">
              <ItineraryMap points={mapPoints} selectedPointId={selectedPointId} onPointClick={handlePointClick} />
            </div>
          </section>
        )}

        {/* Day-by-day */}
        <section className="mt-10">
          <h2 className="text-[17px] font-bold text-ink mb-4">Programme jour par jour</h2>

          {days.length > 0 ? (
            <Accordion type="multiple" defaultValue={['day-1']} className="space-y-3.5">
              {days.map((day) => {
                const hasTitle = day.title && day.title !== 'description' && day.title !== 'jours';
                const transportParts = day.transport?.method
                  ? [
                      day.transport.method,
                      day.transport.from && day.transport.to ? `${day.transport.from} → ${day.transport.to}` : null,
                      day.transport.duration,
                      day.transport.cost,
                    ].filter(Boolean).join(' · ')
                  : null;
                const hasContent =
                  !!day.activities?.length || !!day.meals?.breakfast || !!day.meals?.lunch ||
                  !!day.meals?.dinner || !!day.accommodation?.name || !!day.transport?.method;

                return (
                  <AccordionItem
                    key={day.day}
                    value={`day-${day.day}`}
                    className="border border-border rounded-2xl bg-card shadow-card-rest overflow-hidden"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/40 [&>svg]:text-muted-foreground [&>svg]:w-5 [&>svg]:h-5">
                      <div className="flex flex-1 items-center gap-3.5 min-w-0 text-left">
                        <div className="w-[52px] h-[52px] shrink-0 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center">
                          <span className="text-[9px] font-semibold uppercase tracking-wide leading-none opacity-80">Jour</span>
                          <span className="text-[19px] font-bold leading-none mt-0.5 tabular-nums">{day.day}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-bold text-ink leading-tight truncate">
                            {day.location || `Jour ${day.day}`}
                          </p>
                          {hasTitle && (
                            <p className="text-[13px] text-muted-foreground truncate">{day.title}</p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 pt-1 pb-6">
                      {/* Transport */}
                      {transportParts && (
                        <div id={`day-${day.day}-transport`} className="mb-5 rounded-xl bg-soft-blue px-4 py-3">
                          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-primary mb-1">
                            <Bus className="w-3 h-3" aria-hidden="true" /> Transport
                          </p>
                          <p className="text-[13px] text-foreground/80 leading-snug">{transportParts}</p>
                          {mapsUrl(day.transport!) && (
                            <a
                              href={mapsUrl(day.transport!)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1.5 text-[12px] font-medium text-primary hover:underline"
                            >
                              <MapPin className="w-3 h-3" aria-hidden="true" /> Google Maps
                            </a>
                          )}
                        </div>
                      )}

                      {/* Activities */}
                      {day.activities && day.activities.length > 0 && (
                        <div className="mb-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 mb-2.5">Activités</p>
                          <div className="space-y-2.5">
                            {day.activities.map((activity, actIndex) => {
                              const pointId = `day-${day.day}-act-${actIndex}`;
                              const link = mapsUrl(activity);
                              const isSelected = selectedPointId === pointId;
                              return (
                                <div
                                  key={actIndex}
                                  id={pointId}
                                  className={[
                                    'flex gap-3 rounded-xl border p-3 transition-colors',
                                    isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border',
                                  ].join(' ')}
                                >
                                  <PlacePhoto
                                    coordinates={activity.coordinates}
                                    name={activity.name}
                                    className="w-16 h-16 rounded-xl shrink-0"
                                    fallbackIcon={<MapPin className="w-5 h-5 text-muted-foreground/30" aria-hidden="true" />}
                                  />
                                  <div className="w-[52px] shrink-0 pt-0.5 text-[12px] font-semibold text-muted-foreground tabular-nums">
                                    {activity.time || '—'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <h3 className="text-[14px] font-semibold text-ink leading-tight">{activity.name}</h3>
                                        {activity.description && activity.description !== activity.name && (
                                          <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">{activity.description}</p>
                                        )}
                                      </div>
                                      {canModify && (
                                        <button
                                          type="button"
                                          onClick={() => alert('Fonctionnalité de modification à venir')}
                                          aria-label={`Demander une modification pour ${activity.name}`}
                                          className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                          <Pencil className="w-3 h-3" aria-hidden="true" />
                                          <span className="hidden sm:inline">Modifier</span>
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-[12px]">
                                      {typeof activity.google_rating === 'number' && (
                                        <span className="inline-flex items-center gap-0.5 font-semibold text-accent-strong">
                                          <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                          {activity.google_rating.toFixed(1)}
                                        </span>
                                      )}
                                      {link && (
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                        >
                                          <MapPin className="w-3 h-3" aria-hidden="true" /> Google Maps
                                        </a>
                                      )}
                                      {activity.cost && (
                                        <span className="ml-auto text-muted-foreground tabular-nums">{activity.cost}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Meals */}
                      {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                        <div className="mb-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 mb-2.5">Restaurants</p>
                          <div className="grid gap-2.5 sm:grid-cols-3">
                            {([
                              { key: 'breakfast', data: day.meals?.breakfast, label: 'Petit-déj.' },
                              { key: 'lunch', data: day.meals?.lunch, label: 'Déjeuner' },
                              { key: 'dinner', data: day.meals?.dinner, label: 'Dîner' },
                            ] as const).map(({ key, data, label }) => data?.restaurant && (
                              <div
                                key={key}
                                id={`day-${day.day}-${key}`}
                                className={[
                                  'rounded-xl border p-3 transition-colors',
                                  selectedPointId === `day-${day.day}-${key}` ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                                ].join(' ')}
                              >
                                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/80 mb-1">{label}</p>
                                <p className="text-[13px] font-semibold text-ink leading-tight">{data.restaurant}</p>
                                {data.dish && <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{data.dish}</p>}
                                <div className="mt-2 flex items-center justify-between text-[12px]">
                                  <div className="flex items-center gap-2">
                                    {data.cost && <span className="font-semibold text-primary">{data.cost}</span>}
                                    {typeof data.google_rating === 'number' && (
                                      <span className="inline-flex items-center gap-0.5 font-semibold text-accent-strong">
                                        <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                        {data.google_rating.toFixed(1)}
                                      </span>
                                    )}
                                  </div>
                                  {mapsUrl(data) && (
                                    <a href={mapsUrl(data)!} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Maps</a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accommodation */}
                      {day.accommodation?.name && (
                        <div
                          id={`day-${day.day}-accommodation`}
                          className={[
                            'rounded-xl border bg-muted/40 px-4 py-3 flex items-start gap-3 transition-colors',
                            selectedPointId === `day-${day.day}-accommodation` ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                          ].join(' ')}
                        >
                          <PlacePhoto
                            coordinates={day.accommodation.coordinates}
                            name={day.accommodation.name}
                            className="w-16 h-16 rounded-xl shrink-0"
                            fallbackIcon={<Hotel className="w-5 h-5 text-muted-foreground/30" aria-hidden="true" />}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/80 mb-1">Hébergement</p>
                            <p className="text-[14px] font-semibold text-ink leading-tight">{day.accommodation.name}</p>
                            <p className="text-[12.5px] text-muted-foreground mt-0.5">
                              {[day.accommodation.type, day.accommodation.cost].filter(Boolean).join(' · ')}
                              {typeof day.accommodation.google_rating === 'number' && (
                                <>
                                  {(day.accommodation.type || day.accommodation.cost) ? ' · ' : ''}
                                  <span className="inline-flex items-center gap-0.5 font-semibold text-accent-strong align-baseline">
                                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                    {day.accommodation.google_rating.toFixed(1)}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          {mapsUrl(day.accommodation) && (
                            <a
                              href={mapsUrl(day.accommodation)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                            >
                              <MapPin className="w-3 h-3" aria-hidden="true" /> Google Maps
                            </a>
                          )}
                        </div>
                      )}

                      {!hasContent && (
                        <p className="text-[13px] text-muted-foreground italic text-center py-3">Aucune activité prévue pour ce jour.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-[13px] text-muted-foreground">Aucun jour planifié.</div>
          )}
        </section>

        {/* Tips */}
        {selected_variant?.tips && selected_variant.tips.length > 0 && (
          <section className="mt-8 rounded-2xl border border-border bg-card shadow-card-rest p-6">
            <h3 className="flex items-center gap-2 text-[16px] font-bold text-ink mb-4">
              <Lightbulb className="w-4 h-4 text-accent-strong" aria-hidden="true" />
              Conseils pour votre voyage
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {selected_variant.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/75">
                  <span className="shrink-0 w-3 h-[1.5px] bg-accent mt-[10px]" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Upgrade CTA (express, no modifications left) */}
        {!canModify && itinerary.offer_type === 'express' && (
          <section className="mt-6 rounded-2xl border border-border bg-card shadow-card-rest p-6 text-center">
            <h3 className="text-[16px] font-bold text-ink mb-2">Envie de personnaliser votre itinéraire ?</h3>
            <p className="text-[14px] text-muted-foreground mb-4 max-w-[46ch] mx-auto">
              Passez en Premium ou Conciergerie pour bénéficier de modifications.
            </p>
            <Button asChild size="lg">
              <Link href="/itineraire-personnalise-pour-les-philippines">
                Voir les offres <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
