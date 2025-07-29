import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, Search, Building, DollarSign, Users, Info } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Emploi Salarié aux Philippines | Philippineasy",
  description: "Guide pour trouver un emploi salarié aux Philippines : secteurs porteurs, plateformes de recherche, salaires et culture du travail.",
};

const EmploiSalariePage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Trouver un Emploi"
        titlePart2="Salarié"
        subtitle="Découvrez les opportunités professionnelles pour les expatriés aux Philippines et comment naviguer sur le marché du travail local."
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
      />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Le Marché de l'Emploi pour les Expatriés</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">Les Philippines offrent de nombreuses opportunités pour les professionnels étrangers, en particulier dans certains secteurs en pleine croissance. La maîtrise de l'anglais est un atout majeur, la langue étant couramment utilisée dans le monde des affaires.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Building className="text-primary" />Secteurs qui Recrutent</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>BPO (Business Process Outsourcing) :</strong> Le plus grand pourvoyeur d'emplois, notamment dans le service client, le support technique et la finance.</li>
                <li><strong>Informatique (IT) :</strong> Développement de logiciels, cybersécurité, analyse de données.</li>
                <li><strong>Enseignement :</strong> Professeurs de langues (français, anglais), enseignants dans les écoles internationales.</li>
                <li><strong>Tourisme et Hôtellerie :</strong> Postes de management dans les hôtels et complexes de luxe.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Search className="text-primary" />Plateformes de Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les plateformes en ligne sont le meilleur moyen de commencer votre recherche :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><a href="https://www.jobstreet.com.ph" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JobStreet</a></li>
                <li><a href="https://ph.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a></li>
                <li><a href="https://www.kalibrr.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kalibrr</a></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><DollarSign className="text-primary" />Salaires et Contrats</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les salaires pour les expatriés sont généralement plus élevés que la moyenne locale, mais varient beaucoup. Un manager en BPO peut espérer entre 80 000 et 150 000 PHP/mois. Les contrats sont le plus souvent des contrats locaux.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mt-12">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Grandes Entreprises qui Recrutent</h3>
            <p>De nombreuses multinationales ont des bureaux aux Philippines et recrutent des expatriés. Pensez à consulter les pages carrière de grands groupes comme Accenture, Concentrix, Sitel, ou des entreprises de la tech comme Google et Microsoft qui ont des présences significatives à Manille.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploiSalariePage;
