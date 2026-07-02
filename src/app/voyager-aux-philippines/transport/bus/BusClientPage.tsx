'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getBusRoutes, addBusRoute } from '@/app/actions/busActions';
import CitySelector from '@/components/shared/CitySelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBus,
  faCalendarAlt,
  faClock,
  faPesoSign,
  faFilter,
  faRotateLeft,
  faPlus,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const routeSchema = z.object({
  departure_city: z.string().min(1, 'Ville de départ requise'),
  arrival_city: z.string().min(1, 'Ville d\'arrivée requise'),
  departure_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  departure_time: z.string().min(1, 'Heure de départ requise'),
  company: z.string().optional(),
  price: z.number().positive('Le prix doit être un nombre positif').optional(),
});

type BusRoute = {
  id: number;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  departure_time: string;
  company: string | null;
  price: number | null;
  created_at: string;
  user_id: string | null;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
};

interface BusClientPageProps {
  initialRoutes: BusRoute[];
}

// Micro-tokens shared across the form and filter fields (kit typography scale).
const fieldLabel = 'mb-1.5 block text-[13px] font-medium text-foreground';
const fieldError = 'mt-1 text-[12.5px] text-destructive';
const filterLabel = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground';

const BusClientPage = ({ initialRoutes }: BusClientPageProps) => {
  const [routes, setRoutes] = useState(initialRoutes);
  const [filters, setFilters] = useState({ departureCity: '', arrivalCity: '', date: '', company: '' });
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(routeSchema),
  });

  const handleAddRoute = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    startTransition(async () => {
      await addBusRoute(formData);
      reset();
      const { data: newRoutes } = await getBusRoutes(filters);
      if (newRoutes) {
        setRoutes(newRoutes as BusRoute[]);
      }
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { data: newRoutes } = await getBusRoutes(filters);
      if (newRoutes) {
        setRoutes(newRoutes as BusRoute[]);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Ajouter un trajet — signature "app window" card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest lg:sticky lg:top-32 lg:self-start">
            {/* macOS-style title bar, same signature as the visa simulator */}
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
              <span className="ml-3 flex min-w-0 items-center gap-2 truncate text-[12px] font-semibold text-muted-foreground">
                <FontAwesomeIcon icon={faBus} className="h-3 w-3 flex-shrink-0 text-primary" aria-hidden="true" />
                Ajouter un trajet
              </span>
            </div>

            <div className="px-5 py-6">
              {isClient ? (
                <form onSubmit={handleSubmit(handleAddRoute)} className="space-y-4">
                  <div>
                    <label className={fieldLabel}>Ville de départ</label>
                    <Controller
                      name="departure_city"
                      control={control}
                      render={({ field }) => <CitySelector {...field} />}
                    />
                    {errors.departure_city && <p className={fieldError}>{errors.departure_city.message}</p>}
                  </div>
                  <div>
                    <label className={fieldLabel}>Ville d'arrivée</label>
                    <Controller
                      name="arrival_city"
                      control={control}
                      render={({ field }) => <CitySelector {...field} />}
                    />
                    {errors.arrival_city && <p className={fieldError}>{errors.arrival_city.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={fieldLabel}>Date de départ</label>
                      <Input type="date" className="h-11 rounded-lg" {...register('departure_date')} />
                      {errors.departure_date && <p className={fieldError}>{errors.departure_date.message}</p>}
                    </div>
                    <div>
                      <label className={fieldLabel}>Heure de départ</label>
                      <Input type="time" className="h-11 rounded-lg" {...register('departure_time')} />
                      {errors.departure_time && <p className={fieldError}>{errors.departure_time.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Compagnie</label>
                    <Input className="h-11 rounded-lg" {...register('company')} placeholder="ex: Ceres Liner" />
                  </div>
                  <div>
                    <label className={fieldLabel}>Prix (en PHP)</label>
                    <Input type="number" className="h-11 rounded-lg" {...register('price', { valueAsNumber: true })} placeholder="ex: 500" />
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

        {/* Tous les trajets */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold text-foreground" style={{ letterSpacing: '-0.01em' }}>
              Tous les trajets
            </h2>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary/10 px-2.5 text-[12.5px] font-semibold tabular-nums text-primary">
              {routes.length}
            </span>
          </div>

          {/* Filtres — chips nets */}
          <form onSubmit={handleFilterSubmit} className="mb-6 rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="bus-filter-departureCity" className={filterLabel}>Ville de départ</label>
                <Input
                  id="bus-filter-departureCity"
                  name="departureCity"
                  placeholder="Ville de départ"
                  value={filters.departureCity}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="bus-filter-arrivalCity" className={filterLabel}>Ville d'arrivée</label>
                <Input
                  id="bus-filter-arrivalCity"
                  name="arrivalCity"
                  placeholder="Ville d'arrivée"
                  value={filters.arrivalCity}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="bus-filter-date" className={filterLabel}>Date</label>
                <Input
                  id="bus-filter-date"
                  name="date"
                  type="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="h-11 rounded-full"
                />
              </div>
              <div>
                <label htmlFor="bus-filter-company" className={filterLabel}>Compagnie</label>
                <Input
                  id="bus-filter-company"
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

          {/* Liste des trajets */}
          <div className="space-y-3">
            {routes.length > 0 ? (
              routes.map(route => (
                <article
                  key={route.id}
                  className="group rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <span
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={faBus} style={{ fontSize: '16px' }} />
                      </span>
                      <div className="min-w-0">
                        <h3
                          className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-foreground"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          <span>{route.departure_city}</span>
                          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>{route.arrival_city}</span>
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {new Date(route.departure_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {route.departure_time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faBus} className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {route.company || 'Non spécifié'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-baseline justify-end gap-1 text-accent-strong">
                        <span className="text-[20px] font-bold tabular-nums">{route.price}</span>
                        <FontAwesomeIcon icon={faPesoSign} className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      {route.profiles && (
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <span className="text-[11.5px] text-muted-foreground">Ajouté par {route.profiles.username}</span>
                          <Image
                            src={route.profiles.avatar_url}
                            alt={route.profiles.username}
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
                  <FontAwesomeIcon icon={faBus} className="h-5 w-5" />
                </span>
                <p className="text-[14px] text-muted-foreground">Aucun trajet trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusClientPage;
