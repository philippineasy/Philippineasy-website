import { Metadata } from 'next';
import { Briefcase, TrendingUp, Building, Info, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, DollarSign, LineChart, PieChart, Globe, Shield, Calculator, FileText, BarChart3, ArrowRight, Building2, Landmark, Zap, Phone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBuilding, faSackDollar, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises",
  description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs, SIRV 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises",
    description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investir en Bourse aux Philippines en 2026",
    description: "Guide pour investir à la bourse philippine (PSE) : compte, fiscalité, entreprises.",
    site: '@philippineasy',
  },
};

/* -------------------------------------------------------------------------- */
/* En-tête de section maison : eyebrow uppercase + h2 à un mot accentué.       */
/* Variante centrée : la page garde sa mise en page symétrique existante.      */
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
  <div className="mx-auto mb-10 max-w-2xl text-center">
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

// FAQ 100 % factuelle — reformulée à partir du contenu de la page ci-dessous
// (brokers, actions A/B, fiscalité, SIRV, entreprises non cotées).
const BOURSE_FAQS = [
  {
    q: "Puis-je investir en bourse philippine sans être résident ?",
    a: "Oui, via un broker international comme Interactive Brokers ou Boom Securities : ouverture 100 % en ligne, avec pour seuls documents un passeport, un justificatif de domicile et, pour les plateformes américaines, un formulaire W-8BEN. Un broker local (COL Financial, BDO/BPI Securities) suppose en revanche un visa résident et une ACR I-Card.",
  },
  {
    q: "Quelle est la différence entre actions de Classe A et de Classe B ?",
    a: "Les actions de Classe A sont réservées aux citoyens philippins uniquement. Les actions de Classe B sont ouvertes aux étrangers ET aux Philippins, avec les mêmes droits — c'est donc la classe qu'un investisseur étranger doit viser.",
  },
  {
    q: "Comment sont imposés les dividendes pour un investisseur étranger ?",
    a: "Les dividendes versés à une personne physique sont retenus à la source à 25 %, contre 30 % pour une société étrangère (réductible par convention fiscale). S'y ajoutent une taxe de 0,6 % sur chaque vente d'actions et une TVA de 12 % sur les commissions du broker.",
  },
  {
    q: "Qu'est-ce que le visa investisseur SIRV ?",
    a: "Le Special Investor's Resident Visa permet de résider indéfiniment aux Philippines en échange d'un investissement minimum de 75 000 US$ dans des actions cotées à la PSE ou des entreprises de secteurs prioritaires (BOI) — l'immobilier n'y est pas éligible. Conditions : 21 ans minimum, casier judiciaire vierge, ~300 US$ de frais de dossier.",
  },
  {
    q: "Peut-on investir dans une entreprise philippine non cotée ?",
    a: "Oui, mais la participation étrangère y est généralement plafonnée à 40 %, sauf dans les secteurs listés par la FINL (Foreign Investment Negative List) qui autorisent jusqu'à 100 % — export ou tech notamment. En contrepartie, la liquidité est faible et la due diligence plus complexe qu'en bourse.",
  },
];

const BourseEntreprisesPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Guide pratique"
        title="Investir en Bourse"
        titleAccent="et Entreprises"
        subtitle="Guide complet pour investir à la bourse philippine et dans les entreprises locales : PSE, secteurs porteurs, fiscalité et visa investisseur."
        imageUrl="/imagesHero/comment-investir-aux-philippines.webp"
        imageAlt="Investir en Bourse et Entreprises"
      />

      <div className="container mx-auto px-4 pt-12">
        {/* Introduction éditoriale */}
        <section className="max-w-3xl mx-auto mb-12">
          <SectionHeader eyebrow="Diversifier son placement" title="Au-delà de" accent="l'immobilier" />
          <div className="space-y-4 text-lg text-muted-foreground text-center leading-relaxed">
            <p>
              Le marché boursier local (PSE) et l'investissement direct dans les entreprises philippines
              ouvrent une autre voie, plus liquide et plus accessible à distance que la pierre.
            </p>
            <p>
              Avec une économie parmi les plus dynamiques d'Asie du Sud-Est, le pays attire les
              investisseurs en quête de croissance à long terme — à condition de connaître les règles du jeu.
            </p>
          </div>

          {/* Stats boxes */}
          <StatRow
            className="mt-10 justify-center gap-x-14"
            stats={[
              { icon: <FontAwesomeIcon icon={faChartLine} className="text-[18px]" />, value: '~6,200', label: 'PSEi Index' },
              { icon: <FontAwesomeIcon icon={faBuilding} className="text-[18px]" />, value: '280+', label: 'Sociétés cotées' },
              { icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" />, value: '$75K', label: 'Min. visa SIRV' },
              { icon: <FontAwesomeIcon icon={faBullseye} className="text-[18px]" />, value: '6,500', label: 'Objectif 2026' },
            ]}
          />
        </section>

        {/* Callout - panorama général investissement */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Pour un panorama complet de l'investissement aux Philippines (immobilier, bourse, création d'entreprise), consultez notre guide général.
            </p>
            <Link
              href="/vivre-aux-philippines/travail-entreprise/investir-aux-philippines-guide-francais-2025"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline whitespace-nowrap"
            >
              Lire le guide complet
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Actions A et B - Info box */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-foreground">Actions de Classe A et Classe B</h3>
                <p className="text-muted-foreground mb-4">
                  De nombreuses sociétés philippines émettent deux classes d'actions :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">Classe A</span>
                    <p className="text-muted-foreground mt-2">Réservées aux citoyens philippins uniquement</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-primary/30">
                    <span className="px-3 py-1 border border-primary text-primary text-sm font-medium rounded-full">Classe B</span>
                    <p className="text-muted-foreground mt-2">Ouvertes aux étrangers ET aux Philippins (mêmes droits)</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 bg-card p-3 rounded-lg">
                  <strong className="text-foreground">Note :</strong> La participation étrangère totale dans une société ne peut généralement pas dépasser 40% du capital,
                  sauf dans certains secteurs non restreints.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment investir */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Deux options selon votre statut"
            title="Comment investir"
            accent="à la PSE"
            description="Le choix dépend surtout de votre statut de résidence. Un broker international type Interactive Brokers ou Boom Securities s'ouvre à distance, sans mettre les pieds aux Philippines ; un broker local comme COL Financial ou BDO/BPI Securities suppose un visa résident, une ACR I-Card et souvent un passage en agence."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Broker International */}
            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/30 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Broker International</h3>
                  <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Recommandé</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                La solution la plus simple pour les non-résidents. Ouverture 100% en ligne.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 bg-card rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>Interactive Brokers</strong> - Frais bas, multi-marchés</span>
                </div>
                <div className="flex items-center gap-2 bg-card rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>Boom Securities</strong> - Spécialisé Asie</span>
                </div>
                <div className="flex items-center gap-2 bg-card rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>XTB</strong> - CFD sur actions PH</span>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Documents :</strong> Passeport, justificatif de domicile, W-8BEN si broker US
                </p>
              </div>
            </div>

            {/* Broker Local */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Broker Local</h3>
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">Si résident</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Pour résidents ou détenteurs de visa long séjour. Visite en agence souvent requise.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>COL Financial</strong> - Le plus populaire, app mobile</span>
                </div>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>First Metro Securities</strong> - Filiale Metrobank</span>
                </div>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>BDO / BPI Securities</strong> - Grandes banques</span>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Documents :</strong> Passeport + visa résident, ACR I-Card, TIN, preuve d'adresse locale
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Repère éditorial — le passage du broker en ligne au broker local */}
      <SplitSection
        eyebrow="Résident ou pas"
        title="Choisir son"
        titleAccent="courtier"
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Agence bancaire aux Philippines proposant un service de courtage en actions"
        reverse
      >
        <p>
          Sans visa résident, la voie la plus rapide reste un broker international : ouverture 100 %
          en ligne, avec pour seuls documents un passeport, un justificatif de domicile et, pour les
          plateformes américaines, un formulaire W-8BEN.
        </p>
        <p>
          Une fois installé sur place avec un visa long séjour, un broker local comme COL Financial
          ou une filiale de banque (BDO, BPI) devient accessible — au prix d'un dossier plus lourd :
          ACR I-Card, TIN et souvent une visite en agence.
        </p>
        <p className="!mt-5">
          Cette seconde voie ouvre aussi la porte aux services bancaires classiques, pratiques pour
          rapatrier des dividendes ou gérer un compte au quotidien.
        </p>
      </SplitSection>

      <div className="container mx-auto px-4 pb-12">

        {/* Fiscalité */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Ce que le fisc philippin retient"
            title="Fiscalité des"
            accent="investissements"
            description="Chaque flux — dividende, plus-value, frais de courtage — a son propre taux. Les dividendes versés à une personne physique sont retenus à la source à 25 %, contre 30 % pour une société étrangère, sauf réduction par convention fiscale."
          />
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left font-semibold">Type de Revenu</th>
                    <th className="p-4 text-center font-semibold">Taux</th>
                    <th className="p-4 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Dividendes (personne physique)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">25%</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">Retenue à la source</td>
                  </tr>
                  <tr className="bg-muted/50 border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Dividendes (société étrangère)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">30%</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">Réductible par convention fiscale</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Taxe sur transaction (vente)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">0.6%</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">Stock Transaction Tax</td>
                  </tr>
                  <tr className="bg-muted/50 border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Frais PSE (achat/vente)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">0.005%</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">Sur le montant brut</td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">TVA sur frais courtage</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">12%</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">Sur les commissions du broker</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              💡 La France a une convention fiscale avec les Philippines. Consultez un conseiller fiscal.
            </p>
          </div>
        </section>

        {/* Secteurs porteurs */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Où se concentre la croissance"
            title="Secteurs porteurs"
            accent="en 2026"
            description="De l'immobilier commercial aux télécoms, six secteurs concentrent l'essentiel de la capitalisation du PSEi. Les conglomérats familiaux et les banques dominent l'indice, pendant que la consommation et la tech captent la croissance de la classe moyenne."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Immobilier */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Immobilier</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Promoteurs avec portefeuilles diversifiés (malls, bureaux, résidentiel).
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">SMPH</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">ALI</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">MEG</span>
              </div>
            </div>

            {/* Services Financiers */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Banques & Finance</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Bancarisation croissante, fintech en expansion.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">BDO</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">BPI</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">MBT</span>
              </div>
            </div>

            {/* Consommation */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Consommation</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Classe moyenne en expansion, F&B et retail.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">JFC</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">URC</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">PGOLD</span>
              </div>
            </div>

            {/* Télécoms */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Télécoms & Tech</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Internet, data centers, 5G, services cloud.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">PLDT</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">GLO</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">CNVRG</span>
              </div>
            </div>

            {/* Utilities */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Utilities & Énergie</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Demande croissante, renouvelables en hausse.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">MER</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">AP</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">FGEN</span>
              </div>
            </div>

            {/* Conglomérats */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-primary p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Conglomérats</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Holdings diversifiées, exposition multi-secteur.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">SM</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">AC</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">GTCAP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investir dans une entreprise non cotée */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Sortir du coté"
            title="Investir dans une entreprise"
            accent="non cotée"
            description="D'autres perspectives — et d'autres risques. La participation étrangère y reste plafonnée à 40 % dans la plupart des secteurs, sauf ceux ouverts à 100 % listés dans la FINL (Foreign Investment Negative List)."
          />
          <div className="max-w-4xl mx-auto">
            {/* Alerte 40% */}
            <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Règle des 40%</h3>
                  <p className="text-muted-foreground">
                    La participation étrangère dans une entreprise philippine non cotée est généralement limitée à <strong className="text-foreground">40%</strong>.
                    Certains secteurs (export, tech) permettent 100% de propriété étrangère. Vérifiez toujours la <strong className="text-foreground">FINL</strong> (Foreign Investment Negative List).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Avantages */}
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Avantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-foreground">Potentiel de rendement élevé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-foreground">Accès à des secteurs non cotés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-foreground">Influence directe sur la gestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-foreground">Peut donner accès au visa SIRV</span>
                  </li>
                </ul>
              </div>

              {/* Risques */}
              <div className="bg-destructive/5 rounded-xl p-6 border border-destructive/20">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
                  </div>
                  Risques
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-foreground">Liquidité faible ou nulle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-foreground">Due diligence complexe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-foreground">Risque de fraude plus élevé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-foreground">Sortie difficile à négocier</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SIRV */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Résidence par l'investissement"
            title="Visa investisseur"
            accent="SIRV"
            description="Un investissement de 75 000 $US minimum peut aussi ouvrir droit à la résidence permanente. Une alternative aux visas de retraite, pensée pour les investisseurs encore actifs professionnellement — l'immobilier n'y est en revanche pas éligible."
          />
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/30 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Special Investor's Resident Visa</h3>
                  <p className="text-muted-foreground">Résidence permanente pour investisseurs</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Le SIRV permet de résider indéfiniment aux Philippines en échange d'un investissement qualifié.
                Alternative intéressante aux visas de retraite pour les investisseurs actifs.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-xl p-5 border border-border">
                  <h4 className="font-semibold mb-4 text-foreground">Conditions Principales</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Investissement minimum : <strong>75 000 $US</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Âge minimum : <strong>21 ans</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Casier judiciaire vierge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Frais de dossier : ~300 $US</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                  <h4 className="font-semibold mb-4 text-foreground">Investissements Éligibles</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Actions de sociétés cotées (PSE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">Entreprises secteurs prioritaires (IPP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-destructive-foreground" />
                      </div>
                      <span className="text-destructive"><strong>Immobilier NON éligible</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Timeline SIRV */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h4 className="font-semibold mb-4 text-foreground">Processus d'obtention</h4>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <span className="text-foreground">Dépôt 75 000 $+ (DBP/Land Bank)</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-primary/40 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <span className="text-foreground">Visa probatoire</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-primary/40 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <span className="text-foreground">Conversion (180j)</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-primary/40 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <span className="text-foreground">Visa permanent</span>
                  </div>
                </div>
              </div>

              <a
                href="https://boi.gov.ph/wp-content/uploads/2019/11/SIRV-FAQ.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                FAQ officielle SIRV (BOI)
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Avant de placer vos fonds"
            title="Conseils"
            accent="pratiques"
            description="Diversifiez plutôt que de tout miser sur un seul secteur, et anticipez des retenues à la source élevées — 25 à 30 % selon le cas. Vérifiez systématiquement qu'un courtier est licencié auprès de la SEC Philippines avant de lui confier des fonds."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Diversifiez</h3>
              <p className="text-muted-foreground">
                Ne concentrez pas tout sur un seul secteur.
                Combinez actions, immobilier et peut-être une participation dans une PME locale.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Anticipez la Fiscalité</h3>
              <p className="text-muted-foreground">
                Retenues à la source élevées (25-30%). Vérifiez les conventions
                fiscales France-Philippines et consultez un expert.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Documentez Tout</h3>
              <p className="text-muted-foreground">
                Conservez tous les justificatifs de transferts et achats d'actions.
                Nécessaires pour le rapatriement des dividendes.
              </p>
            </div>

            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-accent-strong" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Méfiez-vous des Arnaques</h3>
              <p className="text-muted-foreground">
                N'investissez que via des courtiers licenciés SEC Philippines.
                Vérifiez toujours les registres officiels.
              </p>
            </div>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <CardGrid eyebrow="À consulter" title="Ressources" titleAccent="officielles" columns={3}>
            <a
              href="https://www.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <LineChart className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">Philippine Stock Exchange</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://edge.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <BarChart3 className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">PSE Edge (données)</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.sec.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Shield className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">SEC Philippines</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://boi.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Briefcase className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">Board of Investments</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.colfinancial.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <TrendingUp className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">COL Financial</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.firstmetrosec.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Building2 className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium text-foreground">First Metro Securities</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardGrid>
        </section>

        {/* FAQ — questions fréquentes, dérivées du contenu de la page ci-dessus */}
        <section className="mb-16">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Investir en bourse,"
            titleAccent="en clair"
            faqs={BOURSE_FAQS}
            withSchema
          />
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <CardGrid eyebrow="Pour aller plus loin" title="Continuez votre" titleAccent="exploration" columns={3}>
            <LinkCard
              title="Investir en Immobilier"
              href="/vivre-aux-philippines/investir/immobilier"
              icon={<Building className="h-5 w-5" />}
            />
            <LinkCard
              title="Créer une Entreprise"
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              icon={<Briefcase className="h-5 w-5" />}
            />
            <LinkCard
              title="Visas et Permis"
              href="/vivre-aux-philippines/visas-et-formalites"
              icon={<FileText className="h-5 w-5" />}
            />
          </CardGrid>
        </section>
      </div>
    </div>
  );
};

export default BourseEntreprisesPage;
