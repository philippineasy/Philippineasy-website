import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { faHome, faUtensils, faSchool, faHeartbeat, faPassport, faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Vivre aux Philippines en Famille | Guide Expatriés",
  description: "Tout ce que vous devez savoir pour vivre aux Philippines en famille : logement, scolarité, santé, budget, conseils pratiques.",
};

const FamilleExpatPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <HeroThematic
        titlePart1="Familles Expatriées"
        titlePart2="aux Philippines"
        subtitle="Un cadre de vie tropical, abordable et multiculturel pour vos enfants."
        imageUrl="/images/famille/famille-condominium-philippines.webp"
      />

      <div className="container mx-auto px-4 py-16 space-y-16">
        <section>
          <h2 className="text-4xl font-bold text-center mb-6 text-primary">Un Nouveau Chapitre Familial</h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12">
            S'expatrier en famille aux Philippines est une aventure excitante. Le pays offre un coût de la vie attractif, une population accueillante et une nature luxuriante. Voici les clés pour réussir votre installation.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FontAwesomeIcon icon={faHome} className="text-primary" />Logement</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Condominiums sécurisés à Manille (700-1200€) ou maisons à Cebu/Davao (400-600€).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FontAwesomeIcon icon={faSchool} className="text-primary" />Scolarité</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Écoles internationales de haut niveau (10k-25k€/an) avec cursus IB, US ou UK.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FontAwesomeIcon icon={faHeartbeat} className="text-primary" />Santé</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hôpitaux privés de qualité. Assurance santé internationale indispensable.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
          imageAlt="Famille heureuse dans une maison moderne"
        >
          <h2 className="text-3xl font-bold text-accent">Budget et Coût de la Vie</h2>
          <p className="text-lg leading-relaxed">Le coût de la vie est un atout majeur. Un budget familial mensuel se situe entre 1 500 € et 3 000 €, incluant toutes les dépenses courantes.</p>
          <table className="w-full mt-4 text-left">
            <tbody>
              <tr className="border-b"><td className="py-2 pr-4">Logement</td><td>600€ - 1500€</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">Nourriture</td><td>350€ - 600€</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">Scolarité</td><td>800€ - 2100€</td></tr>
              <tr><td className="py-2 pr-4">Santé & Loisirs</td><td>250€ - 500€</td></tr>
            </tbody>
          </table>
        </AlternatingContent>

        <div className="bg-muted -mx-4 px-4 py-16">
          <AlternatingContent
            imageUrl="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
            imageAlt="Salle de classe internationale"
            reverse
          >
            <h2 className="text-3xl font-bold text-accent">Éducation Internationale</h2>
            <p className="text-lg leading-relaxed">Les Philippines abritent d'excellentes écoles internationales, principalement à Manille et Cebu. Elles offrent un environnement multiculturel et des programmes reconnus mondialement.</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>International School Manila (ISM)</li>
              <li>British School Manila (BSM)</li>
              <li>Brent International School</li>
            </ul>
            <Link href="/vivre-aux-philippines/etudier/ecoles-internationales" className="text-accent font-bold hover:underline mt-6 inline-block">→ Voir notre guide des écoles</Link>
          </AlternatingContent>
        </div>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">Installation et Vie Quotidienne</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-muted rounded-lg shadow">
              <FontAwesomeIcon icon={faPassport} size="2x" className="text-accent mb-3" />
              <h3 className="font-bold text-xl mb-2">Visas et Administration</h3>
              <p>Les visas 13A (mariage), 9G (travail) ou SRRV (retraite) sont les plus courants. L'ACR Card est obligatoire pour les résidents.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg shadow">
              <FontAwesomeIcon icon={faGlobeAsia} size="2x" className="text-accent mb-3" />
              <h3 className="font-bold text-xl mb-2">Intégration Locale</h3>
              <p>L'anglais est parlé partout. Utilisez Grab pour les déplacements et rejoignez les groupes Facebook d'expatriés pour des conseils.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FamilleExpatPage;
