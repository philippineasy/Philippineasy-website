import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Smile, ShoppingCart, HelpCircle } from 'lucide-react';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: "Expressions Utiles en Tagalog",
  description: "Apprenez les bases du Tagalog pour votre voyage aux Philippines. Salutations, formules de politesse, chiffres et expressions pratiques.",
};

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, table de lexique.       */
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

// Table de lexique compacte (mot local → traduction), même recette que les
// tables de repères prix (visas-et-formalites / logement).
const LexiconTable = ({
  rows,
}: {
  rows: { label: string; sub?: string; value: string }[];
}) => (
  <dl className="divide-y divide-border">
    {rows.map((r) => (
      <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
        <dt className="text-[15px] font-semibold text-foreground">
          {r.label}
          {r.sub && (
            <span className="mt-0.5 block text-[12.5px] font-normal leading-snug text-muted-foreground">
              {r.sub}
            </span>
          )}
        </dt>
        <dd className="whitespace-nowrap text-[15px] text-muted-foreground">{r.value}</dd>
      </div>
    ))}
  </dl>
);

const ExpressionsPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Expressions"
        titleAccent="Utiles"
        subtitle="Quelques mots de Tagalog pour briser la glace et enrichir votre expérience."
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Expressions Utiles"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto text-muted-foreground">
          L&apos;anglais est parlé quasi partout, mais connaître quelques mots de Tagalog vous
          ouvrira bien des portes et des sourires. Voici les bases pour bien commencer, classées
          par situation.
        </p>

        <SectionHeader eyebrow="Le vocabulaire essentiel" title="Le tagalog, mot à" accent="mot" />

        <div className="space-y-8 mt-10">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><Smile className="text-primary" />Salutations et Politesse</CardTitle></CardHeader>
            <CardContent>
              <LexiconTable
                rows={[
                  { label: 'Salamat', value: 'Merci' },
                  { label: 'Magandang umaga / hapon / gabi', value: 'Bonjour (matin / après-midi / soir)' },
                  { label: 'Paalam', value: 'Au revoir' },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><ShoppingCart className="text-primary" />Au Marché</CardTitle></CardHeader>
            <CardContent>
              <LexiconTable
                rows={[
                  { label: 'Magkano po?', sub: 'Le « po » est une marque de respect', value: 'Combien ça coûte ?' },
                  { label: 'Isa / Dalawa / Tatlo', value: 'Un / Deux / Trois' },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><HelpCircle className="text-primary" />Questions Pratiques</CardTitle></CardHeader>
            <CardContent>
              <LexiconTable
                rows={[
                  { label: 'Saan ang CR?', sub: 'CR = Comfort Room', value: 'Où sont les toilettes ?' },
                  { label: 'Ingat', value: 'Prends soin de toi / Fais attention' },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpressionsPage;
