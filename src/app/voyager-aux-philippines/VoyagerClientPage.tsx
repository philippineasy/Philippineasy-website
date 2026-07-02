'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SectionClientPage } from '@/components/shared/SectionClientPage';
import { CardGrid, LinkCard } from '@/components/sections';

interface Destination {
  id: number;
  heroImage: string;
  name: string;
  description: string;
  slug: string;
}

interface PracticalTip {
  icon: IconDefinition;
  title: string;
  text: string;
  link: string;
}

const itineraryLinks = [
  {
    href: '/itineraires-philippines',
    title: 'Itinéraires publiés',
    desc: 'Parcourez nos itinéraires jour par jour, prêts à suivre, rédigés par notre équipe.',
  },
  {
    href: '/itineraire-personnalise-pour-les-philippines',
    title: 'Itinéraire personnalisé IA',
    desc: 'Répondez à quelques questions, recevez un parcours sur-mesure en 30 secondes.',
  },
];

export const VoyagerClientPage = ({ initialDestinations, practicalTips }: { initialDestinations: Destination[], practicalTips: PracticalTip[] }) => {
  const renderCard = (dest: Destination) => (
    <LinkCard
      href={`/voyager-aux-philippines/${dest.slug}`}
      title={dest.name}
      desc={dest.description}
      cta={`Explorer ${dest.name}`}
      image={{
        src: dest.heroImage || '/imagesHero/comment-voyager-aux-philippines.webp',
        alt: dest.name,
      }}
    />
  );

  return (
    <SectionClientPage
      initialCategories={initialDestinations}
      renderCard={renderCard}
      footer={
        <div className="mt-16 flex flex-col gap-16">
          <CardGrid
            title="Préparer son"
            titleAccent="voyage"
            subtitle="Les essentiels à connaître avant de partir : météo, budget, transport, santé et communication."
            columns={3}
          >
            {practicalTips.map((tip) => (
              <LinkCard
                key={tip.link}
                href={tip.link}
                title={tip.title}
                desc={tip.text}
                icon={<FontAwesomeIcon icon={tip.icon} className="text-[18px]" />}
              />
            ))}
          </CardGrid>

          <CardGrid
            title="Itinéraires"
            titleAccent="Philippines"
            subtitle="Un point de départ tout prêt ou un parcours entièrement sur-mesure : à vous de choisir."
            columns={2}
          >
            {itineraryLinks.map((item) => (
              <LinkCard key={item.href} href={item.href} title={item.title} desc={item.desc} cta="Découvrir" />
            ))}
          </CardGrid>
        </div>
      }
    >
      <h1 className="text-4xl font-bold text-center mb-4">Voyager aux <span className="text-accent">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
        Explorez la beauté et la diversité de l&apos;archipel, des plages de rêve aux volcans majestueux.
      </p>

      <div className="pb-10">
        <h2 className="text-3xl font-bold mb-2 text-center">Les destinations <span className="text-accent">incontournables</span></h2>
        <p className="text-center text-muted-foreground mb-6">Chaque région regroupe le guide de référence et tous nos articles.</p>
      </div>
    </SectionClientPage>
  );
};
