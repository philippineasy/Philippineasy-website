import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShieldCheck, MapPin, Wifi, Phone, UserCheck, AlertTriangle } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sécurité aux Philippines | Conseils pour les Voyageurs",
  description: "Guide complet sur la sécurité aux Philippines : zones à éviter, bonnes pratiques, sécurité numérique et contacts d'urgence.",
};

const ConseilsSecuritePage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Sécurité aux"
        titlePart2="Philippines"
        subtitle="Nos conseils pour un voyage serein et inoubliable."
        imageUrl="/images/sante/controle-police-philippines.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Les Philippines sont une destination de rêve et globalement sûre. Chaque année, des millions de visiteurs profitent de ses merveilles sans aucun souci. Cependant, comme partout, la prudence est de mise. Voici tout ce que vous devez savoir pour voyager en toute tranquillité.</p>

        <h2 className="text-3xl font-bold text-center mb-8">Zones Sûres et à Éviter</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-800"><ShieldCheck />Zones les plus sûres</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les lieux les plus fréquentés par les touristes sont aussi les plus sécurisés :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cebu City et ses plages de Mactan</li>
                <li>Palawan (El Nido, Coron) 🏝️</li>
                <li>Bohol (Chocolate Hills, Panglao)</li>
                <li>Siargao (surf, nature et ambiance relax)</li>
                <li>Iloilo, Dumaguete, Davao : villes calmes et bien gérées.</li>
              </ul>
              <p className="mt-4 text-sm"><strong>Police touristique :</strong> Présente dans ces zones pour vous assister.</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-red-800"><AlertTriangle />Zones à éviter</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Certaines régions sont formellement déconseillées (niveau 4/4 selon France Diplomatie) :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Le centre et l’ouest de l’île de Mindanao (Marawi, Cotabato, Zamboanga)</li>
                <li>L’archipel de Sulu (Jolo, Tawi-Tawi)</li>
                <li>Certaines zones rurales isolées de Lanao del Sur</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Bonnes Pratiques pour un Séjour Serein</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card><CardContent className="p-6"><strong>Objets de valeur :</strong> Évitez de montrer vos gadgets dernier cri en public.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Foule :</strong> Restez attentif dans les marchés et les transports.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Transport :</strong> Utilisez Grab, Angkas ou les taxis d’hôtels.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Argent liquide :</strong> Ne gardez pas tout sur vous, répartissez-le.</CardContent></Card>
          <Card><CardContent className="p-6"><strong>Sorties nocturnes :</strong> Évitez les ruelles mal éclairées seul(e).</CardContent></Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Sécurité Numérique et Contacts d'Urgence</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><Wifi className="text-primary" />Wi-Fi Public</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                <li>Utilisez un VPN (NordVPN, ProtonVPN, etc.).</li>
                <li>Ne vous connectez pas à votre banque sans protection.</li>
                <li>Ne laissez pas votre téléphone sans surveillance.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><Phone className="text-primary" />En Cas de Problème</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Police locale :</strong> 117 ou 911</li>
                <li><strong>Ambassade de France :</strong> (+63) 2 8851 58 00</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Checklist de Sécurité</h2>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <ul className="space-y-2">
              <li className="flex items-center"><UserCheck className="text-green-500 mr-3" />Photocopies ou scans de vos documents importants.</li>
              <li className="flex items-center"><UserCheck className="text-green-500 mr-3" />Adresse de votre hôtel sur vous.</li>
              <li className="flex items-center"><UserCheck className="text-green-500 mr-3" />Applis utiles : Grab, Google Maps, Maps.me.</li>
              <li className="flex items-center"><UserCheck className="text-green-500 mr-3" />Appli eTravel obligatoire à l’arrivée.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConseilsSecuritePage;
