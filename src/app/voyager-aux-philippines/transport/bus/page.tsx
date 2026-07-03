import { Metadata } from 'next';
import { PageHero, SplitSection, FaqAccordion } from '@/components/sections';
import { getBusRoutes } from '@/app/actions/busActions';
import BusClientPage from './BusClientPage';

export const metadata: Metadata = {
  title: 'Bus et Vans aux Philippines',
  description: 'Découvrez comment voyager en bus et en van à travers les Philippines, et partagez vos propres trajets avec la communauté.',
};

// FAQ 100 % factuelle — reformule les conseils déjà donnés plus haut sur la
// page (types de bus, compagnies, réservation). Feed le visible ET le FAQPage
// schema via <FaqAccordion withSchema>.
const BUS_FAQS = [
  {
    q: 'Quels types de bus trouve-t-on aux Philippines ?',
    a: "Vous trouverez des bus climatisés (air-con) pour plus de confort, et des bus ordinaires (ordinary) pour une expérience plus locale et économique. Le bus reste le moyen le plus économique et efficace pour parcourir de longues distances sur une même île.",
  },
  {
    q: 'Quelle est la compagnie de bus la plus connue aux Philippines ?',
    a: "Ceres Liner est la compagnie la plus connue et la plus répandue du pays, facilement reconnaissable à ses bus jaunes.",
  },
  {
    q: 'Faut-il réserver son billet de bus à l\'avance ?',
    a: "Non, pour la plupart des trajets, il n'est pas nécessaire de réserver à l'avance. Il suffit de se présenter directement au terminal de bus.",
  },
  {
    q: 'Le bus est-il un bon moyen de voyager aux Philippines ?',
    a: "Oui, c'est le moyen le plus authentique et économique pour explorer les îles en profondeur, particulièrement adapté aux longues distances au sein d'une même île.",
  },
];

const BusPage = async () => {
  const { data: initialRoutes } = await getBusRoutes({});

  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Voyager en"
        titleAccent="Bus & Van"
        subtitle="Le moyen le plus authentique et économique pour explorer les îles en profondeur."
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Voyager en Bus & Van"
      />

      <BusClientPage initialRoutes={initialRoutes || []} />

      <SplitSection
        eyebrow="Bon à savoir"
        title="Conseils pour Voyager en"
        titleAccent="Bus"
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Bus coloré typique des Philippines"
      >
        <p>
          Au-delà des trajets partagés par la communauté ci-dessus, voici quelques repères avant
          de monter à bord. Le bus reste le roi des transports terrestres aux Philippines : un
          moyen économique et efficace de parcourir de longues distances sur une même île.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types de bus :</b> Vous trouverez des bus climatisés (air-con) pour plus de confort, et des bus ordinaires (ordinary) pour une expérience plus locale et économique.</li>
          <li><b>Compagnies :</b> Ceres Liner est la compagnie la plus connue et la plus répandue, reconnaissable à ses bus jaunes.</li>
          <li><b>Réservations :</b> Pour la plupart des trajets, il n'est pas nécessaire de réserver à l'avance. Il suffit de se présenter au terminal de bus.</li>
        </ul>
      </SplitSection>

      {/* FAQ — visible + FAQPage schema (source unique BUS_FAQS) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Vos questions"
            titleAccent="bus"
            faqs={BUS_FAQS}
            withSchema
          />
        </div>
      </section>
    </div>
  );
};

export default BusPage;
