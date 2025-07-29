import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { getBusRoutes } from '@/app/actions/busActions';
import BusClientPage from './BusClientPage';

export const metadata: Metadata = {
  title: 'Bus et Vans aux Philippines | Philippin\'Easy',
  description: 'Découvrez comment voyager en bus et en van à travers les Philippines, et partagez vos propres trajets avec la communauté.',
};

const BusPage = async () => {
  const { data: initialRoutes } = await getBusRoutes({});

  return (
    <div>
      <HeroThematic
        titlePart1="Voyager en"
        titlePart2="Bus & Van"
        titlePart2Color="accent"
        subtitle="Le moyen le plus authentique et économique pour explorer les îles en profondeur."
        imageUrl="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1974&auto=format&fit=crop"
      />

      <BusClientPage initialRoutes={initialRoutes || []} />

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1974&auto=format&fit=crop"
        imageAlt="Bus coloré typique des Philippines"
      >
        <h2>Conseils pour Voyager en <span className="text-accent">Bus</span></h2>
        <p>Le bus est le roi des transports terrestres aux Philippines. C'est un moyen économique et efficace de parcourir de longues distances sur une même île.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types de bus :</b> Vous trouverez des bus climatisés (air-con) pour plus de confort, et des bus ordinaires (ordinary) pour une expérience plus locale et économique.</li>
          <li><b>Compagnies :</b> Ceres Liner est la compagnie la plus connue et la plus répandue, reconnaissable à ses bus jaunes.</li>
          <li><b>Réservations :</b> Pour la plupart des trajets, il n'est pas nécessaire de réserver à l'avance. Il suffit de se présenter au terminal de bus.</li>
        </ul>
      </AlternatingContent>
    </div>
  );
};

export default BusPage;
