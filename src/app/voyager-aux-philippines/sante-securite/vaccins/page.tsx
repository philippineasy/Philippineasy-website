import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Syringe, ShieldCheck, AlertTriangle, Stethoscope } from 'lucide-react';
import { PageHero, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Vaccins pour les Philippines | Guide de Santé du Voyageur",
  description: "Le guide complet sur les vaccins recommandés et obligatoires pour un voyage aux Philippines. Préparez votre voyage en toute sérénité.",
};

/* -------------------------------------------------------------------------- */
/* En-tête de section : eyebrow uppercase + h2 avec UN mot en amber vif.       */
/* Repris à l'identique du pattern validé sur                                  */
/* /vivre-aux-philippines/visas-et-formalites.                                 */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) => (
  <div className="max-w-2xl">
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
    {description && (
      <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{description}</p>
    )}
  </div>
);

const vaccinsFaqs = [
  {
    q: "Quand faut-il consulter son médecin avant de partir aux Philippines ?",
    a: "Il est essentiel de consulter votre médecin traitant ou un centre de vaccinations internationales au moins 4 à 6 semaines avant le départ, afin d'obtenir des conseils personnalisés. Ce guide reste informatif et ne remplace pas cet avis médical.",
  },
  {
    q: "Quels vaccins de base faut-il vérifier avant de partir ?",
    a: "Assurez-vous que vos vaccins universels sont à jour : un rappel contre la diphtérie, le tétanos, la coqueluche et la poliomyélite est recommandé tous les 10 ans. Le vaccin contre l'hépatite B est quant à lui recommandé pour les séjours longs ou fréquents.",
  },
  {
    q: "Le vaccin contre l'hépatite A est-il recommandé pour les Philippines ?",
    a: "Oui, il est très recommandé : la transmission se fait par l'eau et les aliments contaminés, un risque spécifique aux Philippines. L'injection doit être réalisée 15 jours avant le départ.",
  },
  {
    q: "Faut-il se faire vacciner contre la fièvre typhoïde ?",
    a: "Ce vaccin est recommandé, surtout pour les séjours longs ou dans des conditions d'hygiène précaires. Comme pour l'hépatite A, l'injection se fait 15 jours avant le départ.",
  },
  {
    q: "Dans quels cas faut-il envisager les vaccins contre la rage et l'encéphalite japonaise ?",
    a: "Le vaccin contre la rage est recommandé pour les séjours longs, en zone rurale, ou pour les activités à risque comme la randonnée ou la spéléologie, avec une vaccination préventive en 3 injections. L'encéphalite japonaise est recommandée pour les séjours de plus d'un mois en zone rurale, surtout pendant la saison des pluies, selon un schéma en 2 injections.",
  },
];

const VaccinsPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Guide des"
        titleAccent="Vaccins"
        subtitle="Préparez votre voyage aux Philippines en toute sérénité en vous assurant d'être à jour avec les vaccins recommandés."
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Guide des Vaccins"
      />

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Avant de partir" title="Vaccins recommandés pour les" accent="Philippines" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Avant un séjour aux Philippines, plusieurs vaccinations méritent d'être passées en
            revue avec votre médecin, des rappels de base aux protections plus spécifiques selon
            la durée du voyage. Voici les trois familles à connaître, du plus universel au plus
            spécifique à vos activités sur place.
          </p>

          <div className="mt-8 flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-lg p-6 max-w-4xl">
            <Stethoscope className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl mb-2">Consultez votre médecin</h3>
              <p>Ce guide est informatif. Il est essentiel de consulter votre médecin traitant ou un centre de vaccinations internationales au moins 4 à 6 semaines avant votre départ pour des conseils personnalisés.</p>
            </div>
          </div>

          <div className="mt-12 space-y-12">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle className="flex items-center gap-3 text-2xl"><ShieldCheck className="text-primary" />Vaccins Universels (DTCP)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4">Assurez-vous que vos vaccins de base sont à jour. Ces maladies sont présentes partout dans le monde.</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><strong>Diphtérie, Tétanos, Coqueluche, Poliomyélite :</strong> Un rappel est recommandé tous les 10 ans.</li>
                  <li><strong>Hépatite B :</strong> Recommandé pour les séjours longs ou fréquents.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle className="flex items-center gap-3 text-2xl"><Syringe className="text-primary" />Vaccins Spécifiques au Voyage</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4">Ces vaccins sont fortement recommandés en raison des risques sanitaires spécifiques aux Philippines.</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li><strong>Hépatite A :</strong> Très recommandée. La transmission se fait par l'eau et les aliments contaminés. Une injection 15 jours avant le départ.</li>
                  <li><strong>Fièvre Typhoïde :</strong> Recommandée, surtout pour les séjours longs ou dans des conditions d'hygiène précaires. Une injection 15 jours avant le départ.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle className="flex items-center gap-3 text-2xl"><AlertTriangle className="text-primary" />Vaccins Additionnels (selon les conditions)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4">Ces vaccins peuvent être nécessaires en fonction de la durée de votre séjour, des régions visitées et de vos activités.</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li><strong>Rage :</strong> Recommandé pour les séjours longs, en zone rurale, ou pour les voyageurs ayant des activités à risque (randonnée, spéléologie). Vaccination préventive en 3 injections.</li>
                  <li><strong>Encéphalite Japonaise :</strong> Recommandé pour les séjours de plus d'un mois en zone rurale, surtout pendant la saison des pluies. Schéma en 2 injections.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <FaqAccordion
              withSchema
              eyebrow="Questions fréquentes"
              title="Vaccins pour les Philippines,"
              titleAccent="vos questions"
              faqs={vaccinsFaqs}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default VaccinsPage;
