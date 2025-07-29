'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getFlightRoutes, addFlightRoute } from '@/app/actions/flightActions';
import AirportSelector from '@/components/shared/AirportSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCalendarAlt, faClock, faPesoSign, faBuilding } from '@fortawesome/free-solid-svg-icons';
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un vol</CardTitle>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <form onSubmit={handleSubmit(handleAddFlight)} className="space-y-4">
                  <div>
                    <label>Aéroport de départ</label>
                    <Controller
                      name="departure_city"
                      control={control}
                      render={({ field }) => <AirportSelector {...field} />}
                    />
                    {errors.departure_city && <p className="text-red-500 text-sm">{errors.departure_city.message}</p>}
                  </div>
                  <div>
                    <label>Aéroport d'arrivée</label>
                    <Controller
                      name="arrival_city"
                      control={control}
                      render={({ field }) => <AirportSelector {...field} />}
                    />
                    {errors.arrival_city && <p className="text-red-500 text-sm">{errors.arrival_city.message}</p>}
                  </div>
                  <div>
                    <label>Date de départ</label>
                    <Input type="date" {...register('departure_date')} />
                    {errors.departure_date && <p className="text-red-500 text-sm">{errors.departure_date.message}</p>}
                  </div>
                  <div>
                    <label>Heure de départ</label>
                    <Input type="time" {...register('departure_time')} />
                    {errors.departure_time && <p className="text-red-500 text-sm">{errors.departure_time.message}</p>}
                  </div>
                  <div>
                    <label>Heure d'arrivée</label>
                    <Input type="time" {...register('arrival_time')} />
                    {errors.arrival_time && <p className="text-red-500 text-sm">{errors.arrival_time.message}</p>}
                  </div>
                  <div>
                    <label>Compagnie</label>
                    <Input {...register('company')} placeholder="ex: Cebu Pacific" />
                  </div>
                  <div>
                    <label>Prix (en PHP)</label>
                    <Input type="number" {...register('price', { valueAsNumber: true })} placeholder="ex: 2500" />
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Publication...' : 'Publier'}
                  </Button>
                </form>
              ) : (
                <p>Chargement du formulaire...</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tous les vols</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFilterSubmit} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="departureCity" placeholder="Aéroport de départ" value={filters.departureCity} onChange={handleFilterChange} />
                  <Input name="arrivalCity" placeholder="Aéroport d'arrivée" value={filters.arrivalCity} onChange={handleFilterChange} />
                  <Input name="date" type="date" value={filters.date} onChange={handleFilterChange} />
                  <Input name="company" placeholder="Compagnie" value={filters.company} onChange={handleFilterChange} />
                </div>
                <div className="flex gap-4">
                  <Button type="submit">Filtrer</Button>
                  <Button variant="outline" onClick={() => setFilters({ departureCity: '', arrivalCity: '', date: '', company: '' })}>Réinitialiser</Button>
                </div>
              </form>
              <div className="space-y-4">
                {flights.length > 0 ? (
                  flights.map(flight => (
                    <Card key={flight.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold flex items-center">
                              <FontAwesomeIcon icon={faPlaneDeparture} className="mr-3 text-primary" />
                              <span>{flight.departure_city} → {flight.arrival_city}</span>
                            </h3>
                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                              <p className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className="w-4 mr-2" /> {new Date(flight.departure_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              <p className="flex items-center"><FontAwesomeIcon icon={faClock} className="w-4 mr-2" /> {flight.departure_time} - {flight.arrival_time}</p>
                              <p className="flex items-center"><FontAwesomeIcon icon={faBuilding} className="w-4 mr-2" /> {flight.company || 'Non spécifié'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-accent">{flight.price} <FontAwesomeIcon icon={faPesoSign} /></span>
                            {flight.profiles && (
                              <div className="flex items-center justify-end mt-2">
                                <span className="text-xs text-muted-foreground mr-2">Ajouté par {flight.profiles.username}</span>
                                <Image src={flight.profiles.avatar_url} alt={flight.profiles.username} width={24} height={24} className="rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>Aucun vol trouvé.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolsClientPage;
