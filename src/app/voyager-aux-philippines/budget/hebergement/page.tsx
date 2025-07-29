import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faBed, faHotel, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Hébergement aux Philippines : Guide des Prix et Conseils',
  description: 'Découvrez le coût de l\'hébergement aux Philippines, des auberges de jeunesse conviviales aux hôtels de luxe. Ce guide vous aidera à trouver le logement idéal pour votre budget.',
};

const HebergementPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <HeroThematic
        titlePart1="Se Loger aux Philippines"
        titlePart2="Pour Tous les Budgets"
        titlePart2Color="accent"
        subtitle="Des auberges de jeunesse animées aux resorts de luxe, trouvez l'hébergement parfait pour votre voyage."
        imageUrl="/imagesHero/hutte-philippines.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary">Prix Moyens par Nuit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faBed} value="8-15€" label="Dortoir en Auberge" color="accent" />
            <KeyStatCard icon={faHouseUser} value="20-40€" label="Chambre Double Simple" color="primary" />
            <KeyStatCard icon={faHotel} value="100€+" label="Hôtel de Luxe" color="accent" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-accent text-center mb-10">Types d'Hébergement en un Coup d'œil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Dortoir', desc: '8–15€ / nuit', img: '/images/budget/dortoir-auberge-jeunesse.webp' },
            { name: 'Chambre double', desc: '20–40€', img: '/images/budget/chambre-vue-mer.webp' },
            { name: 'Appart’hôtel', desc: '50–80€', img: '/images/budget/apparthotel-coquet.webp' },
            { name: 'Resort luxe', desc: '100€+', img: '/images/budget/resort-de-luxe-philippines.webp' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <Image src={item.img} alt={item.name} width={100} height={100} className="rounded-full shadow-md mb-2" />
              <p className="font-semibold text-base">{item.name}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop"
        imageAlt="Piscine d'un hôtel de luxe"
      >
        <h2 className="text-3xl font-bold text-accent">Les Auberges de Jeunesse : Convivialité et Économies</h2>
        <p className="text-lg leading-relaxed">Après quelques heures de bus sur les routes de montagne de Luzon, quoi de mieux qu’un lit en dortoir pour reposer son dos, et un rooftop pour siroter une bière avec d'autres voyageurs ? Les auberges philippines allient simplicité et rencontres inoubliables.</p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-base">
          <li><b>Prix :</b> Très abordables, surtout en dortoir partagé.</li>
          <li><b>Ambiance :</b> Idéales pour socialiser et partager des expériences.</li>
          <li><b>Conseil :</b> Réservez à l'avance en haute saison.</li>
          <li><b>Exemples :</b> Mad Monkey, Spin Hostel, The Circle Hostel.</li>
        </ul>
        <Link href="/voyager-aux-philippines/budget" className="text-accent font-bold hover:underline mt-4 inline-block">Retour au budget →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
          imageAlt="Chambre d'hôtel confortable"
          reverse
        >
          <h2 className="text-3xl font-bold text-accent">Hôtels et Resorts : Confort et Services</h2>
          <p className="text-lg leading-relaxed">Que vous soyez digital nomad ou en lune de miel, les hôtels philippins couvrent tous les besoins : climatisation, piscine, service de chambre… Le luxe reste accessible dans bien des provinces.</p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-base">
            <li><b>Guesthouses :</b> Chambres simples et propres à prix doux.</li>
            <li><b>Hôtels de gamme moyenne :</b> Bon rapport qualité/prix.</li>
            <li><b>Resorts de luxe :</b> Vue mer, spa, salle de sport, tout y est.</li>
          </ul>
          <Link href="/voyager-aux-philippines/budget/nourriture" className="text-accent font-bold hover:underline mt-4 inline-block">Voir le guide de la nourriture →</Link>
        </AlternatingContent>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary mb-6">Conseils Locaux & Astuces</h2>
        <ul className="list-disc list-inside space-y-3 text-base">
          <li><b>Sites à privilégier :</b> Booking.com, Agoda, Airbnb pour les séjours longs.</li>
          <li><b>Internet :</b> Vérifiez la qualité du Wifi si vous travaillez en ligne.</li>
          <li><b>Sécurité :</b> Préférez les quartiers centraux, surtout à Manille ou Cebu.</li>
          <li><b>Électricité :</b> Certaines guesthouses n'ont pas de générateur lors des coupures. Demandez avant.</li>
        </ul>
      </div>

      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-accent mb-6">Comparatif rapide</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-left shadow-md rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Prix moyen</th>
                  <th className="px-6 py-3">Idéal pour</th>
                  <th className="px-6 py-3">Avantages</th>
                  <th className="px-6 py-3">Inconvénients</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t">
                  <td className="px-6 py-4">Auberge</td>
                  <td className="px-6 py-4">8–15€</td>
                  <td className="px-6 py-4">Backpackers</td>
                  <td className="px-6 py-4">Rencontres, petit prix</td>
                  <td className="px-6 py-4">Moins d’intimité</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Chambre double</td>
                  <td className="px-6 py-4">20–40€</td>
                  <td className="px-6 py-4">Couples, solos</td>
                  <td className="px-6 py-4">Confort abordable</td>
                  <td className="px-6 py-4">Variable selon les zones</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Resort</td>
                  <td className="px-6 py-4">100€+</td>
                  <td className="px-6 py-4">Familles, séjours luxe</td>
                  <td className="px-6 py-4">Tout confort</td>
                  <td className="px-6 py-4">Coût élevé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HebergementPage;
