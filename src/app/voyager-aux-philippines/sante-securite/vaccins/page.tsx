import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Syringe, ShieldCheck, AlertTriangle, Clock, Stethoscope } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Vaccins pour les Philippines | Guide de Santé du Voyageur",
  description: "Le guide complet sur les vaccins recommandés et obligatoires pour un voyage aux Philippines. Préparez votre voyage en toute sérénité.",
};

const VaccinsPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Guide des"
        titlePart2="Vaccins"
        subtitle="Préparez votre voyage aux Philippines en toute sérénité en vous assurant d'être à jour avec les vaccins recommandés."
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <Stethoscope className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Consultez votre médecin</h3>
            <p>Ce guide est informatif. Il est essentiel de consulter votre médecin traitant ou un centre de vaccinations internationales au moins 4 à 6 semaines avant votre départ pour des conseils personnalisés.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Vaccins Recommandés</h2>
        
        <div className="space-y-12">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><ShieldCheck className="text-primary" />Vaccins Universels (DTCP)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Assurez-vous que vos vaccins de base sont à jour. Ces maladies sont présentes partout dans le monde.</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Diphtérie, Tétanos, Coqueluche, Poliomyélite :</strong> Un rappel est recommandé tous les 10 ans.</li>
                <li><strong>Hépatite B :</strong> Recommandé pour les séjours longs ou fréquents.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><Syringe className="text-primary" />Vaccins Spécifiques au Voyage</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Ces vaccins sont fortement recommandés en raison des risques sanitaires spécifiques aux Philippines.</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Hépatite A :</strong> Très recommandée. La transmission se fait par l'eau et les aliments contaminés. Une injection 15 jours avant le départ.</li>
                <li><strong>Fièvre Typhoïde :</strong> Recommandée, surtout pour les séjours longs ou dans des conditions d'hygiène précaires. Une injection 15 jours avant le départ.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><AlertTriangle className="text-primary" />Vaccins Additionnels (selon les conditions)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Ces vaccins peuvent être nécessaires en fonction de la durée de votre séjour, des régions visitées et de vos activités.</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Rage :</strong> Recommandé pour les séjours longs, en zone rurale, ou pour les voyageurs ayant des activités à risque (randonnée, spéléologie). Vaccination préventive en 3 injections.</li>
                <li><strong>Encéphalite Japonaise :</strong> Recommandé pour les séjours de plus d'un mois en zone rurale, surtout pendant la saison des pluies. Schéma en 2 injections.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VaccinsPage;
