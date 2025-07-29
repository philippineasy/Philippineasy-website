import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { School, BookOpen, DollarSign, MapPin, Globe, Users, Star } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Les Écoles Internationales aux Philippines | Philippineasy",
  description: "Un guide sur les écoles internationales aux Philippines pour les familles d'expatriés : cursus, coûts et localisation.",
};

const EcolesInternationalesPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <HeroThematic
        titlePart1="Les Écoles"
        titlePart2="Internationales"
        subtitle="Offrez à vos enfants une éducation de classe mondiale dans un environnement multiculturel."
        imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-6 text-primary">Une Éducation de Qualité pour les Familles d'Expatriés</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          Pour les familles d'expatriés, les Philippines offrent un excellent choix d'écoles internationales
          qui préparent les élèves aux meilleures universités du monde, dans un cadre sécurisé et multiculturel.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><BookOpen className="text-primary" />Cursus Proposés</CardTitle>
            </CardHeader>
            <CardContent>
              <p>La plupart des écoles proposent des cursus reconnus internationalement :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Baccalauréat International (IB)</strong></li>
                <li><strong>Cursus Américain (AP)</strong></li>
                <li><strong>Cursus Britannique (IGCSE, A-Levels)</strong></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><DollarSign className="text-primary" />Frais de Scolarité</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les coûts sont similaires aux standards internationaux et peuvent être élevés. Attendez-vous à payer entre <strong>10 000 et 25 000 € par an</strong>, selon l'école et le niveau d'étude.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><MapPin className="text-primary" />Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>La majorité des écoles internationales se trouvent à <strong>Metro Manila</strong>, notamment dans les quartiers de Bonifacio Global City (BGC), Makati et Alabang.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Globe className="text-primary" />Multiculturalisme</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les écoles internationales accueillent des élèves de plus de 30 nationalités différentes, favorisant l’ouverture d’esprit, la tolérance et l’apprentissage des langues étrangères.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Users className="text-primary" />Petits Effectifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les classes sont généralement composées de 10 à 20 élèves, permettant un accompagnement personnalisé et une attention renforcée de la part des enseignants.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Star className="text-primary" />Réputation & Accréditations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les meilleures écoles disposent d’accréditations reconnues (CIS, WASC, IB Organisation) garantissant leur sérieux et leur conformité aux normes internationales.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-20 mb-8 text-accent">Exemples d'Écoles Internationales de Premier Plan</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-4 bg-muted rounded-lg shadow">
            <p><strong><a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">International School Manila (ISM)</a></strong><br/>Située à BGC, c'est l'une des plus anciennes et prestigieuses écoles. Elle propose le cursus IB de la maternelle jusqu’au lycée.</p>
          </div>
          <div className="p-4 bg-muted rounded-lg shadow">
            <p><strong><a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">British School Manila (BSM)</a></strong><br/>Également à BGC, elle suit le curriculum national britannique. Elle met l'accent sur la responsabilité sociale et l’excellence académique.</p>
          </div>
          <div className="p-4 bg-muted rounded-lg shadow">
            <p><strong><a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Brent International School</a></strong><br/>Avec des campus à Manila, Subic et Baguio, Brent offre un environnement scolaire américain et le cursus IB. Réputée pour ses infrastructures sportives.</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/vivre-aux-philippines/famille" className="text-accent font-bold hover:underline text-lg">→ Voir notre guide pour les familles expatriées</Link>
        </div>
      </div>
    </div>
  );
};

export default EcolesInternationalesPage;