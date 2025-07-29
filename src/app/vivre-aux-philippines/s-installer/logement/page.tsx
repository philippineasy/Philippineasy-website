import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Building, MapPin, Search, Users, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Logement aux Philippines | Philippineasy",
  description: "Le guide pour trouver votre logement idéal aux Philippines : condos, maisons, appartements. Conseils et plateformes pour votre recherche.",
};

const LogementPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Trouver un"
        titlePart2="Logement"
        subtitle="Que vous cherchiez un condo moderne à Makati ou une maison avec jardin à Cebu, voici comment trouver le logement de vos rêves."
        imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1974&auto=format&fit=crop"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12">Trouver le bon logement est une étape essentielle pour une expatriation réussie. Le marché immobilier philippin est varié et offre des options pour tous les budgets et styles de vie.</p>

        <h2 className="text-3xl font-bold text-center mb-8">Les Types de Logements Courants</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Condominiums</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Très populaires auprès des expatriés, surtout dans les grandes villes. Ils offrent sécurité (gardien 24/7), et des commodités comme une piscine, une salle de sport, etc. Idéal pour une première installation.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Home className="text-primary" />Maisons (House & Lot)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Si vous cherchez plus d'espace, une maison avec un petit jardin ("lot") est une excellente option. On les trouve souvent dans des lotissements sécurisés appelés "subdivisions" ou "villages".</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Appartements</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Plus simples que les condos, les appartements sont une option plus économique. Les commodités sont plus rares, mais les loyers sont souvent plus bas.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Où et Comment Chercher ?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Search className="text-primary" />Plateformes en Ligne</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Des sites comme <strong>Lamudi</strong> ou <strong>DotProperty</strong> sont des incontournables. Voici des liens directs :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><a href="https://www.lamudi.com.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lamudi Philippines</a></li>
                <li><a href="https://www.dotproperty.com.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dot Property Philippines</a></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Users className="text-primary" />Réseaux Sociaux et Communautés</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Facebook Marketplace</strong> est très utilisé. Cherchez aussi des groupes comme "Manila Expats Housing" ou "Cebu Apartments for Rent".</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Contacter les Propriétaires et Agents</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><MessageSquare className="text-primary" />Exemple de message de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic bg-gray-50 p-4 rounded-lg">
              "Hello, I saw your ad for the [type of property, e.g., 1-bedroom condo] in [location, e.g., BGC] on [platform, e.g., Lamudi]. I'm interested in learning more. Is it still available? When would it be possible to schedule a viewing? Thank you!"
            </p>
            <p className="mt-4"><strong>Conseil :</strong> Soyez clair, concis et poli. Mentionnez où vous avez vu l'annonce. La plupart des communications se font en anglais.</p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Exemples de Biens Immobiliers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Exemple 1 : Condo à Makati</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Type :</strong> Studio</p>
              <p><strong>Lieu :</strong> Bel-Air, Makati</p>
              <p><strong>Taille :</strong> 30 m²</p>
              <p><strong>Prix :</strong> ~35 000 PHP/mois (charges comprises)</p>
              <p><strong>Caractéristiques :</strong> Entièrement meublé, vue sur la ville, parking inclus.</p>
              <p><strong>Conditions :</strong> 1 an de location minimum, 1 mois d'avance, 2 mois de dépôt de garantie.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exemple 2 : Maison à Cebu</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Type :</strong> Maison 2 chambres</p>
              <p><strong>Lieu :</strong> Subdivision près de IT Park, Cebu City</p>
              <p><strong>Taille :</strong> 80 m²</p>
              <p><strong>Prix :</strong> ~45 000 PHP/mois</p>
              <p><strong>Caractéristiques :</strong> Non meublée, petit jardin, sécurité 24/7.</p>
              <p><strong>Conditions :</strong> 1 an de location minimum, 2 mois d'avance, 2 mois de dépôt de garantie.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogementPage;
