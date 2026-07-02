import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
import { getFlightRoutes } from '@/app/actions/flightActions';
import VolsClientPage from './VolsClientPage';

export const metadata: Metadata = {
  title: 'Vols Intérieurs aux Philippines',
  description: 'Trouvez et comparez les vols intérieurs aux Philippines pour voyager rapidement et efficacement entre les îles.',
};

const VolsPage = async () => {
  const { data: initialFlights } = await getFlightRoutes({});

  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Vols Intérieurs"
        titleAccent="aux Philippines"
        subtitle="Le moyen le plus rapide pour sauter d'île en île et maximiser votre temps."
        imageUrl="/images/transport/vue-aerienne-nuageuse.webp"
        imageAlt="Vols Intérieurs aux Philippines"
      />

      <VolsClientPage initialFlights={initialFlights || []} />

      <SplitSection
        eyebrow="Bon à savoir"
        title="Conseils pour les"
        titleAccent="Vols"
        imageUrl="/images/transport/vue-aerienne-nuageuse.webp"
        imageAlt="Tableau d'affichage des départs dans un aéroport"
      >
        <p>
          Au-delà des vols partagés par la communauté ci-dessus, l'avion reste souvent
          indispensable pour voyager entre les principaux archipels des Philippines (Luzon,
          Visayas, Mindanao).
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Compagnies Principales :</b> Cebu Pacific, Philippine Airlines (PAL), et AirAsia sont les acteurs majeurs du marché.</li>
          <li><b>Hubs :</b> Manille (MNL), Cebu (CEB), et Clark (CRK) sont les aéroports les plus importants avec le plus de connexions.</li>
          <li><b>Réservations :</b> Réservez vos vols bien à l'avance, surtout pendant la haute saison (décembre-mai), pour obtenir les meilleurs prix.</li>
          <li><b>Bagages :</b> Vérifiez attentivement les franchises de bagages. Les compagnies low-cost facturent souvent des suppléments pour les bagages en soute.</li>
        </ul>
      </SplitSection>
    </div>
  );
};

export default VolsPage;
