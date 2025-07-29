import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { getFlightRoutes } from '@/app/actions/flightActions';
import VolsClientPage from './VolsClientPage';

export const metadata: Metadata = {
  title: 'Vols Intérieurs aux Philippines | Philippin\'Easy',
  description: 'Trouvez et comparez les vols intérieurs aux Philippines pour voyager rapidement et efficacement entre les îles.',
};

const VolsPage = async () => {
  const { data: initialFlights } = await getFlightRoutes({});

  return (
    <div>
      <HeroThematic
        titlePart1="Vols Intérieurs"
        titlePart2="aux Philippines"
        titlePart2Color="accent"
        subtitle="Le moyen le plus rapide pour sauter d'île en île et maximiser votre temps."
        imageUrl="https://images.unsplash.com/photo-1578314193411-06a44993749d?q=80&w=2070&auto=format&fit=crop"
      />

      <VolsClientPage initialFlights={initialFlights || []} />

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-152459271464c-a0491da35d0a?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Tableau d'affichage des départs dans un aéroport"
      >
        <h2>Conseils pour les <span className="text-accent">Vols</span></h2>
        <p>Prendre l'avion est souvent indispensable pour voyager entre les principaux archipels des Philippines (Luzon, Visayas, Mindanao).</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Compagnies Principales :</b> Cebu Pacific, Philippine Airlines (PAL), et AirAsia sont les acteurs majeurs du marché.</li>
          <li><b>Hubs :</b> Manille (MNL), Cebu (CEB), et Clark (CRK) sont les aéroports les plus importants avec le plus de connexions.</li>
          <li><b>Réservations :</b> Réservez vos vols bien à l'avance, surtout pendant la haute saison (décembre-mai), pour obtenir les meilleurs prix.</li>
          <li><b>Bagages :</b> Vérifiez attentivement les franchises de bagages. Les compagnies low-cost facturent souvent des suppléments pour les bagages en soute.</li>
        </ul>
      </AlternatingContent>
    </div>
  );
};

export default VolsPage;
