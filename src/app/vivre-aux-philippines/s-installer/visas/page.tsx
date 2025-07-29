import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, XCircle, FileText, Briefcase, GraduationCap, Home, Landmark, Info } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Les Visas pour s'installer aux Philippines | Philippineasy",
  description: "Le guide complet sur les différents types de visas pour vivre, travailler, étudier ou prendre sa retraite aux Philippines. Découvrez les démarches et les conditions.",
};

const VisasPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Le Guide des"
        titlePart2="Visas"
        subtitle="Toutes les clés pour comprendre les démarches et choisir le bon visa pour votre projet d'expatriation aux Philippines."
        imageUrl="/imagesHero/visa-philippines-processus.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12">L'obtention d'un visa est une étape cruciale et souvent la première de votre projet d'expatriation aux Philippines. Le type de visa dont vous aurez besoin dépend de la durée et du but de votre séjour. Ce guide vous aidera à y voir plus clair.</p>

        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Information Importante</h3>
            <p>Les informations sur les visas changent régulièrement. Pour des données à jour, consultez toujours le site officiel de l'<a href="https://parispe.dfa.gov.ph/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ambassade des Philippines en France</a> et du <a href="https://immigration.gov.ph/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bureau de l'Immigration des Philippines</a>.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Exemption de Visa pour les courts séjours</h2>
        <div className="flex items-start space-x-4 bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl mx-auto">
          <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Bonne nouvelle pour les touristes !</h3>
            <p>Les citoyens français (et de 156 autres nationalités) n'ont pas besoin de visa pour un séjour touristique de <strong>30 jours maximum</strong>. Il vous suffit de présenter un passeport valide au moins 6 mois après la date de votre retour et un billet d'avion de sortie du territoire philippin.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Les Principaux Types de Visas pour un Long Séjour</h2>
        
        <div className="space-y-12">
          {/* Visa Touriste */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><FileText className="text-primary" />Visa de Tourisme (9A)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Idéal pour les séjours prolongés au-delà de 30 jours. Il permet de rester jusqu'à 59 jours initialement, et est renouvelable sur place.</p>
              <h4 className="font-semibold mt-4">Coûts :</h4>
              <p>Environ 30€ pour la demande initiale de 59 jours. Les extensions sur place varient de 2 000 à 3 000 PHP par mois.</p>
              <h4 className="font-semibold mt-4">Documents Requis :</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Passeport valide au moins 6 mois.</li>
                <li>Formulaire de demande de visa.</li>
                <li>Deux photos d'identité.</li>
                <li>Preuve de vaccination (vérifier les exigences actuelles).</li>
                <li>Enregistrement sur le portail eTravel.</li>
                <li>Billet d'avion de retour ou de continuation.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Visa de Retraite */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><Home className="text-primary" />Visa de Retraite (SRRV)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Le "Special Resident Retiree's Visa" est un programme très populaire qui permet une résidence permanente.</p>
              <h4 className="font-semibold mt-4">Dépôt Bancaire Requis :</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Avec pension :</strong> 10 000 $US de dépôt pour les 50 ans et plus, avec une pension mensuelle de 800 $ (célibataire) ou 1 000 $ (couple).</li>
                <li><strong>Sans pension :</strong> 20 000 $US de dépôt pour les 50 ans et plus. 50 000 $US pour les 35-49 ans.</li>
              </ul>
              <h4 className="font-semibold mt-4">Avantages :</h4>
              <p>Permet de résider indéfiniment, d'entrer et sortir du pays librement, et d'être exempté de certains frais et taxes.</p>
              <a href="http://www.pra.gov.ph/main/srrv_program?page=1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-4 inline-block">En savoir plus sur le site du PRA →</a>
            </CardContent>
          </Card>

          {/* Visa de Travail */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-3 text-2xl"><Briefcase className="text-primary" />Visa de Travail (9G)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">Nécessaire pour tout étranger souhaitant occuper un emploi rémunéré aux Philippines.</p>
              <h4 className="font-semibold mt-4">Procédure :</h4>
              <p>Ce visa doit être initié par votre employeur aux Philippines. La première étape est d'obtenir un "Alien Employment Permit" (AEP) auprès du Département du Travail et de l'Emploi (DOLE).</p>
              <h4 className="font-semibold mt-4">Validité :</h4>
              <p>Généralement lié à la durée de votre contrat de travail, de 1 à 3 ans, renouvelable.</p>
              <h4 className="font-semibold mt-4">Coûts :</h4>
              <p>Les coûts sont généralement pris en charge par l'employeur et peuvent s'élever à plusieurs centaines d'euros, incluant les frais pour l'AEP et le visa lui-même.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisasPage;
