import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building, FileText, Users, Landmark, Info, DollarSign } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Créer son Entreprise aux Philippines | Philippineasy",
  description: "Guide pour les entrepreneurs étrangers souhaitant créer leur entreprise aux Philippines : structures juridiques, étapes et conseils.",
};

const CreerEntreprisePage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Créer son"
        titlePart2="Entreprise"
        subtitle="Du concept à l'immatriculation, découvrez les étapes clés pour lancer votre activité aux Philippines."
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Pourquoi Entreprendre aux Philippines ?</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">Avec une économie en croissance rapide et une main-d'œuvre jeune et anglophone, les Philippines offrent un environnement propice à l'entrepreneuriat, notamment dans les secteurs de la tech, du tourisme et des services.</p>

        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Propriété Étrangère</h3>
            <p>Dans de nombreux secteurs, il est possible pour un étranger de détenir 100% de son entreprise. Cependant, certains domaines comme les médias ou le commerce de détail sont restreints. Il est fortement recommandé de consulter un avocat local pour valider votre projet.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Choisir sa Structure Juridique</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Corporation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Similaire à une SARL ou SA. Nécessite 5 à 15 fondateurs. La responsabilité des actionnaires est limitée à leurs apports. C'est la structure la plus courante pour les investisseurs étrangers.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Users className="text-primary" />Société de Personnes (Partnership)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Constituée d'au moins deux associés. La responsabilité peut être limitée ou illimitée selon le type de partenariat. Moins courante pour les étrangers.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><FileText className="text-primary" />Entreprise Individuelle (Sole Proprietorship)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Détenue par une seule personne. Le propriétaire est personnellement responsable des dettes de l'entreprise. Accessible principalement aux citoyens philippins.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Les Étapes de la Création</h2>
        <ol className="list-decimal list-inside space-y-4 max-w-3xl mx-auto">
          <li><strong>Enregistrement auprès de la SEC (Securities and Exchange Commission) :</strong> Pour les corporations et les sociétés de personnes. C'est ici que vous réservez le nom de votre entreprise et déposez les statuts.</li>
          <li><strong>Obtention du Permis d'Exploitation (Business Permit) :</strong> Auprès de la mairie ("City Hall") de la ville où sera basée votre entreprise.</li>
          <li><strong>Enregistrement auprès du BIR (Bureau of Internal Revenue) :</strong> Pour obtenir votre numéro d'identification fiscale (TIN) et l'autorisation d'imprimer des factures.</li>
          <li><strong>Enregistrement des employés :</strong> Si vous embauchez, vous devrez affilier vos employés au SSS (sécurité sociale), PhilHealth (santé) et Pag-IBIG (logement).</li>
        </ol>
        
        <Card className="max-w-4xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><DollarSign className="text-primary" />Coûts et Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Le capital minimum requis pour une "Corporation" avec participation étrangère est généralement de 200 000 $US. Cependant, ce montant peut être réduit à 100 000 $US si l'entreprise est engagée dans des technologies de pointe ou emploie au moins 50 Philippins. Les frais d'enregistrement et de conseil juridique peuvent s'élever à plusieurs milliers d'euros.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreerEntreprisePage;
