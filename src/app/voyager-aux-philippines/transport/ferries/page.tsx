import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Ship, Anchor, LifeBuoy, Ticket } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Guide des Ferries aux Philippines | Philippineasy",
  description: "Naviguez entre les îles des Philippines en ferry. Découvrez les principales compagnies, les types de bateaux, et nos conseils pour un voyage sûr et agréable.",
};

const FerriesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Voyager en"
        titlePart2="Ferry"
        subtitle="L'aventure inter-îles au rythme des vagues. Le guide complet pour naviguer dans l'archipel."
        imageUrl="/images/transport/ferry-sur-mer-calme.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Le ferry est un moyen de transport incontournable pour explorer la diversité des 7 641 îles des Philippines. C'est une option économique, pittoresque et une véritable immersion dans la vie locale.</p>

        <h2 className="text-3xl font-bold text-center mb-8">Les Principales Compagnies de Ferry</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Types de Bateaux</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card><CardContent className="p-6"><strong>Ferries Lents (RORO) :</strong> Roll-on/Roll-off, transportent passagers et véhicules. Économiques, pour les longs trajets de nuit.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Fast Crafts :</strong> Catamarans rapides pour les trajets de 1 à 4 heures.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Bangkas :</strong> Bateaux traditionnels à balancier pour les excursions d'island hopping et les courts trajets côtiers.</CardContent></Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Conseils pour Voyager en Ferry</h2>
        <div className="grid md:grid-cols-2 gap-8">
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
    </div>
  );
};

export default FerriesPage;
