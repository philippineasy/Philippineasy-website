'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
  faEdit,
  faInfinity,
  faClock,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
  faPencil,
  faLock,
  faLightbulb,
  faUtensils,
  faBed,
  faBus,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

// Import dynamique de la carte pour éviter les erreurs SSR
const ItineraryMap = dynamic(() => import('@/components/itinerary/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-gray-100 flex items-center justify-center border-2 border-primary/20">
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
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Charger l'itinéraire
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/itinerary/${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement');
        }

        console.log('API Response itinerary:', JSON.stringify(data.itinerary?.selected_variant?.days?.[0], null, 2));
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

  // Convertir les données en points pour la carte
  const mapPoints: MapPoint[] = itinerary?.selected_variant?.days?.flatMap((day) => {
    const points: MapPoint[] = [];

    // Activités
    day.activities?.forEach((activity, actIndex) => {
      if (activity.coordinates) {
        points.push({
          id: `day-${day.day}-act-${actIndex}`,
          name: activity.name,
          type: 'activity',
          coordinates: activity.coordinates,
          day: day.day,
          period: activity.time || `Activité ${actIndex + 1}`,
        });
      }
    });

    // Repas
    if (day.meals?.breakfast?.coordinates) {
      points.push({
        id: `day-${day.day}-breakfast`,
        name: day.meals.breakfast.restaurant || 'Petit-déjeuner',
        type: 'restaurant',
        coordinates: day.meals.breakfast.coordinates,
        day: day.day,
        period: 'Petit-déjeuner',
      });
    }
    if (day.meals?.lunch?.coordinates) {
      points.push({
        id: `day-${day.day}-lunch`,
        name: day.meals.lunch.restaurant || 'Déjeuner',
        type: 'restaurant',
        coordinates: day.meals.lunch.coordinates,
        day: day.day,
        period: 'Déjeuner',
      });
    }
    if (day.meals?.dinner?.coordinates) {
      points.push({
        id: `day-${day.day}-dinner`,
        name: day.meals.dinner.restaurant || 'Dîner',
        type: 'restaurant',
        coordinates: day.meals.dinner.coordinates,
        day: day.day,
        period: 'Dîner',
      });
    }

    // Hébergement
    if (day.accommodation?.coordinates) {
      points.push({
        id: `day-${day.day}-accommodation`,
        name: day.accommodation.name || 'Hébergement',
        type: 'accommodation',
        coordinates: day.accommodation.coordinates,
        day: day.day,
        period: 'Hébergement',
      });
    }

    return points;
  }) || [];

  // Toggle jour
  const toggleDay = useCallback((dayNum: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNum)) {
        newSet.delete(dayNum);
      } else {
        newSet.add(dayNum);
      }
      return newSet;
    });
  }, []);

  // Gestion du clic sur un point
  const handlePointClick = useCallback((pointId: string) => {
    setSelectedPointId(pointId);
    const element = document.getElementById(pointId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Calcul des modifications
  const isUnlimited = itinerary?.offer_type === 'conciergerie' && itinerary?.modifications_remaining === -1;
  const canModify = isUnlimited || (itinerary?.modifications_remaining ?? 0) > 0;

  // Loading
  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] pt-32">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-muted-foreground">Chargement de l&apos;itinéraire...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border-2 border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Retour au profil
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  const { selected_variant } = itinerary;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky sous la navbar principale */}
      <div className="bg-white border-b sticky top-32 z-20">
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
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="font-bold text-lg text-primary truncate max-w-[200px] sm:max-w-none">
                {selected_variant?.title || 'Mon Itinéraire'}
              </h1>
            </div>

            {/* Badge modifications */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <FontAwesomeIcon icon={faEdit} className="text-green-600 w-4 h-4" />
              <span className="text-sm text-green-800">
                Modifications :{' '}
                {isUnlimited ? (
                  <FontAwesomeIcon icon={faInfinity} className="w-4 h-4" />
                ) : (
                  <span className="font-bold">{itinerary.modifications_remaining}</span>
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
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-primary">{selected_variant.description}</p>
          </div>
        )}

        {/* Carte */}
        {mapPoints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Carte de votre itinéraire</h2>
            <ItineraryMap
              points={mapPoints}
              selectedPointId={selectedPointId}
              onPointClick={handlePointClick}
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Cliquez sur un marqueur pour voir les détails
            </p>
          </div>
        )}

        {/* Liste des jours */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Votre programme jour par jour</h2>

          {selected_variant?.days && selected_variant.days.length > 0 ? (
            selected_variant.days.map((day) => (
              <div key={day.day} className="border-2 border-primary/20 rounded-xl overflow-hidden">
                {/* Header du jour */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full p-4 bg-primary/5 border-l-4 border-primary flex items-center justify-between hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                      Jour {day.day}
                    </span>
                    {day.location && (
                      <span className="font-semibold text-primary">{day.location}</span>
                    )}
                    {day.title && day.title !== 'description' && day.title !== 'jours' && (
                      <span className="text-muted-foreground text-sm">{day.title}</span>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={expandedDays.has(day.day) ? faChevronUp : faChevronDown}
                    className="text-primary w-4 h-4"
                  />
                </button>

                {/* Contenu du jour */}
                {expandedDays.has(day.day) && (
                  <div className="p-4 space-y-4">
                    {/* Transport */}
                    {day.transport?.method && (
                      <div
                        id={`day-${day.day}-transport`}
                        className="p-4 rounded-lg bg-blue-50 border border-blue-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faBus} className="text-blue-600 w-4 h-4" />
                          <span className="font-semibold text-blue-800">Transport</span>
                        </div>
                        <p className="text-blue-700">{day.transport.method}</p>
                        {day.transport.from && day.transport.to && (
                          <p className="text-sm text-blue-600 mt-1">
                            {day.transport.from} → {day.transport.to}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-blue-600">
                          {day.transport.duration && <span>⏱ {day.transport.duration}</span>}
                          {day.transport.cost && <span>💰 {day.transport.cost}</span>}
                          {day.transport.times && <span>🕐 Départs: {day.transport.times}</span>}
                        </div>
                        {day.transport.coordinates && (
                          <a
                            href={`https://maps.google.com/?q=${day.transport.coordinates.lat},${day.transport.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                            Voir sur Google Maps
                          </a>
                        )}
                      </div>
                    )}

                    {/* Activités */}
                    {day.activities && day.activities.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary flex items-center gap-2">
                          <FontAwesomeIcon icon={faSun} className="w-4 h-4" />
                          Programme du jour
                        </h4>
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            id={`day-${day.day}-act-${actIndex}`}
                            className={`p-4 rounded-lg transition-all duration-200 ${
                              selectedPointId === `day-${day.day}-act-${actIndex}`
                                ? 'bg-primary/10 ring-2 ring-primary'
                                : 'bg-gray-50 hover:bg-gray-100'
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
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/20 text-primary hover:bg-accent transition-colors text-sm font-medium"
                                  onClick={() => alert('Fonctionnalité de modification à venir')}
                                >
                                  <FontAwesomeIcon icon={faPencil} className="w-3 h-3" />
                                  <span className="hidden sm:inline">Modifier</span>
                                </button>
                              ) : (
                                <div className="relative group">
                                  <button disabled className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-sm">
                                    <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
                                  </button>
                                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Passez en Premium pour modifier
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Repas */}
                    {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                          <FontAwesomeIcon icon={faUtensils} className="w-4 h-4" />
                          Où manger
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {day.meals?.breakfast?.restaurant && (
                            <div
                              id={`day-${day.day}-breakfast`}
                              className={`p-3 rounded-lg ${
                                selectedPointId === `day-${day.day}-breakfast`
                                  ? 'bg-orange-100 ring-2 ring-orange-400'
                                  : 'bg-orange-50'
                              }`}
                            >
                              <p className="text-xs text-orange-600 mb-1">☀️ Petit-déjeuner</p>
                              <p className="font-medium text-orange-800">{day.meals.breakfast.restaurant}</p>
                              {day.meals.breakfast.dish && (
                                <p className="text-sm text-orange-700">{day.meals.breakfast.dish}</p>
                              )}
                              {day.meals.breakfast.cost && (
                                <p className="text-xs text-orange-600 mt-1">{day.meals.breakfast.cost}</p>
                              )}
                              {day.meals.breakfast.coordinates && (
                                <a
                                  href={`https://maps.google.com/?q=${day.meals.breakfast.coordinates.lat},${day.meals.breakfast.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-orange-600 hover:underline"
                                >
                                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" />
                                  Maps
                                </a>
                              )}
                            </div>
                          )}
                          {day.meals?.lunch?.restaurant && (
                            <div
                              id={`day-${day.day}-lunch`}
                              className={`p-3 rounded-lg ${
                                selectedPointId === `day-${day.day}-lunch`
                                  ? 'bg-orange-100 ring-2 ring-orange-400'
                                  : 'bg-orange-50'
                              }`}
                            >
                              <p className="text-xs text-orange-600 mb-1">🌤 Déjeuner</p>
                              <p className="font-medium text-orange-800">{day.meals.lunch.restaurant}</p>
                              {day.meals.lunch.dish && (
                                <p className="text-sm text-orange-700">{day.meals.lunch.dish}</p>
                              )}
                              {day.meals.lunch.cost && (
                                <p className="text-xs text-orange-600 mt-1">{day.meals.lunch.cost}</p>
                              )}
                              {day.meals.lunch.coordinates && (
                                <a
                                  href={`https://maps.google.com/?q=${day.meals.lunch.coordinates.lat},${day.meals.lunch.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-orange-600 hover:underline"
                                >
                                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" />
                                  Maps
                                </a>
                              )}
                            </div>
                          )}
                          {day.meals?.dinner?.restaurant && (
                            <div
                              id={`day-${day.day}-dinner`}
                              className={`p-3 rounded-lg ${
                                selectedPointId === `day-${day.day}-dinner`
                                  ? 'bg-orange-100 ring-2 ring-orange-400'
                                  : 'bg-orange-50'
                              }`}
                            >
                              <p className="text-xs text-orange-600 mb-1">🌙 Dîner</p>
                              <p className="font-medium text-orange-800">{day.meals.dinner.restaurant}</p>
                              {day.meals.dinner.dish && (
                                <p className="text-sm text-orange-700">{day.meals.dinner.dish}</p>
                              )}
                              {day.meals.dinner.cost && (
                                <p className="text-xs text-orange-600 mt-1">{day.meals.dinner.cost}</p>
                              )}
                              {day.meals.dinner.coordinates && (
                                <a
                                  href={`https://maps.google.com/?q=${day.meals.dinner.coordinates.lat},${day.meals.dinner.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-orange-600 hover:underline"
                                >
                                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-2 h-2" />
                                  Maps
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hébergement */}
                    {day.accommodation?.name && (
                      <div
                        id={`day-${day.day}-accommodation`}
                        className={`p-4 rounded-lg ${
                          selectedPointId === `day-${day.day}-accommodation`
                            ? 'bg-green-100 ring-2 ring-green-400'
                            : 'bg-green-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faBed} className="text-green-600 w-4 h-4" />
                          <span className="font-semibold text-green-800">Hébergement</span>
                        </div>
                        <p className="font-medium text-green-700">{day.accommodation.name}</p>
                        <div className="flex gap-4 mt-1 text-sm text-green-600">
                          {day.accommodation.type && <span>{day.accommodation.type}</span>}
                          {day.accommodation.cost && <span>💰 {day.accommodation.cost}/nuit</span>}
                        </div>
                        {day.accommodation.coordinates && (
                          <a
                            href={`https://maps.google.com/?q=${day.accommodation.coordinates.lat},${day.accommodation.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                            Voir sur Google Maps
                          </a>
                        )}
                      </div>
                    )}

                    {/* Message si rien */}
                    {!day.activities?.length && !day.meals?.breakfast && !day.meals?.lunch && !day.meals?.dinner && !day.accommodation?.name && !day.transport?.method && (
                      <p className="text-muted-foreground italic text-center py-4">
                        Aucune activité prévue pour ce jour
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun jour planifié dans cet itinéraire.</p>
            </div>
          )}
        </div>

        {/* Tips */}
        {selected_variant?.tips && selected_variant.tips.length > 0 && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600" />
              Conseils pour votre voyage
            </h3>
            <ul className="space-y-2">
              {selected_variant.tips.map((tip, i) => (
                <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info modifications Express */}
        {!canModify && itinerary.offer_type === 'express' && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <h3 className="font-semibold text-blue-800 mb-2">
              Envie de personnaliser votre itinéraire ?
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Avec l&apos;offre Express, vous ne pouvez pas modifier votre itinéraire.
              Passez en Premium ou Conciergerie pour bénéficier de modifications.
            </p>
            <Link
              href="/itineraire-personnalise-pour-les-philippines"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Voir les offres
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
