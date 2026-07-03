import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PageHero, StatRow, SplitSection, FaqAccordion } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faHotel, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Hébergement aux Philippines : Guide des Prix et Conseils',
  description: 'Découvrez le coût de l\'hébergement aux Philippines, des auberges de jeunesse conviviales aux hôtels de luxe. Ce guide vous aidera à trouver le logement idéal pour votre budget.',
};

// FAQ 100 % factuelle — reformule les repères prix et conseils déjà donnés
// plus haut sur la page (StatRow, familles de logements, checklists, comparatif).
// Feed le visible ET le FAQPage schema via <FaqAccordion withSchema>.
const HEBERGEMENT_FAQS = [
  {
    q: 'Combien coûte une nuit d\'hébergement aux Philippines ?',
    a: "Comptez entre 8 et 15 € pour un lit en dortoir, 20 à 40 € pour une chambre double confortable, et plus de 100 € la nuit pour un hôtel haut de gamme. Entre les deux, un appart'hôtel se loue généralement entre 50 et 80 €.",
  },
  {
    q: 'Quelles sont les auberges de jeunesse recommandées aux Philippines ?',
    a: "Des enseignes comme Mad Monkey, Spin Hostel ou The Circle Hostel reviennent souvent parmi les auberges appréciées des voyageurs. Elles restent la solution la moins chère pour dormir sur l'archipel et misent sur une ambiance conviviale, avec souvent un rooftop pour partager un verre entre voyageurs.",
  },
  {
    q: 'Faut-il réserver son hébergement à l\'avance ?',
    a: "Oui, surtout en haute saison, où les meilleurs lits en dortoir comme les chambres partent vite. Les sites Booking.com, Agoda et Airbnb restent les plus pratiques, notamment pour les séjours plus longs.",
  },
  {
    q: 'Quels points vérifier avant de réserver un logement ?',
    a: "Si vous travaillez en ligne, vérifiez la qualité du Wi-Fi avant de réserver. Côté sécurité, privilégiez les quartiers centraux, en particulier à Manille ou Cebu, et pensez à demander si l'établissement dispose d'un générateur en cas de coupure de courant, ce qui n'est pas systématique dans les guesthouses.",
  },
  {
    q: 'Auberge, chambre double ou resort : que choisir ?',
    a: "L'auberge convient aux petits budgets en quête de rencontres, avec un peu moins d'intimité. La chambre double offre un confort abordable, mais son niveau varie selon les zones. Le resort assure tout le confort — piscine, spa, salle de sport — pour un coût nettement plus élevé.",
  },
];

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

