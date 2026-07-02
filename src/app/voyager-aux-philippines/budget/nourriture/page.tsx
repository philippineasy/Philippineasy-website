import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStreetView, faStore, faCocktail } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Manger aux Philippines : Guide des Prix et de la Street Food',
  description: 'Découvrez le coût de la nourriture aux Philippines, de la street food savoureuse aux restaurants locaux. Ce guide vous aidera à bien manger sans vous ruiner.',
};

const NourriturePage = () => {
  return (
    <div className="bg-background text-foreground">
      <PageHero
        eyebrow="Guide pratique"
        title="Manger aux Philippines"
        titleAccent="Un Festin Abordable"
        subtitle="Saveurs, sourires et surprises à chaque coin de rue. Voici comment vous régaler sans exploser votre budget."
        imageUrl="https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Manger aux Philippines Un Festin Abordable"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2
            className="mb-10 text-center text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            La Cuisine Philippine en Bref
          </h2>
          <StatRow
            className="justify-center"
            stats={[
              { icon: <FontAwesomeIcon icon={faStreetView} className="text-[18px]" />, value: 'Moins de 1€', label: 'Prix de la Street Food' },
              { icon: <FontAwesomeIcon icon={faStore} className="text-[18px]" />, value: '2-4€', label: 'Repas en Carinderia' },
              { icon: <FontAwesomeIcon icon={faCocktail} className="text-[18px]" />, value: '~1€', label: 'Bière Locale' },
            ]}
          />
        </div>
      </section>

      <SplitSection
        imageUrl="/images/nourriture/street-food-philippine.webp"
        imageAlt="Assortiment coloré de brochettes philippine vendues dans un stand de rue en soirée"
        title="La Street Food : Un Festin à Petit Prix"
      >
        <p>Vous marchez dans une ruelle animée, l’odeur de barbecue vous attire… Bienvenue dans l’univers inimitable de la street food philippine. Pour quelques pesos, vous pouvez déguster une variété de brochettes, de fritures et de douceurs locales.</p>

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
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="bg-primary/10 p-4 rounded-lg mt-8 text-sm italic shadow-sm">
          💡 La street food philippine est souvent servie avec une sauce au vinaigre et piment. N’hésitez pas à demander “konting sili lang” (juste un peu de piment) si vous n’êtes pas fan du piquant !
        </p>
        <Link href="/voyager-aux-philippines/budget">Retour au budget →</Link>
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        imageUrl="/images/nourriture/carinderia-locale-animee.webp"
        imageAlt="Intérieur d'une carinderia philippine avec plats maison dans des marmites"
        title="Les Carinderias : Manger comme un Local"
      >
        <p>Dans tous les barangays, les <b>carinderias</b> sont le cœur battant de la cuisine locale. Pas de menu papier, juste un comptoir en inox, une rangée de marmites et un grand sourire pour vous accueillir.</p>
        <ul>
          <li><b>Adobo :</b> Viande marinée dans du vinaigre, ail et sauce soja.</li>
          <li><b>Sinigang :</b> Soupe aigre traditionnelle à base de tamarin.</li>
          <li><b>Lechon :</b> Cochon de lait rôti croustillant à souhait.</li>
          <li><b>Kare-Kare :</b> Ragoût de queue de bœuf et légumes dans une sauce aux cacahuètes.</li>
          <li><b>Gulay :</b> Plats de légumes sautés, pour les végétariens.</li>
        </ul>
        <p className="bg-accent/10 p-4 rounded-lg mt-4 text-sm italic">
          💬 Vous êtes végétarien ? Demandez “gulay lang” ou “no meat please”, certaines carinderias s’adaptent volontiers.
        </p>
        <Link href="/voyager-aux-philippines/budget/hebergement">Voir le guide de l'hébergement →</Link>
      </SplitSection>

      <SplitSection
        imageUrl="https://images.unsplash.com/photo-1598511721105-fbcf4f484905?q=80&w=1974&auto=format&fit=crop"
        imageAlt="Touriste mangeant dans une échoppe locale"
        title="Faut-il craindre la Street Food ? Pas tant que ça"
      >
        <p>La plupart des voyageurs n’ont <b>aucun souci à manger local</b> aux Philippines. Quelques conseils simples suffisent :</p>
        <ul>
          <li>Choisissez des stands fréquentés, surtout aux heures de pointe</li>
          <li>Privilégiez les plats bien cuits (grillés, frits)</li>
          <li>Évitez l’eau du robinet : buvez en bouteille</li>
        </ul>
        <p>Et surtout, <b>ne passez pas à côté du plaisir de manger avec les locaux</b> ! C’est souvent autour d’un plat qu’on tisse les plus beaux souvenirs.</p>
      </SplitSection>

      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">📍 Où trouver les meilleures zones de Street Food ?</h2>
          <p className="mb-6 text-base">Voici une carte interactive des quartiers réputés pour manger sur le pouce, à Manille, Cebu ou encore Davao :</p>
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1PDDWbcbSaYhcGshzTNoQCKblWc4uElE&ehbc=2E312F"
            width="100%"
            height="480"
            className="rounded-xl shadow-md border border-border"
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
