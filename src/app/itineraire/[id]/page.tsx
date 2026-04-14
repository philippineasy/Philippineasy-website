'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
  faEdit,
  faInfinity,
  faClock,
  faMapMarkerAlt,
  faPencil,
  faLock,
  faLightbulb,
  faUtensils,
  faBed,
  faBus,
  faSun,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { MapPin, Clock, ExternalLink, Utensils, Hotel, Bus, Pencil, Lock, Lightbulb, Download } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PlacePhoto } from '@/components/itinerary/PlacePhoto';
import dynamic from 'next/dynamic';

const ItineraryMap = dynamic(() => import('@/components/itinerary/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-muted flex items-center justify-center border border-border">
      <div className="text-muted-foreground">Chargement de la carte...</div>
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
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-muted-foreground">Chargement de l&apos;itineraire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 max-w-2xl">
        <div className="bg-card p-8 rounded-2xl border border-destructive/20 shadow-lg text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-destructive text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-destructive mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild><Link href="/profil"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Retour au profil</Link></Button>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;
  const { selected_variant } = itinerary;

  return (
    <div className="min-h-screen bg-muted">
      {/* Sticky header */}
      <div className="backdrop-blur-md bg-card/90 border-b border-border sticky top-32 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/profil" className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all">
                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
              </Link>
              <div className="h-5 w-px bg-border" />
              <h1 className="font-bold text-base text-foreground truncate max-w-[200px] sm:max-w-none">
                {selected_variant?.title || 'Mon Itineraire'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/itinerary/pdf/${itinerary.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">PDF</span>
              </a>
              <div className="px-3 py-1.5 flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full text-xs">
                <Pencil className="w-3 h-3 text-primary" />
                <span className="text-foreground/70">
                  {isUnlimited ? (
                    <>Modif. illimitees</>
                  ) : (
                    <><span className="font-bold text-primary">{itinerary.modifications_remaining}</span> modif.</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome banner after checkout */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-green-800">Votre itineraire est pret !</p>
              <p className="text-sm text-green-600">Bon voyage aux Philippines.</p>
            </div>
            <button onClick={() => setShowWelcome(false)} className="ml-auto text-green-400 hover:text-green-600 text-lg">&times;</button>
          </motion.div>
        )}

        {/* Description */}
        {selected_variant?.description && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{selected_variant.description}</p>
        )}

        {/* Map */}
        {mapPoints.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Votre parcours</h2>
              <span className="text-xs text-muted-foreground">{mapPoints.length} etapes</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <ItineraryMap points={mapPoints} selectedPointId={selectedPointId} onPointClick={handlePointClick} />
            </div>
          </div>
        )}

        {/* Day-by-day */}
        <h2 className="text-lg font-bold text-foreground mb-6">Programme jour par jour</h2>

        {selected_variant?.days && selected_variant.days.length > 0 ? (
          <Accordion type="multiple" defaultValue={['day-1']}>
            {selected_variant.days.map((day) => (
              <AccordionItem
                key={day.day}
                value={`day-${day.day}`}
                className="bg-card rounded-2xl mb-4 overflow-hidden border border-border shadow-sm data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 [&>svg]:text-muted-foreground [&>svg]:w-5 [&>svg]:h-5">
                  <div className="flex items-center gap-4">
                    {/* Day photo or number */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      {day.activities?.[0]?.coordinates ? (
                        <PlacePhoto
                          coordinates={day.activities[0].coordinates}
                          name={day.location || day.activities[0].name}
                          className="w-14 h-14 rounded-xl"
                          fallbackIcon={
                            <div className="w-14 h-14 bg-primary text-primary-foreground rounded-xl flex flex-col items-center justify-center">
                              <span className="text-[10px] uppercase font-medium opacity-70">Jour</span>
                              <span className="text-xl font-bold leading-none">{day.day}</span>
                            </div>
                          }
                        />
                      ) : (
                        <div className="w-14 h-14 bg-primary text-primary-foreground rounded-xl flex flex-col items-center justify-center">
                          <span className="text-[10px] uppercase font-medium opacity-70">Jour</span>
                          <span className="text-xl font-bold leading-none">{day.day}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground text-base">{day.location || `Jour ${day.day}`}</p>
                      {day.title && day.title !== 'description' && day.title !== 'jours' && (
                        <p className="text-sm text-muted-foreground">{day.title}</p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pt-2 pb-6">
                  {/* Transport */}
                  {day.transport?.method && (
                    <div id={`day-${day.day}-transport`} className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bus className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{day.transport.method}</p>
                        {day.transport.from && day.transport.to && (
                          <p className="text-sm text-muted-foreground">{day.transport.from} → {day.transport.to}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {day.transport.duration && <span className="text-xs bg-card border border-border px-2 py-0.5 rounded-md">⏱ {day.transport.duration}</span>}
                          {day.transport.cost && <span className="text-xs bg-card border border-border px-2 py-0.5 rounded-md">💰 {day.transport.cost}</span>}
                        </div>
                        {day.transport.coordinates && (
                          <a href={`https://maps.google.com/?q=${day.transport.coordinates.lat},${day.transport.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline">
                            <MapPin className="w-3 h-3" /> Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Activites</p>
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <motion.div
                            key={actIndex}
                            id={`day-${day.day}-act-${actIndex}`}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: actIndex * 0.05, duration: 0.3 }}
                            className={`flex gap-4 p-3 rounded-xl border transition-all ${
                              selectedPointId === `day-${day.day}-act-${actIndex}`
                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                                : 'border-border hover:border-border/80 hover:shadow-md bg-card'
                            }`}
                          >
                            {/* Activity photo */}
                            <PlacePhoto
                              coordinates={activity.coordinates}
                              name={activity.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0"
                              fallbackIcon={
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex items-center justify-center">
                                  <MapPin className="w-5 h-5 text-muted-foreground/30" />
                                </div>
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  {activity.time && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                      <Clock className="w-3 h-3" /> {activity.time}
                                    </p>
                                  )}
                                  <h4 className="font-semibold text-foreground text-sm leading-tight">{activity.name}</h4>
                                  {activity.description && activity.description !== activity.name && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                                  )}
                                </div>
                                {canModify && (
                                  <button
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors flex-shrink-0"
                                    onClick={() => alert('Fonctionnalite de modification a venir')}
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span className="hidden sm:inline">Modifier</span>
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                {activity.google_rating && (
                                  <span className="text-xs text-accent font-semibold">{activity.google_rating.toFixed(1)}/5</span>
                                )}
                                {(activity.google_maps_url || activity.coordinates) && (
                                  <a href={activity.google_maps_url || `https://maps.google.com/?q=${activity.coordinates!.lat},${activity.coordinates!.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                                    <ExternalLink className="w-3 h-3" /> Google Maps
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meals */}
                  {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Restaurants</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {([
                          { key: 'breakfast', data: day.meals?.breakfast, label: 'Petit-dej.' },
                          { key: 'lunch', data: day.meals?.lunch, label: 'Dejeuner' },
                          { key: 'dinner', data: day.meals?.dinner, label: 'Diner' },
                        ] as const).map(({ key, data, label }) => data?.restaurant && (
                          <div
                            key={key}
                            id={`day-${day.day}-${key}`}
                            className={`bg-card rounded-xl border overflow-hidden transition-all ${
                              selectedPointId === `day-${day.day}-${key}`
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-border hover:shadow-md'
                            }`}
                          >
                            <PlacePhoto
                              coordinates={data.coordinates}
                              name={data.restaurant}
                              className="w-full h-24"
                              fallbackIcon={
                                <div className="w-full h-24 bg-muted flex items-center justify-center">
                                  <Utensils className="w-5 h-5 text-muted-foreground/20" />
                                </div>
                              }
                            />
                            <div className="p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                              <p className="font-semibold text-foreground text-sm">{data.restaurant}</p>
                              {data.dish && <p className="text-xs text-muted-foreground mt-0.5">{data.dish}</p>}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  {data.cost && <span className="text-xs font-semibold text-primary">{data.cost}</span>}
                                  {data.google_rating && <span className="text-xs text-accent font-semibold">{data.google_rating.toFixed(1)}/5</span>}
                                </div>
                                {(data.google_maps_url || data.coordinates) && (
                                  <a href={data.google_maps_url || `https://maps.google.com/?q=${data.coordinates!.lat},${data.coordinates!.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Maps</a>
                                )}
                              </div>
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
                      className={`rounded-xl border overflow-hidden transition-all ${
                        selectedPointId === `day-${day.day}-accommodation`
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <PlacePhoto
                          coordinates={day.accommodation.coordinates}
                          name={day.accommodation.name}
                          className="w-full sm:w-40 h-32 sm:h-auto"
                          fallbackIcon={
                            <div className="w-full sm:w-40 h-32 bg-muted flex items-center justify-center">
                              <Hotel className="w-6 h-6 text-muted-foreground/20" />
                            </div>
                          }
                        />
                        <div className="p-4 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Hebergement</p>
                          <p className="font-bold text-foreground">{day.accommodation.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {day.accommodation.type && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{day.accommodation.type}</span>
                            )}
                            {day.accommodation.cost && (
                              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-md text-primary font-medium">{day.accommodation.cost}</span>
                            )}
                            {day.accommodation.google_rating && (
                              <span className="text-xs bg-accent/10 px-2 py-0.5 rounded-md text-accent font-semibold">{day.accommodation.google_rating.toFixed(1)}/5</span>
                            )}
                          </div>
                          {(day.accommodation.google_maps_url || day.accommodation.coordinates) && (
                            <a href={day.accommodation.google_maps_url || `https://maps.google.com/?q=${day.accommodation.coordinates!.lat},${day.accommodation.coordinates!.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary font-medium hover:underline">
                              <ExternalLink className="w-3 h-3" /> Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty */}
                  {!day.activities?.length && !day.meals?.breakfast && !day.meals?.lunch && !day.meals?.dinner && !day.accommodation?.name && !day.transport?.method && (
                    <p className="text-muted-foreground italic text-center py-4">Aucune activite prevue pour ce jour</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-muted-foreground">Aucun jour planifie.</div>
        )}

        {/* Tips */}
        {selected_variant?.tips && selected_variant.tips.length > 0 && (
          <div className="mt-10 bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              Conseils pour votre voyage
            </h3>
            <ul className="space-y-3">
              {selected_variant.tips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">{i + 1}</span>
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upgrade CTA */}
        {!canModify && itinerary.offer_type === 'express' && (
          <div className="mt-8 bg-card rounded-2xl border border-border shadow-sm p-6 text-center">
            <h3 className="font-bold text-foreground mb-2">Envie de personnaliser votre itineraire ?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Passez en Premium ou Conciergerie pour beneficier de modifications.
            </p>
            <Button asChild size="lg">
              <Link href="/itineraire-personnalise-pour-les-philippines">
                Voir les offres <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
