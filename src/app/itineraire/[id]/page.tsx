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
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Votre programme jour par jour</h2>

          {selected_variant?.days && selected_variant.days.length > 0 ? (
            <Accordion type="multiple" defaultValue={['day-1']}>
              {selected_variant.days.map((day) => (
                <AccordionItem
                  key={day.day}
                  value={`day-${day.day}`}
                  className="border border-border/50 rounded-2xl mb-4 overflow-hidden bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] data-[state=open]:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow"
                >
                  <AccordionTrigger className="px-4 py-4 bg-primary/5 hover:bg-primary/8 hover:no-underline border-l-4 border-primary [&>svg]:text-primary">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                        Jour {day.day}
                      </span>
                      {day.location && (
                        <span className="font-semibold text-foreground">{day.location}</span>
                      )}
                      {day.title && day.title !== 'description' && day.title !== 'jours' && (
                        <span className="text-muted-foreground text-sm hidden sm:inline">{day.title}</span>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pt-4 pb-2">
                    <div className="space-y-4">
                      {/* Transport */}
                      {day.transport?.method && (
                        <div
                          id={`day-${day.day}-transport`}
                          className="p-4 rounded-xl bg-primary/5 border-l-2 border-primary/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faBus} className="text-primary w-4 h-4" />
                            <span className="font-semibold text-foreground">Transport</span>
                          </div>
                          <p className="text-foreground">{day.transport.method}</p>
                          {day.transport.from && day.transport.to && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {day.transport.from} → {day.transport.to}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            {day.transport.duration && <span>⏱ {day.transport.duration}</span>}
                            {day.transport.cost && <span>💰 {day.transport.cost}</span>}
                            {day.transport.times && <span>🕐 Departs: {day.transport.times}</span>}
                          </div>
                          {day.transport.coordinates && (
                            <a
                              href={`https://maps.google.com/?q=${day.transport.coordinates.lat},${day.transport.coordinates.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                            >
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                              Voir sur Google Maps
                            </a>
                          )}
                        </div>
                      )}

                      {/* Activities */}
                      {day.activities && day.activities.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <FontAwesomeIcon icon={faSun} className="w-4 h-4 text-yellow-500" />
                            Programme du jour
                          </h4>
                          {day.activities.map((activity, actIndex) => (
                            <div
                              key={actIndex}
                              id={`day-${day.day}-act-${actIndex}`}
                              className={`p-4 rounded-xl border-l-2 border-yellow-300 transition-all duration-200 ${
                                selectedPointId === `day-${day.day}-act-${actIndex}`
                                  ? 'bg-primary/10 ring-2 ring-primary'
                                  : 'bg-muted/50 hover:bg-muted hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  {activity.time && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <FontAwesomeIcon icon={faClock} className="text-accent w-3 h-3" />
                                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                                    </div>
                                  )}
                                  <h5 className="font-semibold text-foreground">{activity.name}</h5>
                                  {activity.description && activity.description !== activity.name && (
                                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                  )}
                                  {activity.coordinates && (
                                    <a
                                      href={`https://maps.google.com/?q=${activity.coordinates.lat},${activity.coordinates.lng}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                                    >
                                      <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                                      Voir sur Google Maps
                                    </a>
                                  )}
                                </div>
                                {canModify ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/15 text-primary hover:bg-accent/25 transition-colors text-sm font-medium"
                                    onClick={() => alert('Fonctionnalite de modification a venir')}
                                  >
                                    <FontAwesomeIcon icon={faPencil} className="w-3 h-3" />
                                    <span className="hidden sm:inline">Modifier</span>
                                  </motion.button>
                                ) : (
                                  <div className="relative group">
                                    <button disabled className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-sm">
                                      <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      Passez en Premium pour modifier
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meals */}
                      {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <FontAwesomeIcon icon={faUtensils} className="w-4 h-4 text-orange-400" />
                            Ou manger
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {day.meals?.breakfast?.restaurant && (
                              <div
                                id={`day-${day.day}-breakfast`}
                                className={`p-3 rounded-xl border-l-2 border-orange-300 ${
                                  selectedPointId === `day-${day.day}-breakfast`
                                    ? 'bg-accent/20 ring-2 ring-accent'
                                    : 'bg-accent/5 hover:bg-accent/10'
                                } transition-all`}
                              >
                                <p className="text-xs text-muted-foreground mb-1">☀️ Petit-dejeuner</p>
                                <p className="font-medium text-foreground">{day.meals.breakfast.restaurant}</p>
                                {day.meals.breakfast.dish && (
                                  <p className="text-sm text-muted-foreground">{day.meals.breakfast.dish}</p>
                                )}
                                {day.meals.breakfast.cost && (
                                  <p className="text-xs text-accent mt-1">{day.meals.breakfast.cost}</p>
                                )}
                                {day.meals.breakfast.coordinates && (
                                  <a href={`https://maps.google.com/?q=${day.meals.breakfast.coordinates.lat},${day.meals.breakfast.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" /> Maps
                                  </a>
                                )}
                              </div>
                            )}
                            {day.meals?.lunch?.restaurant && (
                              <div
                                id={`day-${day.day}-lunch`}
                                className={`p-3 rounded-xl border-l-2 border-orange-300 ${
                                  selectedPointId === `day-${day.day}-lunch`
                                    ? 'bg-accent/20 ring-2 ring-accent'
                                    : 'bg-accent/5 hover:bg-accent/10'
                                } transition-all`}
                              >
                                <p className="text-xs text-muted-foreground mb-1">🌤 Dejeuner</p>
                                <p className="font-medium text-foreground">{day.meals.lunch.restaurant}</p>
                                {day.meals.lunch.dish && (
                                  <p className="text-sm text-muted-foreground">{day.meals.lunch.dish}</p>
                                )}
                                {day.meals.lunch.cost && (
                                  <p className="text-xs text-accent mt-1">{day.meals.lunch.cost}</p>
                                )}
                                {day.meals.lunch.coordinates && (
                                  <a href={`https://maps.google.com/?q=${day.meals.lunch.coordinates.lat},${day.meals.lunch.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" /> Maps
                                  </a>
                                )}
                              </div>
                            )}
                            {day.meals?.dinner?.restaurant && (
                              <div
                                id={`day-${day.day}-dinner`}
                                className={`p-3 rounded-xl border-l-2 border-orange-300 ${
                                  selectedPointId === `day-${day.day}-dinner`
                                    ? 'bg-accent/20 ring-2 ring-accent'
                                    : 'bg-accent/5 hover:bg-accent/10'
                                } transition-all`}
                              >
                                <p className="text-xs text-muted-foreground mb-1">🌙 Diner</p>
                                <p className="font-medium text-foreground">{day.meals.dinner.restaurant}</p>
                                {day.meals.dinner.dish && (
                                  <p className="text-sm text-muted-foreground">{day.meals.dinner.dish}</p>
                                )}
                                {day.meals.dinner.cost && (
                                  <p className="text-xs text-accent mt-1">{day.meals.dinner.cost}</p>
                                )}
                                {day.meals.dinner.coordinates && (
                                  <a href={`https://maps.google.com/?q=${day.meals.dinner.coordinates.lat},${day.meals.dinner.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" /> Maps
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Accommodation */}
                      {day.accommodation?.name && (
                        <div
                          id={`day-${day.day}-accommodation`}
                          className={`p-4 rounded-xl border-l-2 border-green-300 ${
                            selectedPointId === `day-${day.day}-accommodation`
                              ? 'bg-green-100/50 ring-2 ring-green-400'
                              : 'bg-green-50/50 hover:bg-green-100/30'
                          } transition-all`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faBed} className="text-green-600 w-4 h-4" />
                            <span className="font-semibold text-foreground">Hebergement</span>
                          </div>
                          <p className="font-medium text-foreground">{day.accommodation.name}</p>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            {day.accommodation.type && <span>{day.accommodation.type}</span>}
                            {day.accommodation.cost && <span>💰 {day.accommodation.cost}/nuit</span>}
                          </div>
                          {day.accommodation.coordinates && (
                            <a
                              href={`https://maps.google.com/?q=${day.accommodation.coordinates.lat},${day.accommodation.coordinates.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                            >
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                              Voir sur Google Maps
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
                    </div>
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
