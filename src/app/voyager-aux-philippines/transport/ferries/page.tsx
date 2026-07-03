import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Ship, Anchor, LifeBuoy, Ticket } from 'lucide-react';
import { PageHero, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Guide des Ferries aux Philippines",
  description: "Naviguez entre les îles des Philippines en ferry. Découvrez les principales compagnies, les types de bateaux, et nos conseils pour un voyage sûr et agréable.",
};

// FAQ 100 % factuelle — reformule les compagnies, types de bateaux et
// conseils déjà détaillés plus haut sur la page. Feed le visible ET le
// FAQPage schema via <FaqAccordion withSchema>.
const FERRIES_FAQS = [
  {
    q: 'Quelles sont les principales compagnies de ferry aux Philippines ?',
    a: "2GO Travel est la plus grande compagnie de ferries du pays : elle dessert les principales îles avec de grands navires confortables, couchettes et restaurants inclus, idéale pour les longues distances comme Manille-Cebu. OceanJet, elle, se spécialise dans les trajets rapides entre les îles des Visayas (Cebu, Bohol, Siquijor) grâce à des catamarans modernes.",
  },
  {
    q: 'Quels types de bateaux circulent entre les îles ?',
    a: "Trois familles se partagent l'archipel : les ferries lents de type RORO (Roll-on/Roll-off), économiques et adaptés aux longs trajets de nuit ; les Fast Crafts, des catamarans rapides pour les trajets de 1 à 4 heures ; et les bangkas, ces bateaux traditionnels à balancier utilisés pour l'island hopping et les courts trajets côtiers.",
  },
  {
    q: 'Faut-il réserver son billet de ferry à l\'avance ?',
    a: "Oui, il est conseillé de réserver en ligne à l'avance, surtout en haute saison. Des sites comme 12Go Asia sont pratiques pour comparer les options. Prévoyez aussi d'arriver au port au moins une heure avant le départ.",
  },
  {
    q: 'Le ferry est-il un moyen sûr de voyager aux Philippines ?',
    a: "Oui, à condition de choisir des compagnies réputées. Pensez aussi à prévoir une veste, car la climatisation à bord est souvent forte, et à garder vos objets de valeur avec vous.",
  },
  {
    q: 'Pourquoi voyager en ferry plutôt qu\'en avion aux Philippines ?',
    a: "Le ferry est une option économique et pittoresque, qui offre une véritable immersion dans la vie locale. C'est un moyen incontournable pour explorer la diversité des 7 641 îles de l'archipel, à un rythme différent de l'avion.",
  },
];

/* -------------------------------------------------------------------------- */
/* En-tête de section : eyebrow uppercase + h2 avec UN mot en amber vif.       */
/* Repris à l'identique du pattern validé sur                                  */
/* /vivre-aux-philippines/visas-et-formalites.                                 */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) => (
  <div className="max-w-2xl">
    <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2
      className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
      style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
    >
      {title}
      {accent && (
        <>
          {' '}
          <span className="text-accent">{accent}</span>
        </>
      )}
    </h2>
    {description && (
      <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{description}</p>
    )}
  </div>
);

const FerriesPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Voyager en"
        titleAccent="Ferry"
        subtitle="L'aventure inter-îles au rythme des vagues. Le guide complet pour naviguer dans l'archipel."
        imageUrl="/images/transport/ferry-sur-mer-calme.webp"
        imageAlt="Voyager en Ferry"
      />

      {/* Vue d'ensemble */}
      <section className="bg-background pt-10 md:pt-12 pb-2">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Vue d'ensemble" title="Le ferry, une porte sur" accent="l'archipel" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Le ferry est un moyen de transport incontournable pour explorer la diversité des
            7 641 îles des Philippines. C'est une option économique, pittoresque et une véritable
            immersion dans la vie locale.
          </p>
        </div>
      </section>

      {/* Compagnies */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Qui dessert quoi" title="Les compagnies de" accent="ferry" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Deux noms reviennent le plus souvent une fois sur le pont, selon la distance à
            parcourir et le niveau de confort recherché.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl"><Anchor className="text-primary" />2GO Travel</CardTitle>
              </CardHeader>
              <CardContent>
                <p>La plus grande compagnie de ferries du pays, desservant les principales îles avec de grands navires confortables (couchettes, restaurants). Idéal pour les longues distances (Manille - Cebu, par exemple).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl"><Ship className="text-primary" />OceanJet</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Spécialiste des trajets rapides entre les îles des Visayas (Cebu, Bohol, Siquijor). Leurs catamarans modernes réduisent considérablement les temps de trajet.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types de bateaux */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Rapide, lent ou traditionnel" title="Types de" accent="bateaux" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Trois familles de bateaux se partagent l'archipel, du plus économique au plus rapide.
            Voici comment les distinguer avant de réserver.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <Card><CardContent className="p-6"><strong>Ferries Lents (RORO) :</strong> Roll-on/Roll-off, transportent passagers et véhicules. Économiques, pour les longs trajets de nuit.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Fast Crafts :</strong> Catamarans rapides pour les trajets de 1 à 4 heures.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Bangkas :</strong> Bateaux traditionnels à balancier pour les excursions d'island hopping et les courts trajets côtiers.</CardContent></Card>
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Avant d'embarquer" title="Conseils pour voyager en" accent="ferry" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Un dernier point avant de monter à bord : quelques réflexes simples suffisent pour un
            trajet sans accroc, côté réservation comme côté sécurité.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-3"><Ticket className="text-primary" />Réservation</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  <li>Réservez en ligne à l'avance, surtout en haute saison.</li>
                  <li>Des sites comme 12Go Asia sont pratiques pour comparer.</li>
                  <li>Arrivez au port au moins 1 heure avant le départ.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-3"><LifeBuoy className="text-primary" />Sécurité et Confort</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choisissez des compagnies réputées.</li>
                  <li>Prévoyez une veste, la climatisation est souvent forte.</li>
                  <li>Gardez vos objets de valeur avec vous.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ — visible + FAQPage schema (source unique FERRIES_FAQS) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Vos questions"
            titleAccent="ferry"
            faqs={FERRIES_FAQS}
            withSchema
          />
        </div>
      </section>
    </div>
  );
};

export default FerriesPage;
