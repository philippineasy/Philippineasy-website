'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
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
  faMoon,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { fadeInUp } from '@/components/itinerary/animations';
import dynamic from 'next/dynamic';

const ItineraryMap = dynamic(() => import('@/components/itinerary/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-muted flex items-center justify-center border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="text-muted-foreground">Chargement de la carte...</div>
    </div>
  ),
});

// Types
interface Coordinates {
  lat: number;
  lng: number;
}

interface Activity {
  time?: string;
  name: string;
  description?: string;
  coordinates?: Coordinates;
}

interface Meal {
  restaurant?: string;
  dish?: string;
  cost?: string;
  coordinates?: Coordinates;
}

interface Accommodation {
  name?: string;
  type?: string;
  cost?: string;
  coordinates?: Coordinates;
}

interface Transport {
  method?: string;
  duration?: string;
  cost?: string;
  times?: string;
  from?: string;
  to?: string;
  coordinates?: Coordinates;
}

interface Day {
  day: number;
  title?: string;
  location?: string;
  activities?: Activity[];
  meals?: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
  accommodation?: Accommodation;
  transport?: Transport;
}

interface SelectedVariant {
  name: string;
  title: string;
  description: string;
  days: Day[];
  tips: string[];
  total_budget: string;
}

interface Itinerary {
  id: string;
  user_id: string;
  preferences?: {
    duration?: string;
    travelType?: string;
  };
  offer_type: string;
  modifications_remaining: number;
  payment_status: string;
  created_at: string;
  delivered_at?: string;
  selected_variant: SelectedVariant;
}

interface MapPoint {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'accommodation' | 'activity' | 'beach';
  coordinates: { lat: number; lng: number };
  day: number;
  period: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ItineraryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/itinerary/${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement');
        }

