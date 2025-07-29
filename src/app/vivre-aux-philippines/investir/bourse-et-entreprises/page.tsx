import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, TrendingUp, Building, Info } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir en Bourse et dans les Entreprises aux Philippines | Philippineasy",
  description: "Découvrez comment investir à la bourse philippine (PSE) et dans les entreprises locales. Guide pour les investisseurs étrangers.",
};

const BourseEntreprisesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Investir en Bourse"
        titlePart2="et Entreprises"
        subtitle="Explorez les opportunités d'investissement au-delà de l'immobilier, du marché boursier aux entreprises locales."
        imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12">En plus de l'immobilier, les Philippines offrent des opportunités d'investissement attractives en bourse et dans le capital d'entreprises locales, portées par une économie dynamique.</p>

        <h2 className="text-3xl font-bold text-center mb-8">La Bourse Philippine (PSE)</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><TrendingUp className="text-primary" />Le Philippine Stock Exchange (PSE)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Le PSE est le marché boursier national des Philippines. L'indice principal est le <strong>PSEi</strong>, qui suit la performance des 30 plus grandes entreprises cotées.</p>
              <p className="mt-2">Pour un étranger, le moyen le plus simple d'investir est via un courtier en ligne international qui donne accès au marché philippin, ou via un courtier local si vous avez un statut de résident.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Secteurs Porteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Certains secteurs montrent un fort potentiel de croissance :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Services Financiers :</strong> Banques et assurances en pleine expansion.</li>
                <li><strong>Immobilier :</strong> Promoteurs de condominiums et centres commerciaux.</li>
                <li><strong>Consommation :</strong> Entreprises liées à la consommation de la classe moyenne grandissante.</li>
                <li><strong>Technologie :</strong> Un secteur en plein essor, notamment dans les services en ligne.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Investir dans une Entreprise Locale</h2>
        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Une Alternative à la Bourse</h3>
            <p>Investir directement dans une entreprise locale (non cotée) peut être très rentable, mais aussi plus risqué. C'est une option intéressante si vous avez une bonne connaissance du marché local. Comme pour l'achat de terrain, la participation étrangère est généralement limitée à 40% du capital.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BourseEntreprisesPage;
