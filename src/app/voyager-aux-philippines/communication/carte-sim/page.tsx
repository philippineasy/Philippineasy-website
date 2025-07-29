import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Wifi, Globe, Smartphone } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Carte SIM aux Philippines | Guide pour les Touristes",
  description: "Restez connecté aux Philippines. Guide complet pour choisir votre carte SIM prépayée chez Globe ou Smart, et comparer les forfaits data.",
};

const CarteSimPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Carte SIM"
        titlePart2="Locale"
        subtitle="Le guide essentiel pour acheter votre carte SIM dès votre arrivée et rester connecté à petit prix."
        imageUrl="/images/communication/personne-avec-telephone.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Acheter une carte SIM locale est la solution la plus simple et économique pour avoir internet et passer des appels aux Philippines. Voici comment faire.</p>

        <h2 className="text-3xl font-bold text-center mb-8">Les Principaux Opérateurs</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Globe className="text-primary" />Globe Telecom</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Très populaire, avec une excellente couverture dans la plupart des zones touristiques. Propose des forfaits "Go" et "Go+" avec de bonnes allocations de data.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Smartphone className="text-primary" />Smart Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>L'autre géant des télécoms, réputé pour avoir le réseau 4G/5G le plus rapide du pays. Leurs forfaits "Giga" sont très compétitifs.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Où Acheter et Comment S'enregistrer ?</h2>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <ul className="list-disc list-inside space-y-2">
              <li><strong>A l'aéroport :</strong> Le plus simple. Des stands Globe et Smart vous attendent dès la sortie de la douane. Le personnel vous aidera à installer et enregistrer la SIM.</li>
              <li><strong>En ville :</strong> Dans les boutiques officielles, les supermarchés (7-Eleven, etc.) ou chez les vendeurs de rue.</li>
              <li><strong>Enregistrement obligatoire :</strong> Depuis 2023, il est obligatoire d'enregistrer sa SIM en ligne avec son passeport. C'est une procédure simple qui se fait via le site de l'opérateur.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Exemples de Forfaits (Promo)</h2>
        <p className="text-center mb-4">Les offres changent souvent, mais voici une idée des forfaits "promo" que vous pouvez charger :</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader><CardTitle>Globe "Go+"</CardTitle></CardHeader>
            <CardContent>
              <p><strong>Go+99 :</strong> 8 Go de data + 8 Go pour les applis de votre choix, valable 7 jours (environ 1.60€).</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Smart "Giga Power"</CardTitle></CardHeader>
            <CardContent>
              <p><strong>Giga Power 99 :</strong> 2 Go de data par jour + 6 Go de data, valable 7 jours (environ 1.60€).</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarteSimPage;
