import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CheckCircle, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSimCard, faPassport, faSignal, faClock } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, CTABand } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Carte SIM aux Philippines : Globe, Smart ou DITO ? Guide 2026",
  description: "Comparatif Globe, Smart et DITO, forfaits data prépayés en pesos, eSIM, enregistrement passeport et achat à l'aéroport : le guide 2026 pour rester connecté aux Philippines.",
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/communication/carte-sim',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/voyager-aux-philippines', label: 'Voyager aux Philippines' },
  { href: '/voyager-aux-philippines/communication', label: 'Communication' },
  { label: 'Carte SIM' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Voyager aux Philippines', item: '/voyager-aux-philippines' },
  { name: 'Communication', item: '/voyager-aux-philippines/communication' },
  { name: 'Carte SIM', item: '/voyager-aux-philippines/communication/carte-sim' },
];

const SIM_ARTICLE = '/voyager-aux-philippines/conseils-voyage/guide-achat-activation-sim-philippines';

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, liste cochée, étapes,   */
/* table de repères et encadré d'avertissement.                               */
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
  <div
    className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2 sm:gap-x-6')}
    role="list"
  >
    {items.map((item, i) => (
      <div
        key={i}
        role="listitem"
        className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-foreground"
      >
        <CheckCircle
          className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-primary"
          aria-hidden="true"
        />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// Étapes numérotées (procédure d'enregistrement). Pastille bleue + titre + texte.
const Steps = ({
  steps,
}: {
  steps: { title?: string; meta?: string; text: ReactNode }[];
}) => (
  <div className="mt-5 flex flex-col gap-4" role="list">
    {steps.map((s, i) => (
      <div key={i} role="listitem" className="flex gap-3.5">
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground"
          aria-hidden="true"
        >
          {i + 1}
        </span>
        <div className="pt-0.5">
          {s.title && (
            <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-foreground">
              {s.title}
              {s.meta && (
                <span className="rounded bg-muted px-2 py-0.5 text-[12px] font-medium tabular-nums text-muted-foreground">
                  {s.meta}
                </span>
              )}
            </span>
          )}
          <span
            className={cn(
              'block text-[14px] leading-[1.55]',
              s.title ? 'mt-1 text-muted-foreground' : 'pt-1 text-foreground'
            )}
          >
            {s.text}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// Table de repères prix compacte (recette visas-et-formalites / logement).
const DataTable = ({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; sub?: string; value: string }[];
}) => (
  <div className={cn('overflow-hidden rounded-xl border-[0.5px] border-border bg-card')}>
    <div className="border-b border-border bg-muted px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {caption}
    </div>
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-[14px] text-foreground">
            {r.label}
            {r.sub && (
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">
                {r.sub}
              </span>
            )}
          </dt>
          <dd className="whitespace-nowrap text-[14px] font-semibold tabular-nums text-foreground">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

// Encadré d'avertissement honnête (bord accent, façon "À vérifier" du simulateur).
const CautionBox = ({ title, items }: { title: string; items: ReactNode[] }) => (
  <div className="mt-6 rounded-r-lg border-l-4 border-accent bg-accent/5 py-4 pl-5 pr-4">
    <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-accent-strong">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      {title}
    </div>
    <div className="flex flex-col gap-2" role="list">
      {items.map((it, i) => (
        <div
          key={i}
          role="listitem"
          className="flex gap-2.5 text-[14px] leading-[1.55] text-foreground/85"
        >
          <span
            className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-strong"
            aria-hidden="true"
          />
          <span>{it}</span>
        </div>
      ))}
    </div>
  </div>
);

// Lien-action interne (rendu dans le rich-text de SplitSection : couleur
// accent-strong AA + no-underline forcés en style inline).
const inlineLinkClass =
  'group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm';
const inlineLinkStyle = {
  color: 'hsl(var(--accent-strong))',
  textDecoration: 'none',
} as const;

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className={inlineLinkClass} style={inlineLinkStyle}>
    {children}
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
      aria-hidden="true"
    />
  </Link>
);

/* -------------------------------------------------------------------------- */
/* Données de repère (offres constatées fin 2025 – début 2026, volatiles).    */
/* -------------------------------------------------------------------------- */

const operateurs = [
  {
    caption: 'Globe Telecom',
    rows: [
      { label: 'Abonnés', value: '≈ 63 M' },
      { label: 'Point fort', value: 'Couverture n°1' },
      { label: 'Terrain de jeu', value: 'Villes & tourisme' },
      { label: 'Promo type', value: 'Go+99 · 7 jours' },
      { label: 'App', value: 'GlobeOne' },
    ],
  },
  {
    caption: 'Smart Communications',
    rows: [
      { label: 'Abonnés', value: '≈ 59 M (avec TNT)' },
      { label: 'Point fort', value: 'Régulier sur les îles' },
      { label: 'Terrain de jeu', value: 'Island hopping' },
      { label: 'Promo type', value: 'Magic Data 99' },
      { label: 'App', value: 'Smart App' },
    ],
  },
  {
    caption: 'DITO Telecommunity',
    rows: [
      { label: 'Abonnés', value: '≈ 14 M' },
      { label: 'Point fort', value: 'Débits & 5G' },
      { label: 'Terrain de jeu', value: 'Grandes villes' },
      { label: 'Promo type', value: 'Level-Up 99 · 30 j' },
      { label: 'App', value: 'DITO App' },
    ],
  },
];

const ressources = [
  { name: 'Globe · Traveler SIM', url: 'https://www.globe.com.ph/international/traveler-sim', domain: 'globe.com.ph' },
  { name: 'Smart · Tourist SIM', url: 'https://smart.com.ph/Pages/TravelSIM', domain: 'smart.com.ph' },
  { name: 'GOMO (data sans expiration)', url: 'https://www.gomo.ph/', domain: 'gomo.ph' },
  { name: 'DITO Telecommunity', url: 'https://dito.ph/', domain: 'dito.ph' },
];

const CarteSimPage = () => {
  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Guide pratique"
        title="Carte SIM"
        titleAccent="Locale"
        subtitle="Le guide essentiel pour acheter votre carte SIM dès votre arrivée et rester connecté à petit prix."
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Carte SIM Locale"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="La meilleure dépense de votre voyage"
              title="Connecté pour moins"
              accent="d'un euro"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Une carte SIM philippine coûte 40 à 50 ₱ en supérette — moins d&apos;un euro pour
                débloquer Grab, Google Maps, les réservations de ferry et les appels locaux
                pendant tout votre séjour. Acheter une carte SIM locale reste la solution la plus
                simple et économique pour avoir internet et passer des appels aux Philippines.
              </p>
              <p>
                Reste à choisir le bon réseau, à passer l&apos;étape de l&apos;enregistrement
                obligatoire — passeport en main — et à charger le forfait qui colle à votre
                itinéraire. Ce guide reprend tout dans l&apos;ordre, opérateur par opérateur,
                avec les prix constatés début 2026.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '40 ₱', label: 'la carte SIM en ville', icon: <FontAwesomeIcon icon={faSimCard} className="text-[18px]" /> },
                { value: '3', label: 'réseaux nationaux', icon: <FontAwesomeIcon icon={faSignal} className="text-[18px]" /> },
                { value: '30', label: 'jours de validité touriste', icon: <FontAwesomeIcon icon={faPassport} className="text-[18px]" /> },
                { value: '24h/24', label: 'stands SIM à NAIA', icon: <FontAwesomeIcon icon={faClock} className="text-[18px]" /> },
              ]}
            />
          </div>

          <p className="mt-6 max-w-3xl text-[14px] leading-[1.6] text-muted-foreground">
            Les promos data évoluent tous les quelques mois aux Philippines. Les montants de cette
            page sont des repères relevés fin 2025 – début 2026 (1 € ≈ 65 ₱) : vérifiez
            l&apos;offre du jour dans les apps officielles avant de recharger.
          </p>
        </div>
      </section>

      {/* Chapitre 1 — Les trois opérateurs comparés */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Trois réseaux se partagent le pays" title="Globe, Smart ou" accent="DITO" />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Longtemps, la question se résumait à un duel : Globe ou Smart, les deux géants qui
              concentrent encore environ 85 % des cartes SIM actives du pays. Un troisième
              réseau, DITO, a rebattu les cartes avec des prix agressifs et une 5G rapide — au
              point de décrocher le titre de meilleur réseau du pays chez Opensignal en
              octobre 2025.
            </p>
            <p>
              Les mesures ne disent pourtant pas tout. DITO domine les débits (près de 40 Mbps
              en moyenne, plus de 250 Mbps en 5G), mais sa couverture se concentre sur les
              grandes villes. Globe garde la meilleure expérience de couverture nationale du
              même classement, et Smart sa réputation de réseau le plus régulier sur les îles —
              Palawan, Siargao ou Bohol en tête. Pour un itinéraire multi-îles, Globe ou Smart
              restent les valeurs sûres ; DITO brille surtout à Manille, Cebu ou Davao.
            </p>
          </div>

          <div className="mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {operateurs.map((op) => (
              <DataTable key={op.caption} caption={op.caption} rows={op.rows} />
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-[15px] leading-[1.6] text-muted-foreground">
            Impossible de trancher ? Beaucoup de voyageurs au long cours embarquent deux SIM —
            une Smart, une Globe, environ 100 à 150 ₱ les deux — et basculent selon l&apos;île.
            Un téléphone double SIM ou compatible eSIM rend la combinaison indolore.
          </p>
        </div>
      </section>

      {/* Chapitre 2 — Où acheter (aéroport vs ville vs en ligne) */}
      <SplitSection
        eyebrow="Simple et rapide"
        title="Où acheter, à quel"
        titleAccent="prix"
        imageUrl="/imagesHero/comment-voyager-aux-philippines.webp"
        imageAlt="Avion à l'arrivée aux Philippines, premier point de vente de cartes SIM"
      >
        <p>
          Trois circuits possibles, du plus confortable au plus économique — avec un écart de
          prix qui mérite d&apos;être connu avant d&apos;atterrir.
        </p>
        <CheckList
          items={[
            <><strong>À l&apos;aéroport :</strong> le plus simple. Des stands Globe et Smart vous attendent dès la sortie de la douane — 24 h/24 à Manille (NAIA, terminaux 1 à 3), en zone d&apos;arrivée à Cebu-Mactan. Le personnel installe et enregistre la SIM avec vous ; Smart remet même une Tourist SIM gratuite sur présentation du passeport. Les packs data touristiques y sont en revanche chers : environ 2 000 à 3 500 ₱ (30 à 52 €) pour 30 jours.</>,
            <><strong>En ville :</strong> le plus économique. La SIM nue coûte 40 à 50 ₱ dans les boutiques officielles, les supermarchés et les supérettes (7-Eleven, Ministop…) ; ajoutez une promo data à environ 99 ₱ la semaine et vous voilà connecté pour moins de 3 €.</>,
            <><strong>En ligne :</strong> GOMO, la marque 100 % digitale de Globe, vend une SIM livrée avec environ 30 Go sans date d&apos;expiration pour ≈ 299 ₱ — commande sur son site uniquement, pratique pour les longs séjours.</>,
          ]}
        />
        <DataTable
          caption="Repères prix · début 2026"
          rows={[
            { label: 'Carte SIM nue', sub: '7-Eleven, boutiques officielles', value: '40 – 50 ₱' },
            { label: 'Promo data 1 semaine', value: '≈ 99 ₱' },
            { label: 'Globe Traveler SIM', sub: '80 Go + appels illimités · 30 jours', value: '≈ 1 750 ₱' },
            { label: 'Pack touriste aéroport', sub: 'Gros volume ou data illimitée · 30 jours', value: '2 000 – 3 500 ₱' },
          ]}
        />
      </SplitSection>

      {/* Chapitre 3 — SIM Registration Act, pas à pas */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Une formalité incontournable" title="L'enregistrement" accent="obligatoire" />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Depuis le <em>SIM Registration Act</em> (loi RA 11934, adoptée fin 2022), plus
              aucune carte SIM philippine ne fonctionne sans être enregistrée au nom de son
              porteur — les SIM anonymes ont été coupées en masse à l&apos;été 2023. Côté
              touriste, la procédure est simple à condition d&apos;avoir trois documents sous la
              main.
            </p>
          </div>

          <div className="mt-4 max-w-2xl">
            <Steps
              steps={[
                {
                  title: 'Réunissez vos justificatifs',
                  text: 'Passeport, adresse aux Philippines (une réservation d’hôtel suffit) et billet de sortie du territoire.',
                },
                {
                  title: 'Ouvrez le portail de votre opérateur',
                  meta: '5 à 10 minutes',
                  text: 'smart.com.ph/simreg ou new.globe.com.ph/simreg. Aux stands d’aéroport, le personnel fait la manipulation avec vous.',
                },
                {
                  title: 'Remplissez le profil « tourist »',
                  text: 'Code de vérification reçu par SMS, formulaire, photo du passeport et selfie.',
                },
                {
                  title: 'Activation immédiate',
                  text: 'La SIM devient utilisable dans la foulée. Non enregistrée, elle reste muette : ni appels, ni SMS, ni data.',
                },
              ]}
            />
            <CautionBox
              title="Le compte à rebours des 30 jours"
              items={[
                'Une SIM enregistrée avec un profil touriste n’est valable que 30 jours, puis elle est désactivée automatiquement.',
                'Les recharges ne prolongent pas ce délai : le compteur court depuis l’enregistrement.',
                'Vous restez plus d’un mois ? La prolongation se demande en boutique Globe ou Smart, sur présentation d’une extension de visa approuvée.',
                'Les eSIM de voyage internationales (Airalo, Holafly…) échappent à cette règle : elles fonctionnent en itinérance, sans enregistrement local.',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Chapitre 4 — eSIM ou SIM physique */}
      <SplitSection
        reverse
        eyebrow="Le match des formats"
        title="eSIM ou SIM"
        titleAccent="physique"
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Voyageur configurant une eSIM sur son smartphone"
      >
        <p>
          Votre téléphone accepte les eSIM ? Deux familles d&apos;offres s&apos;ouvrent à vous.
          Côté local, Globe et Smart vendent chacun une eSIM prépayée autour de 99 ₱ (~1,60 €),
          à activer depuis leurs apps — mêmes promos et même enregistrement passeport que la SIM
          physique. Smart décline aussi une <strong>Tourist eSIM</strong> pensée pour les
          visiteurs : environ 599 ₱ (~9 €) pour 24 Go et appels locaux illimités pendant
          30 jours, ou 1 599 ₱ (~24 €) en data illimitée.
        </p>
        <p>
          Côté international, les eSIM de voyage type Airalo (à partir d&apos;environ 4,50 $ le
          gigaoctet, ~13 $ les 5 Go / 30 jours) ou Holafly (data illimitée dès ~3,90 $ par jour)
          s&apos;activent avant le décollage : vous atterrissez déjà connecté, sans file
          d&apos;attente ni formalité. Leur limite : pas de numéro philippin, donc pas de SMS
          locaux — gênant pour valider un compte Grab ou un porte-monnaie mobile.
        </p>
        <h4>Notre lecture</h4>
        <p>
          Court séjour urbain : l&apos;eSIM internationale gagne en confort. Plusieurs semaines
          et des îles au programme : la SIM locale — physique ou eSIM — reste imbattable sur le
          prix et vous donne un vrai numéro philippin. Beaucoup de voyageurs combinent les deux :
          eSIM internationale pour les premières heures, SIM locale achetée tranquillement en
          ville.
        </p>
        <InlineLink href={SIM_ARTICLE}>Notre pas-à-pas détaillé : acheter et activer sa SIM</InlineLink>
      </SplitSection>

      {/* Chapitre 5 — Forfaits par profil */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Les offres évoluent souvent" title="Quel forfait pour quel" accent="voyageur" />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Pour deux semaines de vacances, une promo hebdomadaire autour de 99 ₱ rechargée une
              fois suffit largement. Au mois, les forfaits 30 jours de DITO ou de Smart prennent
              le relais ; les nomades, eux, lorgnent la data « sans expiration » de GOMO ou de
              Smart (gamme Magic Data), qui reste au compteur tant que la ligne est active.
              Quatre repères représentatifs, à titre indicatif :
            </p>
          </div>

          <div className="mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            <DataTable
              caption="Globe · Go+99 — le classique semaine"
              rows={[
                { label: 'Data', value: '8 Go + 8 Go apps' },
                { label: 'Validité', value: '7 jours' },
                { label: 'Prix', value: '99 ₱ · ~1,60 €' },
              ]}
            />
            <DataTable
              caption="Smart · Giga Power 99 — l'équivalent"
              rows={[
                { label: 'Data', value: '2 Go/jour + 6 Go' },
                { label: 'Validité', value: '7 jours' },
                { label: 'Prix', value: '99 ₱ · ~1,60 €' },
              ]}
            />
            <DataTable
              caption="DITO · Level-Up 99 — le mois urbain"
              rows={[
                { label: 'Data', value: '7 Go tous usages' },
                { label: 'Validité', value: '30 jours' },
                { label: 'Prix', value: '99 ₱ · ~1,60 €' },
              ]}
            />
            <DataTable
              caption="GOMO · 30 Go — le choix nomade"
              rows={[
                { label: 'Data', value: '≈ 30 Go' },
                { label: 'Validité', value: 'Sans date limite' },
                { label: 'Prix', value: '≈ 449 ₱ · ~6,50 €' },
              ]}
            />
          </div>

          <p className="mt-6 max-w-2xl text-[15px] leading-[1.6] text-muted-foreground">
            Besoin de plus gros volumes ? Smart affiche environ 48 Go pour ≈ 499 ₱ sur 30 jours,
            Globe monte à ≈ 30 Go avec ses paliers Go+ à ≈ 250 ₱. Et vérifiez toujours
            l&apos;app le jour J : les variantes exclusives y offrent régulièrement plus de data
            au même prix.
          </p>
        </div>
      </section>

      {/* Chapitre 6 — Astuces de terrain */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Ce que les habitués font" title="Six réflexes qui changent" accent="tout" />
          <div className="mt-8 max-w-4xl">
            <CheckList
              columns={2}
              items={[
                <><strong>Passez par les apps.</strong> GlobeOne et Smart App vendent des promos exclusives, souvent plus généreuses que les mêmes paliers achetés par SMS ou code USSD.</>,
                <><strong>Rechargez n&apos;importe où.</strong> Le « load » s&apos;achète chez 7-Eleven, dans les sari-sari stores de quartier ou directement depuis GCash et Maya.</>,
                <><strong>Gardez au moins 1 ₱ de crédit.</strong> C&apos;est la condition pour que la data « sans expiration » (GOMO, Magic Data) reste disponible.</>,
                <><strong>Island hopping ?</strong> Deux SIM (Smart + Globe) coûtent moins de 150 ₱ et garantissent presque toujours un signal quelque part.</>,
                <><strong>Coupez le roaming français</strong> dès l&apos;atterrissage : quelques Mo hors forfait coûtent plus cher qu&apos;un mois de data locale.</>,
                <><strong>Oubliez le pocket WiFi de location</strong> (~250 ₱/jour) : face à une SIM locale, il ne se justifie plus que pour un groupe qui partage la connexion.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* Ressources officielles */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="À consulter" title="Les offres" titleAccent="officielles" columns={4}>
            {ressources.map((resource) => (
              <a
                key={resource.domain}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {resource.name}
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {resource.domain}
                  </span>
                </span>
              </a>
            ))}
          </CardGrid>
        </div>
      </section>

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

      {/* Panneau signature de clôture */}
      <CTABand
        title="Une question avant"
        titleAccent="d'acheter ?"
        subtitle="Les habitués du forum comparent leurs réseaux île par île — exposez votre itinéraire, vous saurez vite quelle SIM embarquer."
        primary={{ label: 'Poser ma question sur le forum', href: '/forum-sur-les-philippines' }}
        secondary={{ label: 'Tous nos conseils communication', href: '/voyager-aux-philippines/communication' }}
      />
    </div>
  );
};

export default CarteSimPage;
