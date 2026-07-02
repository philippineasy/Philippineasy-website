import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PageHero, StatRow, SplitSection } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStreetView, faStore, faCocktail } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Manger aux Philippines : Guide des Prix et de la Street Food',
  description: 'Découvrez le coût de la nourriture aux Philippines, de la street food savoureuse aux restaurants locaux. Ce guide vous aidera à bien manger sans vous ruiner.',
};

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, liste cochée.           */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({
  eyebrow,
  title,
  accent,
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  center?: boolean;
}) => (
  <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
    <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2
      className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
      style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
    >
      {title}
      {accent && (
        <>
          {' '}
          <span className="text-accent">{accent}</span>
        </>
      )}
    </h2>
  </div>
);

const CheckList = ({ items }: { items: ReactNode[] }) => (
  <div className="mt-4 grid gap-2.5" role="list">
    {items.map((item, i) => (
      <div key={i} role="listitem" className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-foreground">
        <CheckCircle className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-primary" aria-hidden="true" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const NourriturePage = () => {
  return (
    <div className="bg-background text-foreground">
      <PageHero
        eyebrow="Guide pratique"
        title="Manger aux Philippines"
        titleAccent="Un Festin Abordable"
        subtitle="Saveurs, sourires et surprises à chaque coin de rue. Voici comment vous régaler sans exploser votre budget."
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Manger aux Philippines Un Festin Abordable"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader center eyebrow="Repères de base" title="Combien coûte un" accent="repas ?" />
          <p className="mx-auto mt-5 max-w-2xl text-center text-[16px] leading-[1.7] text-muted-foreground">
            Manger aux Philippines coûte rarement cher, quel que soit l&apos;endroit où vous posez
            votre plateau. Une brochette achetée dans la rue revient à moins de 1 €, un repas
            complet en carinderia se règle entre 2 et 4 €, et une bière locale accompagne le tout
            pour à peine 1 € de plus.
          </p>
          <div className="mt-10">
            <StatRow
              className="justify-center"
              stats={[
                { icon: <FontAwesomeIcon icon={faStreetView} className="text-[18px]" />, value: 'Moins de 1€', label: 'Prix de la Street Food' },
                { icon: <FontAwesomeIcon icon={faStore} className="text-[18px]" />, value: '2-4€', label: 'Repas en Carinderia' },
                { icon: <FontAwesomeIcon icon={faCocktail} className="text-[18px]" />, value: '~1€', label: 'Bière Locale' },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Manger sur le pouce"
        imageUrl="/images/nourriture/street-food-philippine.webp"
        imageAlt="Assortiment coloré de brochettes philippine vendues dans un stand de rue en soirée"
        title="La street food,"
        titleAccent="à petit prix"
      >
        <p>
          Vous marchez dans une ruelle animée, l&apos;odeur de barbecue vous attire… Bienvenue
          dans l&apos;univers inimitable de la street food philippine. Pour quelques pesos, vous
          pouvez déguster une variété de brochettes, de fritures et de douceurs locales, souvent
          préparées sous vos yeux sur un simple charbon de bois.
        </p>

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
        eyebrow="Manger comme un local"
        imageUrl="/images/nourriture/carinderia-locale-animee.webp"
        imageAlt="Intérieur d'une carinderia philippine avec plats maison dans des marmites"
        title="Le cœur battant de la"
        titleAccent="cuisine locale"
      >
        <p>
          Dans tous les barangays, les <b>carinderias</b> sont le cœur battant de la cuisine
          locale. Pas de menu papier, juste un comptoir en inox, une rangée de marmites et un
          grand sourire pour vous accueillir. On pointe du doigt ce qui nous fait envie, et on
          s&apos;installe.
        </p>
        <CheckList
          items={[
            <><b>Adobo :</b> viande marinée dans du vinaigre, ail et sauce soja</>,
            <><b>Sinigang :</b> soupe aigre traditionnelle à base de tamarin</>,
            <><b>Lechon :</b> cochon de lait rôti croustillant à souhait</>,
            <><b>Kare-Kare :</b> ragoût de queue de bœuf et légumes dans une sauce aux cacahuètes</>,
            <><b>Gulay :</b> plats de légumes sautés, pour les végétariens</>,
          ]}
        />
        <p className="bg-accent/10 p-4 rounded-lg mt-4 text-sm italic">
          💬 Vous êtes végétarien ? Demandez “gulay lang” ou “no meat please”, certaines carinderias s’adaptent volontiers.
        </p>
        <Link href="/voyager-aux-philippines/budget/hebergement">Voir le guide de l'hébergement →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="Sécurité alimentaire"
        imageUrl="/images/nourriture/street-food-philippine.webp"
        imageAlt="Touriste mangeant dans une échoppe locale"
        title="Street food,"
        titleAccent="sans risque"
      >
        <p>
          La plupart des voyageurs n&apos;ont <b>aucun souci à manger local</b> aux Philippines.
          Quelques conseils simples suffisent pour éviter les mauvaises surprises&nbsp;:
        </p>
        <CheckList
          items={[
            'Choisissez des stands fréquentés, surtout aux heures de pointe',
            'Privilégiez les plats bien cuits (grillés, frits)',
            "Évitez l'eau du robinet : buvez en bouteille",
          ]}
        />
        <p>
          Et surtout, <b>ne passez pas à côté du plaisir de manger avec les locaux</b> ! C&apos;est
          souvent autour d&apos;un plat qu&apos;on tisse les plus beaux souvenirs.
        </p>
      </SplitSection>

      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <SectionHeader center eyebrow="Sur le terrain" title="Cartographier les meilleures" accent="zones" />
          <p className="mx-auto mt-5 mb-6 max-w-2xl text-base text-muted-foreground">
            Voici une carte interactive des quartiers réputés pour manger sur le pouce, à Manille,
            Cebu ou encore Davao :
          </p>
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
