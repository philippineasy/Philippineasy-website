import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Building, DollarSign, Landmark, Info, Users } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir dans l'Immobilier aux Philippines | Philippineasy",
  description: "Guide complet pour l'investissement immobilier aux Philippines par les étrangers : lois, types de biens, fiscalité et zones attractives.",
};

const ImmobilierPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Investir dans"
        titlePart2="l'Immobilier"
        subtitle="Découvrez comment les étrangers peuvent investir dans le marché immobilier philippin en pleine croissance."
        imageUrl="/images/investir/vue-condominium-philippines.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">La Règle d'Or de l'Immobilier Philippin</h3>
            <p>La loi philippine est claire : <strong>les étrangers ne peuvent pas posséder de terrain</strong>. Cependant, vous pouvez être propriétaire à 100% du bâtiment construit sur ce terrain. C'est pourquoi l'investissement dans les condominiums est si populaire.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Ce que vous POUVEZ acheter</h2>
        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Condominiums</CardTitle>
            </CardHeader>
            <CardContent>
              <p>C'est l'option la plus simple et la plus sûre pour un investisseur étranger. Vous pouvez posséder une unité de condo en votre nom propre. La loi stipule que les étrangers peuvent posséder jusqu'à 40% des unités d'un projet de condominium.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Contourner la Restriction sur les Terrains</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Home className="text-primary" />Achat via une Société</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Vous pouvez créer une "Corporation" pour acheter un terrain. Cependant, la société doit être détenue à <strong>au moins 60% par des citoyens philippins</strong>. Vous pouvez détenir les 40% restants.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Users className="text-primary" />Mariage avec un citoyen Philippin</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Si vous êtes marié à un citoyen philippin, le terrain peut être enregistré au nom de votre conjoint. En cas de décès, vous pouvez hériter de la propriété.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Fiscalité et Coûts</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><DollarSign className="text-primary" />Frais à prévoir</CardTitle>
          </CardHeader>
          <CardContent>
            <p>L'achat d'un bien immobilier entraîne plusieurs taxes et frais :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Taxe sur les plus-values (payée par le vendeur) :</strong> 6%</li>
              <li><strong>Droit de timbre documentaire :</strong> 1.5%</li>
              <li><strong>Taxe de transfert locale :</strong> 0.5% à 0.75%</li>
              <li><strong>Frais d'enregistrement et de notaire :</strong> environ 1% à 2%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmobilierPage;
