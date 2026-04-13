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

const DAY_THEMES = [
  { gradient: 'from-amber-50 to-orange-50/50', badge: 'bg-gradient-to-br from-amber-400 to-orange-500', accent: 'text-amber-600' },
  { gradient: 'from-cyan-50 to-blue-50/50', badge: 'bg-gradient-to-br from-cyan-400 to-blue-500', accent: 'text-cyan-600' },
  { gradient: 'from-emerald-50 to-teal-50/50', badge: 'bg-gradient-to-br from-emerald-400 to-teal-500', accent: 'text-emerald-600' },
  { gradient: 'from-rose-50 to-pink-50/50', badge: 'bg-gradient-to-br from-rose-400 to-pink-500', accent: 'text-rose-600' },
  { gradient: 'from-violet-50 to-purple-50/50', badge: 'bg-gradient-to-br from-violet-400 to-purple-500', accent: 'text-violet-600' },
  { gradient: 'from-yellow-50 to-amber-50/50', badge: 'bg-gradient-to-br from-yellow-400 to-amber-500', accent: 'text-yellow-600' },
  { gradient: 'from-sky-50 to-indigo-50/50', badge: 'bg-gradient-to-br from-sky-400 to-indigo-500', accent: 'text-sky-600' },
];

function getDayTheme(dayNumber: number) {
  return DAY_THEMES[(dayNumber - 1) % DAY_THEMES.length];
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
    <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] via-[hsl(30,20%,98%)] to-[hsl(24,80%,94%)]">
      {/* Sticky header */}
      <div className="backdrop-blur-md bg-card/80 border-b border-accent/10 sticky top-32 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/profil"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
              </Link>
              <div className="h-5 w-px bg-border/50" />
              <h1 className="font-bold text-base text-foreground truncate max-w-[200px] sm:max-w-none">
                {selected_variant?.title || 'Mon Itineraire'}
              </h1>
            </div>

            <div className="px-3 py-1.5 flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full">
              <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-accent" />
              <span className="text-xs text-foreground/70">
                {isUnlimited ? (
                  <><FontAwesomeIcon icon={faInfinity} className="w-3 h-3 text-accent" /> Illimite</>
                ) : (
                  <><span className="font-bold text-accent">{itinerary.modifications_remaining}</span> modif.</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Description */}
        {selected_variant?.description && (
          <motion.div
            {...fadeInUp}
            className="mb-6 p-5 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-l-4 border-accent rounded-xl"
          >
            <p className="text-foreground/80 leading-relaxed">{selected_variant.description}</p>
          </motion.div>
        )}

        {/* Map */}
        {mapPoints.length > 0 && (
          <motion.div {...fadeInUp} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Votre parcours</h2>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{mapPoints.length} etapes</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-accent/20 shadow-lg">
              <ItineraryMap
                points={mapPoints}
                selectedPointId={selectedPointId}
                onPointClick={handlePointClick}
              />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[hsl(36,33%,97%)]/60 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Day-by-day program */}
        <div>
          <div className="flex items-center gap-4 mb-8 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-amber-500 text-white flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faSun} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Votre programme jour par jour</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{selected_variant?.days?.length || 0} jours d&apos;aventure aux Philippines</p>
            </div>
          </div>

          {selected_variant?.days && selected_variant.days.length > 0 ? (
            <Accordion type="multiple" defaultValue={['day-1']}>
              {selected_variant.days.map((day) => {
                const theme = getDayTheme(day.day);
                return (
                <AccordionItem
                  key={day.day}
                  value={`day-${day.day}`}
                  className="bg-card rounded-2xl mb-5 overflow-hidden border border-border/50 data-[state=open]:shadow-xl data-[state=open]:border-accent/20 transition-all duration-300"
                >
                  <AccordionTrigger className={`px-5 py-5 hover:no-underline bg-gradient-to-r ${theme.gradient} [&>svg]:text-muted-foreground [&>svg]:w-5 [&>svg]:h-5 transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className={`${theme.badge} text-white text-sm font-bold w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-[10px] font-medium uppercase leading-none opacity-80">Jour</span>
                        <span className="text-lg font-extrabold leading-none">{day.day}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground text-base leading-tight">
                          {day.location || `Jour ${day.day}`}
                        </p>
                        {day.title && day.title !== 'description' && day.title !== 'jours' && (
                          <p className={`text-sm ${theme.accent} font-medium mt-0.5`}>{day.title}</p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 pt-2 pb-5">
                    {/* Transport */}
                    {day.transport?.method && (
                      <div
                        id={`day-${day.day}-transport`}
                        className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${theme.gradient} border border-black/5`}
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
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faSun} className="text-amber-500 w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-foreground">Programme du jour</span>
                          <span className="text-xs text-muted-foreground ml-auto">{day.activities.length} activite{day.activities.length > 1 ? 's' : ''}</span>
                        </div>

                        {/* Timeline */}
                        <div className="relative ml-4 pl-8 space-y-0">
                          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-300 via-accent/40 to-primary/20 rounded-full" />
                          {day.activities.map((activity, actIndex) => {
                            const isLast = actIndex === (day.activities?.length ?? 0) - 1;
                            return (
                              <motion.div
                                key={actIndex}
                                id={`day-${day.day}-act-${actIndex}`}
                                className={`relative ${isLast ? 'pb-0' : 'pb-6'}`}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: actIndex * 0.08, duration: 0.4, ease: 'easeOut' }}
                              >
                                {/* Timeline dot */}
                                <div className="absolute -left-[35px] top-1.5">
                                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    selectedPointId === `day-${day.day}-act-${actIndex}`
                                      ? 'bg-accent scale-125 shadow-[0_0_0_4px_rgba(234,179,8,0.2)]'
                                      : 'bg-accent/50 hover:bg-accent/80'
                                  }`} />
                                </div>

                                {/* Time badge */}
                                {activity.time && (
                                  <span className="inline-block text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full mb-2 tracking-wide">
                                    {activity.time}
                                  </span>
                                )}

                                <div className={`bg-card rounded-xl border p-4 transition-all duration-300 ${
                                  selectedPointId === `day-${day.day}-act-${actIndex}`
                                    ? 'border-accent ring-2 ring-accent/20 shadow-lg -translate-x-0.5'
                                    : 'border-border/60 hover:shadow-md hover:border-accent/30 hover:-translate-y-0.5'
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
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section separator */}
                    {day.activities && day.activities.length > 0 && (day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                      <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                        <span className="text-accent/40 text-xs">~</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                      </div>
                    )}

                    {/* Meals */}
                    {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUtensils} className="text-orange-500 w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-foreground">Ou manger</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { key: 'breakfast', data: day.meals?.breakfast, label: 'Petit-dejeuner', emoji: '☀️', gradient: 'from-amber-50 to-yellow-50', borderAccent: 'border-amber-200', costColor: 'text-amber-700 bg-amber-50' },
                            { key: 'lunch', data: day.meals?.lunch, label: 'Dejeuner', emoji: '🌴', gradient: 'from-orange-50 to-amber-50', borderAccent: 'border-orange-200', costColor: 'text-orange-700 bg-orange-50' },
                            { key: 'dinner', data: day.meals?.dinner, label: 'Diner', emoji: '🌅', gradient: 'from-rose-50 to-orange-50', borderAccent: 'border-rose-200', costColor: 'text-rose-700 bg-rose-50' },
                          ].map(({ key, data, label, emoji, gradient, borderAccent, costColor }) => data?.restaurant && (
                            <motion.div
                              key={key}
                              id={`day-${day.day}-${key}`}
                              whileHover={{ y: -2 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className={`rounded-xl border p-4 transition-all bg-gradient-to-br ${gradient} ${
                                selectedPointId === `day-${day.day}-${key}`
                                  ? `${borderAccent} ring-2 ring-accent/20 shadow-lg`
                                  : `${borderAccent}/50 hover:shadow-md`
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2.5">
                                <span className="text-lg">{emoji}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                              </div>
                              <p className="font-semibold text-foreground text-sm">{data.restaurant}</p>
                              {data.dish && (
                                <p className="text-sm text-muted-foreground mt-1 italic">&quot;{data.dish}&quot;</p>
                              )}
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5">
                                {data.cost && (
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${costColor}`}>{data.cost}</span>
                                )}
                                {data.coordinates && (
                                  <a href={`https://maps.google.com/?q=${data.coordinates.lat},${data.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2.5 h-2.5" /> Maps
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section separator */}
                    {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && day.accommodation?.name && (
                      <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                        <span className="text-accent/40 text-xs">~</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                      </div>
                    )}

                    {/* Accommodation */}
                    {day.accommodation?.name && (
                      <motion.div
                        id={`day-${day.day}-accommodation`}
                        whileHover={{ y: -1 }}
                        className={`rounded-xl border p-5 transition-all duration-300 bg-gradient-to-br from-emerald-50/80 via-card to-teal-50/30 ${
                          selectedPointId === `day-${day.day}-accommodation`
                            ? 'border-emerald-300 ring-2 ring-emerald-300/20 shadow-lg'
                            : 'border-emerald-200/60 hover:shadow-md hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                            <FontAwesomeIcon icon={faBed} className="text-white w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">Hebergement</span>
                            <p className="font-bold text-foreground text-base">{day.accommodation.name}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {day.accommodation.type && (
                                <span className="text-xs bg-emerald-100 px-2.5 py-1 rounded-lg text-emerald-700 font-medium">{day.accommodation.type}</span>
                              )}
                              {day.accommodation.cost && (
                                <span className="text-xs bg-emerald-500/10 px-2.5 py-1 rounded-lg text-emerald-700 font-bold">{day.accommodation.cost}/nuit</span>
                              )}
                            </div>
                            {day.accommodation.coordinates && (
                              <a href={`https://maps.google.com/?q=${day.accommodation.coordinates.lat},${day.accommodation.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-medium hover:text-emerald-700 hover:underline">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" /> Voir sur Google Maps
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Empty day */}
                    {!day.activities?.length && !day.meals?.breakfast && !day.meals?.lunch && !day.meals?.dinner && !day.accommodation?.name && !day.transport?.method && (
                      <p className="text-muted-foreground italic text-center py-4">
                        Aucune activite prevue pour ce jour
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun jour planifie dans cet itineraire.</p>
            </div>
          )}
        </div>

        {/* Tips */}
        {selected_variant?.tips && selected_variant.tips.length > 0 && (
          <motion.div {...fadeInUp} className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2.5 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <FontAwesomeIcon icon={faLightbulb} className="text-white w-3.5 h-3.5" />
              </div>
              Nos conseils de voyage
            </h3>
            <ul className="space-y-2 relative z-10">
              {selected_variant.tips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <FontAwesomeIcon icon={faLightbulb} className="text-accent w-3 h-3 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Upgrade CTA for Express */}
        {!canModify && itinerary.offer_type === 'express' && (
          <motion.div {...fadeInUp} className="mt-8 p-6 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 border border-accent/20 rounded-2xl text-center relative overflow-hidden">
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