const CheckList = ({ items, columns = 1 }: { items: ReactNode[]; columns?: 1 | 2 }) => (
  <div className={cn('mt-4 grid gap-2.5', columns === 2 && 'sm:grid-cols-2 sm:gap-x-6')} role="list">
    {items.map((item, i) => (
      <div key={i} role="listitem" className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-foreground">
        <CheckCircle className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-primary" aria-hidden="true" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const HebergementPage = () => {
  return (
    <div className="bg-background text-foreground">
      <PageHero
        eyebrow="Guide pratique"
        title="Se Loger aux Philippines"
        titleAccent="Pour Tous les Budgets"
        subtitle="Des auberges de jeunesse animées aux resorts de luxe, trouvez l'hébergement parfait pour votre voyage."
        imageUrl="/imagesHero/hutte-philippines.webp"
        imageAlt="Se Loger aux Philippines Pour Tous les Budgets"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader center eyebrow="Le poste qui pèse le plus" title="Prix moyens par" accent="nuit" />
          <p className="mx-auto mt-5 max-w-2xl text-center text-[16px] leading-[1.7] text-muted-foreground">
            Le logement absorbe souvent la plus grosse part d&apos;un budget voyage aux
            Philippines, mais l&apos;écart entre les options reste immense. Un lit en dortoir se
            loue entre 8 et 15 €, une chambre double confortable tourne entre 20 et 40 €, et les
            hôtels haut de gamme démarrent au-delà de 100 € la nuit.
          </p>
          <div className="mt-10">
            <StatRow
              className="justify-center"
              stats={[
                { icon: <FontAwesomeIcon icon={faBed} className="text-[18px]" />, value: '8-15€', label: 'Dortoir en Auberge' },
                { icon: <FontAwesomeIcon icon={faHouseUser} className="text-[18px]" />, value: '20-40€', label: 'Chambre Double Simple' },
                { icon: <FontAwesomeIcon icon={faHotel} className="text-[18px]" />, value: '100€+', label: 'Hôtel de Luxe' },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-16">
        <SectionHeader center eyebrow="Vue d'ensemble" title="Quatre familles de" accent="logements" />
        <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-[1.6] text-muted-foreground">
          Du dortoir partagé au resort avec piscine, quatre formats reviennent sans cesse dans les
          recherches de logement aux Philippines. Voici comment les repérer d&apos;un coup
          d&apos;œil, avant d&apos;entrer dans le détail de chacun.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {[
            { name: 'Dortoir', desc: '8–15€ / nuit', img: '/images/budget/dortoir-auberge-jeunesse.webp' },
            { name: 'Chambre double', desc: '20–40€', img: '/images/budget/chambre-vue-mer.webp' },
            { name: 'Appart’hôtel', desc: '50–80€', img: '/images/budget/apparthotel-coquet.webp' },
            { name: 'Resort luxe', desc: '100€+', img: '/images/budget/resort-de-luxe-philippines.webp' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <Image src={item.img} alt={item.name} width={100} height={100} className="rounded-full shadow-md mb-2" />
              <p className="font-semibold text-base">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <SplitSection
        eyebrow="Backpackers"
        imageUrl="/images/budget/dortoir-auberge-jeunesse.webp"
        imageAlt="Dortoir dans une auberge de jeunesse aux Philippines"
        title="Dormir en"
        titleAccent="auberge"
      >
        <p>
          Après quelques heures de bus sur les routes de montagne de Luzon, quoi de mieux
          qu&apos;un lit en dortoir pour reposer le dos, et un rooftop pour siroter une bière avec
          d&apos;autres voyageurs ? Les auberges philippines allient simplicité et rencontres
          inoubliables, et restent la solution la moins chère pour dormir sur l&apos;archipel.
        </p>
        <CheckList
          items={[
            <><b>Prix :</b> très abordables, surtout en dortoir partagé</>,
            <><b>Ambiance :</b> idéale pour socialiser et partager des expériences</>,
            <><b>Conseil :</b> réservez à l&apos;avance en haute saison</>,
            <><b>Exemples :</b> Mad Monkey, Spin Hostel, The Circle Hostel</>,
          ]}
        />
        <Link href="/voyager-aux-philippines/budget">Retour au budget →</Link>
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        eyebrow="Plus de confort"
        imageUrl="/images/budget/resort-de-luxe-philippines.webp"
        imageAlt="Resort de luxe aux Philippines"
        title="Hôtels et"
        titleAccent="resorts"
      >
        <p>
          Que vous soyez en télétravail ou en lune de miel, les hôtels philippins couvrent tous
          les besoins : climatisation, piscine, service de chambre. Le confort reste accessible
          dans la plupart des provinces, bien au-delà des seules stations balnéaires connues.
        </p>
        <CheckList
          items={[
            <><b>Guesthouses :</b> chambres simples et propres à prix doux</>,
            <><b>Hôtels de gamme moyenne :</b> bon rapport qualité-prix</>,
            <><b>Resorts de luxe :</b> vue mer, spa, salle de sport, tout y est</>,
          ]}
        />
        <Link href="/voyager-aux-philippines/budget/nourriture">Voir le guide de la nourriture →</Link>
      </SplitSection>

      <div className="container mx-auto px-4 py-16">
        <SectionHeader eyebrow="Avant de réserver" title="Conseils et" accent="astuces" />
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.6] text-muted-foreground">
          Quelques réflexes glanés sur le terrain, qui évitent les mauvaises surprises une fois
          les valises posées.
        </p>
        <CheckList
          columns={2}
          items={[
            <><b>Sites à privilégier :</b> Booking.com, Agoda, Airbnb pour les séjours longs</>,
            <><b>Internet :</b> vérifiez la qualité du Wi-Fi si vous travaillez en ligne</>,
            <><b>Sécurité :</b> préférez les quartiers centraux, surtout à Manille ou Cebu</>,
            <><b>Électricité :</b> certaines guesthouses n&apos;ont pas de générateur lors des coupures — demandez avant</>,
          ]}
        />
      </div>

      {/* FAQ — visible + FAQPage schema (source unique HEBERGEMENT_FAQS) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Vos questions"
            titleAccent="logement"
            faqs={HEBERGEMENT_FAQS}
            withSchema
          />
        </div>
      </section>

      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <SectionHeader center eyebrow="En un coup d'œil" title="Comparatif" accent="rapide" />
          <p className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-[1.6] text-muted-foreground">
            De quoi trancher rapidement entre les trois formats les plus courants, selon votre
            profil et votre budget.
          </p>
          <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-card text-left shadow-md rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted text-sm">
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