        setItinerary(data.itinerary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push('/connexion');
      } else {
        fetchItinerary();
      }
    }
  }, [user, authLoading, resolvedParams.id, router]);

  const mapPoints: MapPoint[] = itinerary?.selected_variant?.days?.flatMap((day) => {
    const points: MapPoint[] = [];

    day.activities?.forEach((activity, actIndex) => {
      if (activity.coordinates) {
        points.push({
          id: `day-${day.day}-act-${actIndex}`,
          name: activity.name,
          type: 'activity',
          coordinates: activity.coordinates,
          day: day.day,
          period: activity.time || `Activite ${actIndex + 1}`,
        });
      }
    });

    if (day.meals?.breakfast?.coordinates) {
      points.push({ id: `day-${day.day}-breakfast`, name: day.meals.breakfast.restaurant || 'Petit-dejeuner', type: 'restaurant', coordinates: day.meals.breakfast.coordinates, day: day.day, period: 'Petit-dejeuner' });
    }
    if (day.meals?.lunch?.coordinates) {
      points.push({ id: `day-${day.day}-lunch`, name: day.meals.lunch.restaurant || 'Dejeuner', type: 'restaurant', coordinates: day.meals.lunch.coordinates, day: day.day, period: 'Dejeuner' });
    }
    if (day.meals?.dinner?.coordinates) {
      points.push({ id: `day-${day.day}-dinner`, name: day.meals.dinner.restaurant || 'Diner', type: 'restaurant', coordinates: day.meals.dinner.coordinates, day: day.day, period: 'Diner' });
    }

    if (day.accommodation?.coordinates) {
      points.push({ id: `day-${day.day}-accommodation`, name: day.accommodation.name || 'Hebergement', type: 'accommodation', coordinates: day.accommodation.coordinates, day: day.day, period: 'Hebergement' });
    }

    return points;
  }) || [];

  const handlePointClick = useCallback((pointId: string) => {
    setSelectedPointId(pointId);
    const element = document.getElementById(pointId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
        <div className="bg-card p-8 rounded-2xl border border-destructive/20 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-destructive text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-destructive mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/profil">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour au profil
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;

  const { selected_variant } = itinerary;

  return (
    <div className="min-h-screen bg-[hsl(var(--warm-bg))]">
      {/* Sticky header */}
      <div className="backdrop-blur-sm bg-card/95 border-b border-border/50 sticky top-32 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/profil"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="hidden sm:inline">Retour au profil</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-bold text-lg text-foreground truncate max-w-[200px] sm:max-w-none">
                {selected_variant?.title || 'Mon Itineraire'}
              </h1>
            </div>

            <Badge variant="recommended" className="px-3 py-1.5 flex items-center gap-2">
              <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
              <span className="text-xs">
                Modifications :{' '}
                {isUnlimited ? (
                  <FontAwesomeIcon icon={faInfinity} className="w-3 h-3" />
                ) : (
                  <span className="font-bold">{itinerary.modifications_remaining}</span>
                )}
              </span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Description */}
        {selected_variant?.description && (
          <motion.div
            {...fadeInUp}
            className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded-xl"
          >
            <p className="text-primary">{selected_variant.description}</p>
          </motion.div>
        )}

        {/* Map */}
        {mapPoints.length > 0 && (
          <motion.div {...fadeInUp} className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Carte de votre itineraire</h2>
            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <ItineraryMap
                points={mapPoints}
                selectedPointId={selectedPointId}
                onPointClick={handlePointClick}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Cliquez sur un marqueur pour voir les details
            </p>
          </motion.div>
        )}

        {/* Day-by-day program */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <FontAwesomeIcon icon={faSun} className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Votre programme jour par jour</h2>
          </div>

          {selected_variant?.days && selected_variant.days.length > 0 ? (
            <Accordion type="multiple" defaultValue={['day-1']}>
              {selected_variant.days.map((day) => (
                <AccordionItem
                  key={day.day}
                  value={`day-${day.day}`}
                  className="bg-card rounded-2xl mb-5 overflow-hidden shadow-lg border border-border data-[state=open]:shadow-xl transition-shadow"
                >
                  <AccordionTrigger className="px-5 py-5 hover:no-underline hover:bg-muted/30 [&>svg]:text-muted-foreground [&>svg]:w-5 [&>svg]:h-5">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary text-primary-foreground text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        J{day.day}
                      </span>
                      <div className="text-left">
                        <p className="font-bold text-foreground text-base">
                          {day.location || `Jour ${day.day}`}
                        </p>
                        {day.title && day.title !== 'description' && day.title !== 'jours' && (
                          <p className="text-sm text-muted-foreground">{day.title}</p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 pt-2 pb-5">
                    {/* Transport */}
                    {day.transport?.method && (
                      <div
                        id={`day-${day.day}-transport`}
                        className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/15"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBus} className="text-primary w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-foreground">Transport</span>
                        </div>
                        <p className="text-foreground font-medium">{day.transport.method}</p>
                        {day.transport.from && day.transport.to && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {day.transport.from} → {day.transport.to}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          {day.transport.duration && <span className="bg-card px-2 py-0.5 rounded-md text-xs">⏱ {day.transport.duration}</span>}
                          {day.transport.cost && <span className="bg-card px-2 py-0.5 rounded-md text-xs">💰 {day.transport.cost}</span>}
                          {day.transport.times && <span className="bg-card px-2 py-0.5 rounded-md text-xs">🕐 {day.transport.times}</span>}
                        </div>
                        {day.transport.coordinates && (
                          <a href={`https://maps.google.com/?q=${day.transport.coordinates.lat},${day.transport.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" /> Google Maps
                          </a>
                        )}
                      </div>
                    )}

                    {/* Activities — Timeline */}
                    {day.activities && day.activities.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faSun} className="text-amber-600 w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-foreground">Programme du jour</span>
                        </div>

                        {/* Timeline */}
                        <div className="relative ml-4 pl-6 border-l-2 border-primary/15 space-y-0">
                          {day.activities.map((activity, actIndex) => {
                            const isLast = actIndex === (day.activities?.length ?? 0) - 1;
                            return (
                              <div
                                key={actIndex}
                                id={`day-${day.day}-act-${actIndex}`}
                                className={`relative pb-5 ${isLast ? 'pb-0' : ''}`}
                              >
                                {/* Timeline dot */}
                                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-card ${
                                  selectedPointId === `day-${day.day}-act-${actIndex}` ? 'bg-primary' : 'bg-primary/60'
                                }`} />

                                {/* Time badge */}
                                {activity.time && (
                                  <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
                                    {activity.time}
                                  </span>
                                )}

                                <div className={`bg-card rounded-xl border shadow-sm p-4 transition-all ${
                                  selectedPointId === `day-${day.day}-act-${actIndex}`
                                    ? 'border-primary ring-4 ring-primary/20 shadow-lg'
                                    : 'border-border hover:shadow-md hover:border-primary/30'
                                }`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-foreground">{activity.name}</h5>
                                      {activity.description && activity.description !== activity.name && (
                                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{activity.description}</p>
                                      )}
                                      {activity.coordinates && (
                                        <a href={`https://maps.google.com/?q=${activity.coordinates.lat},${activity.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary font-medium hover:underline">
                                          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" /> Voir sur Google Maps
                                        </a>
                                      )}
                                    </div>
                                    {canModify ? (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium flex-shrink-0"
                                        onClick={() => alert('Fonctionnalite de modification a venir')}
                                      >
                                        <FontAwesomeIcon icon={faPencil} className="w-3 h-3" />
                                        <span className="hidden sm:inline">Modifier</span>
                                      </motion.button>
                                    ) : (
                                      <div className="relative group">
                                        <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground/50 cursor-not-allowed text-xs">
                                          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                          Passez en Premium pour modifier
                                        </div>
                                      </div>
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
                      <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUtensils} className="text-orange-500 w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-foreground">Ou manger</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { key: 'breakfast', data: day.meals?.breakfast, label: 'Petit-dejeuner', emoji: '☀️' },
                            { key: 'lunch', data: day.meals?.lunch, label: 'Dejeuner', emoji: '🌤' },
                            { key: 'dinner', data: day.meals?.dinner, label: 'Diner', emoji: '🌙' },
                          ].map(({ key, data, label, emoji }) => data?.restaurant && (
                            <div
                              key={key}
                              id={`day-${day.day}-${key}`}
                              className={`bg-card rounded-xl border p-4 transition-all ${
                                selectedPointId === `day-${day.day}-${key}`
                                  ? 'border-accent ring-4 ring-accent/20 shadow-lg'
                                  : 'border-border hover:shadow-md hover:border-accent/30'
                              }`}
                            >
                              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                                <span>{emoji}</span> {label}
                              </p>
                              <p className="font-semibold text-foreground text-sm">{data.restaurant}</p>
                              {data.dish && (
                                <p className="text-sm text-muted-foreground mt-0.5">{data.dish}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                {data.cost && (
                                  <span className="text-xs font-semibold text-primary">{data.cost}</span>
                                )}
                                {data.coordinates && (
                                  <a href={`https://maps.google.com/?q=${data.coordinates.lat},${data.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2.5 h-2.5" /> Maps
                                  </a>
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
                        className={`bg-card rounded-xl border p-4 transition-all ${
                          selectedPointId === `day-${day.day}-accommodation`
                            ? 'border-emerald-400 ring-4 ring-emerald-400/20 shadow-lg'
                            : 'border-border hover:shadow-md hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBed} className="text-emerald-600 w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-foreground">Hebergement</span>
                        </div>
                        <p className="font-semibold text-foreground">{day.accommodation.name}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {day.accommodation.type && (
                            <span className="text-xs bg-muted px-2.5 py-1 rounded-md text-muted-foreground">{day.accommodation.type}</span>
                          )}
                          {day.accommodation.cost && (
                            <span className="text-xs bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 font-medium">{day.accommodation.cost}/nuit</span>
                          )}
                        </div>
                        {day.accommodation.coordinates && (
                          <a href={`https://maps.google.com/?q=${day.accommodation.coordinates.lat},${day.accommodation.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary font-medium hover:underline">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" /> Voir sur Google Maps
                          </a>
                        )}
                      </div>
                    )}

                    {/* Empty day */}
                    {!day.activities?.length && !day.meals?.breakfast && !day.meals?.lunch && !day.meals?.dinner && !day.accommodation?.name && !day.transport?.method && (
                      <p className="text-muted-foreground italic text-center py-4">
                        Aucune activite prevue pour ce jour
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun jour planifie dans cet itineraire.</p>
            </div>
          )}
        </div>

        {/* Tips */}
        {selected_variant?.tips && selected_variant.tips.length > 0 && (
          <motion.div {...fadeInUp} className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-accent" />
              Conseils pour votre voyage
            </h3>
            <ul className="space-y-2">
              {selected_variant.tips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Upgrade CTA for Express */}
        {!canModify && itinerary.offer_type === 'express' && (
          <motion.div {...fadeInUp} className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl text-center">
            <h3 className="font-semibold text-foreground mb-2">
              Envie de personnaliser votre itineraire ?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Avec l&apos;offre Express, vous ne pouvez pas modifier votre itineraire.
              Passez en Premium ou Conciergerie pour beneficier de modifications.
            </p>
            <Button asChild size="lg">
              <Link href="/itineraire-personnalise-pour-les-philippines">
                Voir les offres
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
