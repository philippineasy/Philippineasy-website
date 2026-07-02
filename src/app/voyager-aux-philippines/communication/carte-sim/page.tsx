import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Globe, Smartphone, CheckCircle } from 'lucide-react';
import { PageHero } from '@/components/sections';
import { faSimCard } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Carte SIM aux Philippines | Guide pour les Touristes",
  description: "Restez connecté aux Philippines. Guide complet pour choisir votre carte SIM prépayée chez Globe ou Smart, et comparer les forfaits data.",
};

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, liste cochée, table.    */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
}) => (
  <div className="mx-auto max-w-2xl text-center">
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
  <div className="grid gap-2.5" role="list">
    {items.map((item, i) => (
      <div key={i} role="listitem" className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-foreground">
        <CheckCircle className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-primary" aria-hidden="true" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// Table de repères prix compacte (recette visas-et-formalites / logement),
// utilisée ici en paire pour comparer les deux forfaits promo.
const DataTable = ({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; value: string }[];
}) => (
  <div className={cn('overflow-hidden rounded-xl border-[0.5px] border-border bg-card')}>
    <div className="border-b border-border bg-muted px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {caption}
    </div>
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-[14px] text-foreground">{r.label}</dt>
          <dd className="whitespace-nowrap text-[14px] font-semibold tabular-nums text-foreground">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

const CarteSimPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Carte SIM"
        titleAccent="Locale"
        subtitle="Le guide essentiel pour acheter votre carte SIM dès votre arrivée et rester connecté à petit prix."
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Carte SIM Locale"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto text-muted-foreground">
          Acheter une carte SIM locale est la solution la plus simple et économique pour avoir
          internet et passer des appels aux Philippines. Voici comment faire, opérateur par
          opérateur.
        </p>

        <SectionHeader eyebrow="Deux réseaux dominent le marché" title="Globe ou" accent="Smart" />
        <p className="mx-auto mt-5 mb-8 max-w-2xl text-center text-[15px] leading-[1.6] text-muted-foreground">
          Les deux géants se disputent le marché depuis des années, et lequel choisir dépend
          surtout des îles où vous comptez traîner vos valises.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Globe className="text-primary" />Globe Telecom</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Très populaire, avec une excellente couverture dans la plupart des zones touristiques. Propose des forfaits "Go" et "Go+" avec de bonnes allocations de data.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Smartphone className="text-primary" />Smart Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>L'autre géant des télécoms, réputé pour avoir le réseau 4G/5G le plus rapide du pays. Leurs forfaits "Giga" sont très compétitifs.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="Simple et rapide" title="Où acheter, comment" accent="s'enregistrer" />
          <p className="mx-auto mt-5 mb-8 max-w-2xl text-center text-[15px] leading-[1.6] text-muted-foreground">
            Trois options s&apos;offrent à vous en arrivant, et une formalité administrative
            incontournable avant de pouvoir surfer.
          </p>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <CheckList
              items={[
                <><strong>À l&apos;aéroport :</strong> le plus simple. Des stands Globe et Smart vous attendent dès la sortie de la douane. Le personnel vous aidera à installer et enregistrer la SIM.</>,
                <><strong>En ville :</strong> dans les boutiques officielles, les supermarchés (7-Eleven, etc.) ou chez les vendeurs de rue.</>,
                <><strong>Enregistrement obligatoire :</strong> depuis 2023, il est obligatoire d&apos;enregistrer sa SIM en ligne avec son passeport. C&apos;est une procédure simple qui se fait via le site de l&apos;opérateur.</>,
              ]}
            />
          </CardContent>
        </Card>

        <div className="mt-16">
          <SectionHeader eyebrow="Les offres évoluent souvent" title="Exemples de" accent="forfaits" />
          <p className="mx-auto mt-5 mb-8 max-w-2xl text-center text-[15px] leading-[1.6] text-muted-foreground">
            Les promos changent régulièrement, mais voici deux forfaits représentatifs de ce que
            l&apos;on peut charger sur place, à titre de repère.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <DataTable
            caption="Globe · Go+99"
            rows={[
              { label: 'Data', value: '8 Go + 8 Go apps' },
              { label: 'Validité', value: '7 jours' },
              { label: 'Prix', value: '~1,60 €' },
            ]}
          />
          <DataTable
            caption="Smart · Giga Power 99"
            rows={[
              { label: 'Data', value: '2 Go/jour + 6 Go' },
              { label: 'Validité', value: '7 jours' },
              { label: 'Prix', value: '~1,60 €' },
            ]}
          />
        </div>
      </div>

      <AffiliateRecommendation
        title="Alternative : eSIM sans file d'attente"
        icon={faSimCard}
        location="carte_sim_page"
        items={[
          {
            name: 'Airalo eSIM',
            description: "Alternative aux SIM physiques : l'eSIM Airalo s'active AVANT votre depart. Plus besoin de faire la queue a l'aeroport. Votre numero francais reste actif en parallele.",
            advantage: 'A partir de 5 USD pour 1 GB — activation en 2 minutes',
            url: 'https://www.airalo.com/philippines-esim',
            recommended: true,
          },
        ]}
      />
    </div>
  );
};

export default CarteSimPage;
