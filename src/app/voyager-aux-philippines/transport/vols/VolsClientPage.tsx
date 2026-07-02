'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getFlightRoutes, addFlightRoute } from '@/app/actions/flightActions';
import AirportSelector from '@/components/shared/AirportSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlaneDeparture,
  faCalendarAlt,
  faClock,
  faPesoSign,
  faBuilding,
  faFilter,
  faRotateLeft,
  faPlus,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const flightSchema = z.object({
  departure_city: z.string().min(1, 'Aéroport de départ requis'),
  arrival_city: z.string().min(1, 'Aéroport d\'arrivée requis'),
  departure_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  departure_time: z.string().min(1, 'Heure de départ requise'),
  arrival_time: z.string().min(1, 'Heure d\'arrivée requise'),
  company: z.string().optional(),
  price: z.number().positive('Le prix doit être un nombre positif').optional().nullable(),
});

type FlightRoute = {
  id: number;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  company: string | null;
  price: number | null;
  user_id: string | null;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
};

interface VolsClientPageProps {
  initialFlights: FlightRoute[];
}

// Micro-tokens shared across the form and filter fields (kit typography scale).
const fieldLabel = 'mb-1.5 block text-[13px] font-medium text-foreground';
const fieldError = 'mt-1 text-[12.5px] text-destructive';
const filterLabel = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground';

const VolsClientPage = ({ initialFlights }: VolsClientPageProps) => {
  const [flights, setFlights] = useState(initialFlights);
  const [filters, setFilters] = useState({ departureCity: '', arrivalCity: '', date: '', company: '' });
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(flightSchema),
  });

  const handleAddFlight = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    startTransition(async () => {
      await addFlightRoute(formData);
      reset();
      const { data: newFlights } = await getFlightRoutes(filters);
      if (newFlights) {
        setFlights(newFlights as FlightRoute[]);
      }
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { data: newFlights } = await getFlightRoutes(filters);
      if (newFlights) {
        setFlights(newFlights as FlightRoute[]);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Ajouter un vol — signature "app window" card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest lg:sticky lg:top-32 lg:self-start">
            {/* macOS-style title bar, same signature as the visa simulator */}
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
              <span className="ml-3 flex min-w-0 items-center gap-2 truncate text-[12px] font-semibold text-muted-foreground">
                <FontAwesomeIcon icon={faPlaneDeparture} className="h-3 w-3 flex-shrink-0 text-primary" aria-hidden="true" />
                Ajouter un vol
              </span>
            </div>

            <div className="px-5 py-6">
              {isClient ? (
                <form onSubmit={handleSubmit(handleAddFlight)} className="space-y-4">
                  <div>
                    <label className={fieldLabel}>Aéroport de départ</label>
                    <Controller
                      name="departure_city"
                      control={control}
                      render={({ field }) => <AirportSelector {...field} />}
                    />
                    {errors.departure_city && <p className={fieldError}>{errors.departure_city.message}</p>}
                  </div>
                  <div>
                    <label className={fieldLabel}>Aéroport d'arrivée</label>
                    <Controller
                      name="arrival_city"
                      control={control}
                      render={({ field }) => <AirportSelector {...field} />}
                    />
                    {errors.arrival_city && <p className={fieldError}>{errors.arrival_city.message}</p>}
                  </div>
                  <div>
                    <label className={fieldLabel}>Date de départ</label>
                    <Input type="date" className="h-11 rounded-lg" {...register('departure_date')} />
                    {errors.departure_date && <p className={fieldError}>{errors.departure_date.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={fieldLabel}>Heure de départ</label>
                      <Input type="time" className="h-11 rounded-lg" {...register('departure_time')} />
                      {errors.departure_time && <p className={fieldError}>{errors.departure_time.message}</p>}
                    </div>
                    <div>
                      <label className={fieldLabel}>Heure d'arrivée</label>
                      <Input type="time" className="h-11 rounded-lg" {...register('arrival_time')} />
                      {errors.arrival_time && <p className={fieldError}>{errors.arrival_time.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Compagnie</label>
                    <Input className="h-11 rounded-lg" {...register('company')} placeholder="ex: Cebu Pacific" />
                  </div>
                  <div>
                    <label className={fieldLabel}>Prix (en PHP)</label>
                    <Input type="number" className="h-11 rounded-lg" {...register('price', { valueAsNumber: true })} placeholder="ex: 2500" />
                  </div>
                  <Button type="submit" variant="accent" size="lg" disabled={isPending} className="w-full">
                    {isPending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Publication...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                        Publier
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 py-10 text-[13.5px] text-muted-foreground">
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Chargement du formulaire...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tous les vols */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold text-foreground" style={{ letterSpacing: '-0.01em' }}>
              Tous les vols
            </h2>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary/10 px-2.5 text-[12.5px] font-semibold tabular-nums text-primary">
              {flights.length}
            </span>
          </div>

          {/* Filtres — chips nets */}
          <form onSubmit={handleFilterSubmit} className="mb-6 rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="vols-filter-departureCity" className={filterLabel}>Aéroport de départ</label>
                <Input
                  id="vols-filter-departureCity"
                  name="departureCity"
                  placeholder="Aéroport de départ"
                  value={filters.departureCity}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="vols-filter-arrivalCity" className={filterLabel}>Aéroport d'arrivée</label>
                <Input
                  id="vols-filter-arrivalCity"
                  name="arrivalCity"
                  placeholder="Aéroport d'arrivée"
                  value={filters.arrivalCity}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="vols-filter-date" className={filterLabel}>Date</label>
                <Input
                  id="vols-filter-date"
                  name="date"
                  type="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="vols-filter-company" className={filterLabel}>Compagnie</label>
                <Input
                  id="vols-filter-company"
                  name="company"
                  placeholder="Compagnie"
                  value={filters.company}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="submit" size="lg">
                <FontAwesomeIcon icon={faFilter} className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Filtrer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setFilters({ departureCity: '', arrivalCity: '', date: '', company: '' })}
              >
                <FontAwesomeIcon icon={faRotateLeft} className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Réinitialiser
              </Button>
            </div>
          </form>

          {/* Liste des vols */}
          <div className="space-y-3">
            {flights.length > 0 ? (
              flights.map(flight => (
                <article
                  key={flight.id}
                  className="group rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <span
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={faPlaneDeparture} style={{ fontSize: '16px' }} />
                      </span>
                      <div className="min-w-0">
                        <h3
                          className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-foreground"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          <span>{flight.departure_city}</span>
                          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>{flight.arrival_city}</span>
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {new Date(flight.departure_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {flight.departure_time} - {flight.arrival_time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {flight.company || 'Non spécifié'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-baseline justify-end gap-1 text-accent-strong">
                        <span className="text-[20px] font-bold tabular-nums">{flight.price}</span>
                        <FontAwesomeIcon icon={faPesoSign} className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      {flight.profiles && (
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <span className="text-[11.5px] text-muted-foreground">Ajouté par {flight.profiles.username}</span>
                          <Image
                            src={flight.profiles.avatar_url}
                            alt={flight.profiles.username}
                            width={22}
                            height={22}
                            className="rounded-full border border-border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-[0.5px] border-dashed border-border bg-card/50 px-6 py-14 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-hidden="true">
                  <FontAwesomeIcon icon={faPlaneDeparture} className="h-5 w-5" />
                </span>
                <p className="text-[14px] text-muted-foreground">Aucun vol trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolsClientPage;
