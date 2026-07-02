import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShieldCheck, Wifi, Phone, UserCheck, AlertTriangle } from 'lucide-react';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: "Sécurité aux Philippines | Conseils pour les Voyageurs",
  description: "Guide complet sur la sécurité aux Philippines : zones à éviter, bonnes pratiques, sécurité numérique et contacts d'urgence.",
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

const ConseilsSecuritePage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Sécurité aux"
        titleAccent="Philippines"
        subtitle="Nos conseils pour un voyage serein et inoubliable."
        imageUrl="/images/sante/controle-police-philippines.webp"
        imageAlt="Sécurité aux Philippines"
      />

      {/* Vue d'ensemble */}
      <section className="bg-background pt-10 md:pt-12 pb-2">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Vue d'ensemble" title="Une destination" accent="globalement sûre" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Les Philippines sont une destination de rêve et globalement sûre. Chaque année, des
            millions de visiteurs profitent de ses merveilles sans aucun souci. Cependant, comme
            partout, la prudence est de mise : voici tout ce que vous devez savoir pour voyager
            en toute tranquillité.
          </p>
        </div>
      </section>

      {/* Zones sûres et à éviter */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Où aller, où éviter" title="Zones sûres et" accent="zones à éviter" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            La quasi-totalité des lieux touristiques ne posent aucun problème particulier ; seules
            quelques zones précises, clairement identifiées, restent à écarter de votre
            itinéraire.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-5xl">
            <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-[hsl(var(--success))]"><ShieldCheck />Zones les plus sûres</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les lieux les plus fréquentés par les touristes sont aussi les plus sécurisés :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Cebu City et ses plages de Mactan</li>
                  <li>Palawan (El Nido, Coron)</li>
                  <li>Bohol (Chocolate Hills, Panglao)</li>
                  <li>Siargao (surf, nature et ambiance relax)</li>
                  <li>Iloilo, Dumaguete, Davao : villes calmes et bien gérées.</li>
                </ul>
                <p className="mt-4 text-sm"><strong>Police touristique :</strong> Présente dans ces zones pour vous assister.</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30 bg-destructive/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-destructive"><AlertTriangle />Zones à éviter</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Certaines régions sont formellement déconseillées (niveau 4/4 selon France Diplomatie) :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Le centre et l'ouest de l'île de Mindanao (Marawi, Cotabato, Zamboanga)</li>
                  <li>L'archipel de Sulu (Jolo, Tawi-Tawi)</li>
                  <li>Certaines zones rurales isolées de Lanao del Sur</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bonnes pratiques */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Les bons réflexes" title="Bonnes pratiques pour un séjour" accent="serein" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Rien de très différent des précautions prises dans n'importe quelle grande
            destination touristique.
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card><CardContent className="p-6"><strong>Objets de valeur :</strong> Évitez de montrer vos gadgets dernier cri en public.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Foule :</strong> Restez attentif dans les marchés et les transports.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Transport :</strong> Utilisez Grab, Angkas ou les taxis d'hôtels.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Argent liquide :</strong> Ne gardez pas tout sur vous, répartissez-le.</CardContent></Card>
            <Card><CardContent className="p-6"><strong>Sorties nocturnes :</strong> Évitez les ruelles mal éclairées seul(e).</CardContent></Card>
          </div>
        </div>
      </section>

      {/* Sécurité numérique et contacts d'urgence */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="En ligne et en cas de pépin" title="Sécurité numérique et contacts" accent="d'urgence" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-muted-foreground">
            Deux réflexes à garder en tête : l'un pour protéger vos données, l'autre pour savoir
            qui appeler si les choses tournent mal.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-8">
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
        </div>
      </section>

      {/* Checklist */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Avant de partir" title="Checklist de" accent="sécurité" />
          <Card className="mt-8 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <ul className="space-y-2">
                <li className="flex items-center"><UserCheck className="text-[hsl(var(--success))] mr-3" />Photocopies ou scans de vos documents importants.</li>
                <li className="flex items-center"><UserCheck className="text-[hsl(var(--success))] mr-3" />Adresse de votre hôtel sur vous.</li>
                <li className="flex items-center"><UserCheck className="text-[hsl(var(--success))] mr-3" />Applis utiles : Grab, Google Maps, Maps.me.</li>
                <li className="flex items-center"><UserCheck className="text-[hsl(var(--success))] mr-3" />Appli eTravel obligatoire à l'arrivée.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ConseilsSecuritePage;
