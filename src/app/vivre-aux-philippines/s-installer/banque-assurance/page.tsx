import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Landmark, Shield, PiggyBank, Hospital, Info } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Banque et Assurance aux Philippines | Philippineasy",
  description: "Guide pour ouvrir un compte bancaire et choisir une assurance santé aux Philippines. Conseils pour les expatriés.",
};

const BanqueAssurancePage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Banque &"
        titlePart2="Assurance"
        subtitle="Gérer son argent et sa santé sont des étapes clés pour sécuriser votre vie d'expatrié."
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12">Une fois installé, la gestion de vos finances et de votre santé devient une priorité. Ce guide vous oriente sur les démarches pour ouvrir un compte bancaire et choisir une assurance adaptée.</p>

        <h2 className="text-3xl font-bold text-center mb-8">Ouvrir un Compte en Banque</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Landmark className="text-primary" />Les Banques Populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les banques les plus recommandées pour les expatriés sont :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>BDO (Banco de Oro)</strong>: Le plus grand réseau d'agences et de distributeurs.</li>
                <li><strong>BPI (Bank of the Philippine Islands)</strong>: Très réputée et fiable.</li>
                <li><strong>Metrobank</strong>: Une autre excellente option avec de nombreux services.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><PiggyBank className="text-primary" />Procédure et Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pour ouvrir un compte en tant qu'étranger, vous aurez besoin de votre <strong>ACR I-Card</strong> (Alien Certificate of Registration), qui est votre carte de résident. Les autres documents habituellement demandés sont :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Passeport et visa en cours de validité.</li>
                <li>Justificatif de domicile (facture, contrat de location).</li>
                <li>Photos d'identité.</li>
                <li>Un dépôt initial (de 2 000 à 10 000 PHP selon la banque).</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Le Système de Santé et les Assurances</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Hospital className="text-primary" />Hôpitaux de Référence</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les grandes villes disposent d'hôpitaux de standard international :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>St. Luke's Medical Center</strong> (Quezon City et BGC)</li>
                <li><strong>Makati Medical Center</strong> (Makati)</li>
                <li><strong>The Medical City</strong> (Pasig)</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Shield className="text-primary" />Choisir une Assurance Santé</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Il est crucial d'être bien couvert. Voici les options :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>PhilHealth :</strong> Le système national, couverture basique.</li>
                <li><strong>Assurances privées :</strong> Indispensable pour une bonne couverture. Des assureurs internationaux comme <a href="https://www.axa.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AXA</a>, <a href="https://www.cignaglobal.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cigna Global</a> ou <a href="https://www.allianz.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Allianz Care</a> sont des choix populaires auprès des expatriés.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BanqueAssurancePage;
