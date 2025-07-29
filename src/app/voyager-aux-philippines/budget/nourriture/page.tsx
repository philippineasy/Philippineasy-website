import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faStreetView, faStore, faCocktail, faDrumstickBite, faEgg, faTint, faFeatherAlt, faIceCream, faLeaf, faGlassWhiskey, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Manger aux Philippines : Guide des Prix et de la Street Food',
  description: 'Découvrez le coût de la nourriture aux Philippines, de la street food savoureuse aux restaurants locaux. Ce guide vous aidera à bien manger sans vous ruiner.',
};

const NourriturePage = () => {
  return (
    <div className="bg-white text-gray-800">
      <HeroThematic
        titlePart1="Manger aux Philippines"
        titlePart2="Un Festin Abordable"
        titlePart2Color="accent"
        subtitle="Saveurs, sourires et surprises à chaque coin de rue. Voici comment vous régaler sans exploser votre budget."
        imageUrl="https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary">La Cuisine Philippine en Bref</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faStreetView} value="Moins de 1€" label="Prix de la Street Food" color="accent" />
            <KeyStatCard icon={faStore} value="2-4€" label="Repas en Carinderia" color="primary" />
            <KeyStatCard icon={faCocktail} value="~1€" label="Bière Locale" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/nourriture/street-food-philippine.webp"
        imageAlt="Assortiment coloré de brochettes philippine vendues dans un stand de rue en soirée"
      >
        <h2 className="text-3xl font-bold text-accent">La Street Food : Un Festin à Petit Prix</h2>
        <p className="text-lg leading-relaxed">Vous marchez dans une ruelle animée, l’odeur de barbecue vous attire… Bienvenue dans l’univers inimitable de la street food philippine. Pour quelques pesos, vous pouvez déguster une variété de brochettes, de fritures et de douceurs locales.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {[
            { name: 'Isaw', desc: 'Intestin grillé (PHP 10-15)', img: '/images/nourriture/plat-philippin-isaw.webp' },
            { name: 'Kwek Kwek', desc: 'Œufs de caille frits (PHP 10-15)', img: '/images/nourriture/kwek-kwek-delicieux.webp' },
            { name: 'Betamax', desc: 'Sang coagulé grillé (PHP 10-15)', img: '/images/nourriture/plat-betamax-philippines.webp' },
            { name: 'Balut', desc: 'Œuf de canard fécondé (PHP 20-30)', img: '/images/nourriture/balut-des-philippines.webp' },
            { name: 'Taho', desc: 'Tofu sucré chaud', img: '/images/nourriture/plat-philippines-taho.webp' },
            { name: 'Banana Cue', desc: 'Banane caramélisée', img: '/images/nourriture/banana-cue-philippines.webp' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <Image src={item.img} alt={item.name} width={100} height={100} className="rounded-full shadow-md mb-2" />
              <p className="font-semibold text-base">{item.name}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="bg-primary/10 p-4 rounded-lg mt-8 text-sm italic shadow-sm">
          💡 La street food philippine est souvent servie avec une sauce au vinaigre et piment. N’hésitez pas à demander “konting sili lang” (juste un peu de piment) si vous n’êtes pas fan du piquant !
        </p>
        <Link href="/voyager-aux-philippines/budget" className="text-accent font-bold hover:underline mt-6 inline-block">Retour au budget →</Link>
      </AlternatingContent>

      <div className="bg-muted py-20">
        <AlternatingContent
          imageUrl="/images/nourriture/carinderia-locale-animee.webp"
          imageAlt="Intérieur d'une carinderia philippine avec plats maison dans des marmites"
          reverse
        >
          <h2 className="text-3xl font-bold text-accent">Les Carinderias : Manger comme un Local</h2>
          <p className="text-lg leading-relaxed">Dans tous les barangays, les <b>carinderias</b> sont le cœur battant de la cuisine locale. Pas de menu papier, juste un comptoir en inox, une rangée de marmites et un grand sourire pour vous accueillir.</p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-base">
            <li><b>Adobo :</b> Viande marinée dans du vinaigre, ail et sauce soja.</li>
            <li><b>Sinigang :</b> Soupe aigre traditionnelle à base de tamarin.</li>
            <li><b>Lechon :</b> Cochon de lait rôti croustillant à souhait.</li>
            <li><b>Kare-Kare :</b> Ragoût de queue de bœuf et légumes dans une sauce aux cacahuètes.</li>
            <li><b>Gulay :</b> Plats de légumes sautés, pour les végétariens.</li>
          </ul>
          <p className="bg-accent/10 p-4 rounded-lg mt-4 text-sm italic">
            💬 Vous êtes végétarien ? Demandez “gulay lang” ou “no meat please”, certaines carinderias s’adaptent volontiers.
          </p>
          <Link href="/voyager-aux-philippines/budget/hebergement" className="text-accent font-bold hover:underline mt-6 inline-block">Voir le guide de l'hébergement →</Link>
        </AlternatingContent>
      </div>

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-1598511721105-fbcf4f484905?q=80&w=1974&auto=format&fit=crop"
        imageAlt="Touriste mangeant dans une échoppe locale"
      >
        <h2 className="text-3xl font-bold text-primary">Faut-il craindre la Street Food ? Pas tant que ça</h2>
        <p className="text-lg leading-relaxed">La plupart des voyageurs n’ont <b>aucun souci à manger local</b> aux Philippines. Quelques conseils simples suffisent :</p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-base">
          <li>Choisissez des stands fréquentés, surtout aux heures de pointe</li>
          <li>Privilégiez les plats bien cuits (grillés, frits)</li>
          <li>Évitez l’eau du robinet : buvez en bouteille</li>
        </ul>
        <p className="mt-4 text-base">Et surtout, <b>ne passez pas à côté du plaisir de manger avec les locaux</b> ! C’est souvent autour d’un plat qu’on tisse les plus beaux souvenirs.</p>
      </AlternatingContent>

      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">📍 Où trouver les meilleures zones de Street Food ?</h2>
          <p className="mb-6 text-base">Voici une carte interactive des quartiers réputés pour manger sur le pouce, à Manille, Cebu ou encore Davao :</p>
          <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=1PDDWbcbSaYhcGshzTNoQCKblWc4uElE&ehbc=2E312F" 
            width="100%" 
            height="480" 
            className="rounded-xl shadow-md border border-gray-200"
            allowFullScreen
            loading="lazy"
            title="Carte zones street food"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default NourriturePage;
