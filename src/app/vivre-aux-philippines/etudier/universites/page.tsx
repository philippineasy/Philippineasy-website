import { Metadata } from 'next';
import { GraduationCap, FileText, Award, CheckCircle, ExternalLink, Clock, DollarSign, BookOpen, Home, Utensils, Bus, Smartphone, Building2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faGlobe, faSackDollar, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, CTABand, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Étudier aux Philippines en 2026 : Universités, Programmes et Visa 9F",
  description: "Guide complet pour étudier aux Philippines : meilleures universités (UP, Ateneo, DLSU), frais de scolarité, visa étudiant 9F, programmes en anglais 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/etudier/universites',
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
    title: "Étudier aux Philippines en 2026 : Universités, Programmes et Visa 9F",
    description: "Guide complet pour étudier aux Philippines : meilleures universités, frais de scolarité, visa étudiant, programmes en anglais.",
    url: 'https://philippineasy.com/vivre-aux-philippines/etudier/universites',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Étudier aux Philippines en 2026",
    description: "Guide : universités philippines, frais, visa étudiant 9F.",
    site: '@philippineasy',
  },
};

/* -------------------------------------------------------------------------- */
/* Petit bloc éditorial local (server component), repris de la recette       */
/* validée sur visas-et-formalites : eyebrow + h2 à mot accentué.            */
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

// FAQ 100 % factuelle — reformulée à partir du contenu de la page ci-dessous
// (intro, classements, Big Three, frais de scolarité, visa 9(F), budget).
const UNIVERSITES_FAQS = [
  {
    q: 'Faut-il déjà parler couramment anglais pour étudier aux Philippines ?',
    a: "Pas nécessairement un test de langue formel : la quasi-totalité des programmes universitaires sont enseignés en anglais, et le pays est le 3ème plus grand pays anglophone au monde. Pour un étudiant venant d'un pays anglophone ou ayant suivi un cursus en anglais, aucun test n'est généralement exigé à l'inscription.",
  },
  {
    q: 'Quelles sont les universités philippines les plus reconnues ?',
    a: "Trois établissements forment le \"Big Three\" : University of the Philippines (publique, fondée en 1908, frais les plus bas), Ateneo de Manila (privée jésuite, #1 aux THE Rankings Philippines) et De La Salle University (privée, forte en ingénierie et commerce). University of Santo Tomas, la plus ancienne université d'Asie, complète ce quatuor de tête.",
  },
  {
    q: 'Combien coûtent des études universitaires aux Philippines ?',
    a: "Cela dépend du statut de l'établissement : de 20 000 à 60 000 ₱/an (≈320-960 €) dans le public, jusqu'à 150 000-250 000 ₱/an (≈2 400-4 000 €) dans le privé premium comme Ateneo ou DLSU, et 200 000-400 000 ₱/an pour les filières médecine. Les étudiants internationaux paient généralement 20 à 50 % de plus que leurs camarades philippins.",
  },
  {
    q: 'Le visa étudiant 9(F) est-il obligatoire ?',
    a: "Oui, pour tout cursus supérieur de plus de 30 jours. Il faut avoir 18 ans minimum, une lettre d'acceptation d'une université accréditée CHED, une preuve de moyens financiers et un casier judiciaire vierge. Comptez 2 à 8 semaines de délai et 250-400 US$ de frais selon la nationalité ; le visa est valable 1 an renouvelable, et une ACR I-Card est requise après l'arrivée.",
  },
  {
    q: 'Quel budget mensuel prévoir en dehors de la scolarité ?',
    a: "Comptez environ 20 000 à 40 000 ₱ par mois (≈320-640 €) à Metro Manila, hors frais de scolarité : logement, nourriture, transport, téléphone/internet et fournitures. C'est le budget de vie courante d'un étudiant installé dans la capitale.",
  },
];

const ressources = [
  { name: 'CHED (Commission on Higher Ed)', url: 'https://ched.gov.ph/', domain: 'ched.gov.ph' },
  { name: 'Bureau of Immigration', url: 'https://immigration.gov.ph/student-visa-9f/', domain: 'immigration.gov.ph' },
  { name: 'QS Rankings Philippines', url: 'https://www.topuniversities.com/asia-university-rankings?countries=ph', domain: 'topuniversities.com' },
  { name: 'University of the Philippines', url: 'https://www.up.edu.ph/', domain: 'up.edu.ph' },
  { name: 'Ateneo de Manila', url: 'https://www.ateneo.edu/', domain: 'ateneo.edu' },
  { name: 'De La Salle University', url: 'https://www.dlsu.edu.ph/', domain: 'dlsu.edu.ph' },
];

const UniversitesPage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Étudier aux"
        titleAccent="Philippines"
        subtitle="Un enseignement de qualité en anglais, des frais abordables et une expérience culturelle unique pour les étudiants internationaux."
        imageUrl="/imagesHero/ou-et-comment-etudier-aux-philippines.webp"
        imageAlt="Étudier aux Philippines"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="L'enseignement supérieur philippin"
            title="Une éducation en anglais,"
            accent="à prix philippin"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Chaque année, un nombre croissant d&apos;étudiants internationaux posent leurs
              valises aux Philippines pour un cursus en anglais, dans un pays où les frais de
              scolarité restent largement accessibles. En 2026, <strong>35 universités
              philippines</strong> figurent au classement QS Asia, l&apos;Université des
              Philippines en tête — une institution publique fondée en 1908 qui reste la
              référence nationale.
            </p>
            <p>
              De Manille à Cebu, les trois grandes universités historiques (UP, Ateneo, DLSU)
              côtoient des campus plus modestes mais tout aussi sérieux. Voici comment choisir,
              établissement par établissement, avec les frais et le calendrier d&apos;admission à
              jour pour 2026.
            </p>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '35', label: 'Universités classées QS Asia', icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" /> },
                { value: '3ème', label: 'Pays anglophone mondial', icon: <FontAwesomeIcon icon={faGlobe} className="text-[18px]" /> },
                { value: '€320', label: 'Budget mensuel min.', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
                { value: '1908', label: 'Fondation UP Diliman', icon: <FontAwesomeIcon icon={faLandmark} className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Programmes en anglais (photo dialogue interculturel, à gauche) */}
      <SplitSection
        tone="muted"
        eyebrow="Un avantage rare en Asie"
        title="Étudier en"
        titleAccent="anglais"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Étudiants échangeant en anglais dans un environnement multiculturel aux Philippines"
      >
        <p>
          La quasi-totalité des programmes universitaires aux Philippines sont enseignés en
          anglais, du premier cours de licence jusqu&apos;au doctorat. Ce n&apos;est pas un
          hasard : le pays est le 3ème plus grand pays anglophone au monde, une conséquence
          directe de son histoire et de son système éducatif.
        </p>
        <p>
          Pour un étudiant venant d&apos;un pays anglophone, ou ayant suivi un cursus en anglais,
          aucun test de langue formel n&apos;est généralement exigé à l&apos;inscription — un
          frein de moins sur le chemin de l&apos;admission.
        </p>
      </SplitSection>

      {/* Classements internationaux (fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Excellence académique" title="Classements" accent="internationaux 2026" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Les rankings internationaux donnent un premier repère sérieux avant de choisir. QS
              Asia et Times Higher Education (THE) évaluent chaque année la recherche, la
              réputation académique et l&apos;employabilité des diplômés — et quatre
              établissements philippins reviennent systématiquement en tête.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {/* UP */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of the Philippines</h3>
                <p className="text-sm text-muted-foreground">Publique • 8 campus nationaux</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #362</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #104</span>
              </div>
            </div>

            {/* Ateneo */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">Ateneo de Manila University</h3>
                <p className="text-sm text-muted-foreground">Privée Jésuite • Quezon City</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #511</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #141</span>
              </div>
            </div>

            {/* DLSU */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">De La Salle University</h3>
                <p className="text-sm text-muted-foreground">Privée Lasallienne • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #654</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #178</span>
              </div>
            </div>

            {/* UST */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">4</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of Santo Tomas</h3>
                <p className="text-sm text-muted-foreground">Plus ancienne d&apos;Asie (1611) • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS 851-900</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #184</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big Three (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Les trois références" title="Le" accent="Big Three" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Trois noms reviennent invariablement dans toute discussion sur les études
              supérieures aux Philippines : University of the Philippines, Ateneo de Manila et De
              La Salle University. Chacune a son identité — recherche publique, tradition
              jésuite, ingénierie appliquée — et des frais qui varient du simple au triple.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* UP */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">University of the Philippines</h3>
                </div>
                <p className="text-sm text-muted-foreground">Publique • Fondée en 1908</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Le système universitaire national avec 8 campus à travers le pays. UP Diliman (Quezon City)
                  est le plus prestigieux et le plus grand.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Sciences, Droit, Arts, Médecine</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Frais les plus bas du Big Three</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Réseau alumni très influent</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱1,000-2,000/unité (internationaux paient plus)</p>
                </div>
                <a
                  href="https://www.up.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  up.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Ateneo */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Ateneo de Manila University</h3>
                </div>
                <p className="text-sm text-muted-foreground">Privée Jésuite • Fondée en 1859</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Université privée jésuite à Quezon City, connue pour son excellence en sciences humaines,
                  business et son campus verdoyant et moderne.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Business, Droit, Sciences Sociales</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>#1 THE Rankings Philippines</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Communauté étudiante active</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ~₱5,200/unité (~₱104,000/semestre)</p>
                </div>
                <a
                  href="https://www.ateneo.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  ateneo.edu <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* DLSU */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">De La Salle University</h3>
                </div>
                <p className="text-sm text-muted-foreground">Privée Lasallienne • Fondée en 1911</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Université catholique au cœur de Manille (Taft Avenue), leader en ingénierie,
                  informatique et commerce.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Ingénierie, IT, Commerce</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Recherche et publications</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Liens forts avec l&apos;industrie</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱160,000-200,000/an</p>
                </div>
                <a
                  href="https://www.dlsu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  dlsu.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres universités (fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="D'autres pistes sérieuses" title="Autres universités" accent="reconnues" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Le Big Three ne résume pas tout : plusieurs établissements offrent une formation
              solide à des tarifs nettement plus accessibles, souvent hors de Manille — de bonnes
              options pour un budget plus serré ou une spécialité précise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of Santo Tomas</h3>
                <p className="text-sm text-muted-foreground mb-2">Plus ancienne université d&apos;Asie (1611). Excellence en Médecine et Architecture.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱100,000-150,000/an</span>
                  <span className="text-xs text-muted-foreground">Manila</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mapua University</h3>
                <p className="text-sm text-muted-foreground mb-2">Leader en ingénierie et technologie. Campus moderne à Makati et Intramuros.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱80,000-120,000/an</span>
                  <span className="text-xs text-muted-foreground">Manila/Makati</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Silliman University</h3>
                <p className="text-sm text-muted-foreground mb-2">Environnement paisible à Dumaguete, excellent pour les sciences marines.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱60,000-120,000/an</span>
                  <span className="text-xs text-muted-foreground">Dumaguete</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of San Carlos</h3>
                <p className="text-sm text-muted-foreground mb-2">Bonne réputation en commerce et sciences. Cadre de vie agréable à Cebu.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱50,000-100,000/an</span>
                  <span className="text-xs text-muted-foreground">Cebu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frais de scolarité (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Le nerf de la guerre" title="Frais de scolarité" accent="par catégorie" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Le montant de la scolarité dépend avant tout du statut de l&apos;établissement —
              public, privé milieu de gamme ou privé haut de gamme — et de la filière choisie. Les
              étudiants internationaux paient généralement 20 à 50 % de plus que leurs camarades
              philippins, un supplément à intégrer dans le budget dès le départ.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Public */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/35 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Universités Publiques</h3>
                    <p className="text-sm text-muted-foreground">UP System, PUP, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱20,000-60,000</p>
                    <p className="text-sm text-muted-foreground">€320-960/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-primary/35"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid-range */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/55 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Mid-Range</h3>
                    <p className="text-sm text-muted-foreground">Silliman, San Carlos, Mapua</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱60,000-120,000</p>
                    <p className="text-sm text-muted-foreground">€960-1,920/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary/55"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/75 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Premium</h3>
                    <p className="text-sm text-muted-foreground">Ateneo, DLSU, UST</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱150,000-250,000</p>
                    <p className="text-sm text-muted-foreground">€2,400-4,000/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary/75"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Programmes Médecine/Dentaire</h3>
                    <p className="text-sm text-muted-foreground">UST, UP, DLSU</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱200,000-400,000</p>
                    <p className="text-sm text-muted-foreground">€3,200-6,400/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            * Conversion : 1€ ≈ ₱62.5
          </p>
        </div>
      </section>

      {/* Visa étudiant 9(F) (fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Formalités" title="Visa étudiant" accent="9(F)" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Une fois l&apos;admission décrochée, direction les démarches administratives : le
              visa étudiant 9(F) est obligatoire pour tout cursus supérieur de plus de 30 jours.
              Voici les conditions à remplir et les pièces à réunir avant de déposer votre dossier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            {/* Conditions */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Conditions d&apos;Éligibilité</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>18 ans minimum à l&apos;inscription</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acceptation d&apos;une université accréditée CHED</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Preuve de moyens financiers suffisants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Casier judiciaire vierge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Certificat médical</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Documents Requis</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Lettre d&apos;acceptation de l&apos;université</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Passeport valide 6+ mois</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Formulaire FA-2 + Personal History Statement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Relevés bancaires / affidavit de support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Transcripts authentifiés par l&apos;ambassade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats visa */}
          <div className="bg-card rounded-xl border border-border p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center px-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Délai</p>
                <p className="text-primary font-bold">2-8 semaines</p>
                <p className="text-xs text-muted-foreground">Commencer 3 mois avant</p>
              </div>
              <div className="text-center px-4">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Frais</p>
                <p className="text-primary font-bold">US$250-400</p>
                <p className="text-xs text-muted-foreground">Selon nationalité</p>
              </div>
              <div className="text-center px-4">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Validité</p>
                <p className="text-primary font-bold">1 an renouvelable</p>
                <p className="text-xs text-muted-foreground">ACR I-Card requis après arrivée</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus admission - Timeline (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Étape par étape" title="Processus" accent="d'admission" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Entre la première recherche de programme et la rentrée d&apos;août, comptez
              généralement plusieurs mois. Voici les cinq étapes qui jalonnent une admission
              réussie dans une université philippine.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  1
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Recherche et Candidature</h3>
                  <p className="text-muted-foreground text-sm">
                    Identifiez les programmes qui vous intéressent et vérifiez les dates limites.
                    Soumettez votre dossier en ligne avec transcripts, lettre de motivation et recommandations.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  2
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Tests et Entretien</h3>
                  <p className="text-muted-foreground text-sm">
                    Certaines universités exigent un test d&apos;entrée (ACET pour Ateneo, DCAT pour DLSU, UPCAT pour UP).
                    Un test d&apos;anglais peut être requis.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  3
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Lettre d&apos;Acceptation</h3>
                  <p className="text-muted-foreground text-sm">
                    Une fois accepté, vous recevez une lettre officielle. L&apos;université initie ensuite
                    votre demande de visa auprès de la CHED et du DFA.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  4
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Demande de Visa 9(F)</h3>
                  <p className="text-muted-foreground text-sm">
                    Déposez votre demande à l&apos;ambassade des Philippines avec tous les documents.
                    Vous pouvez aussi entrer avec un visa touriste et convertir sur place.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start gap-6 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  5
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Arrivée et Enregistrement</h3>
                  <p className="text-muted-foreground text-sm">
                    À votre arrivée, enregistrez-vous au Bureau of Immigration pour obtenir votre ACR I-Card.
                    Finalisez votre inscription à l&apos;université.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget étudiant mensuel (photo marché local, à droite) */}
      <SplitSection
        reverse
        eyebrow="Vie quotidienne"
        title="Budget étudiant"
        titleAccent="mensuel"
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Marché de fruits locaux aux Philippines, repère pour le budget alimentation d'un étudiant"
      >
        <p>
          Au-delà des frais de scolarité, la vie quotidienne à Metro Manila a aussi son prix.
          Loyer, repas, transport, connexion : voici une estimation réaliste, hors scolarité, pour
          un étudiant installé dans la capitale.
        </p>
        <div className="!mt-6 bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">Logement</span>
                  <span className="block text-sm text-muted-foreground">Chambre ou studio près du campus</span>
                </div>
              </div>
              <span className="font-semibold text-foreground">₱8,000-20,000</span>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">Nourriture</span>
                  <span className="block text-sm text-muted-foreground">Cantine, restaurants, courses</span>
                </div>
              </div>
              <span className="font-semibold text-foreground">₱6,000-12,000</span>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">Transport</span>
                  <span className="block text-sm text-muted-foreground">Jeepney, MRT, Grab</span>
                </div>
              </div>
              <span className="font-semibold text-foreground">₱2,000-5,000</span>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">Téléphone et Internet</span>
                  <span className="block text-sm text-muted-foreground">Forfait data + WiFi</span>
                </div>
              </div>
              <span className="font-semibold text-foreground">₱1,000-2,000</span>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">Livres et fournitures</span>
                  <span className="block text-sm text-muted-foreground">Par semestre (lissé/mois)</span>
                </div>
              </div>
              <span className="font-semibold text-foreground">₱500-1,000</span>
            </div>
          </div>

          <div className="bg-primary/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-bold text-lg text-foreground">Budget mensuel total</span>
                <span className="block text-sm text-muted-foreground">Hors frais de scolarité</span>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-primary">₱20,000-40,000</span>
                <span className="block text-sm text-muted-foreground">≈ €320-640/mois</span>
              </div>
            </div>
          </div>
        </div>
      </SplitSection>

      {/* Ressources officielles (cartes justifiées : liens externes) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="Pour creuser" title="Ressources" titleAccent="officielles" columns={3}>
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

      {/* Navigation interne */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="border-t border-border pt-14">
            <CardGrid
              eyebrow="Pour aller plus loin"
              title="Continuez votre"
              titleAccent="exploration"
              columns={3}
            >
              <LinkCard
                title="Écoles Internationales"
                href="/vivre-aux-philippines/etudier/ecoles-internationales"
                desc="Pour les enfants d'expatriés, de la maternelle au lycée."
                cta="En savoir plus"
              />
              <LinkCard
                title="Visas et Permis"
                href="/vivre-aux-philippines/visas-et-formalites"
                desc="Le guide complet sur le visa 9(F) et les autres statuts."
                cta="En savoir plus"
              />
              <LinkCard
                title="Trouver un Logement"
                href="/vivre-aux-philippines/logement"
                desc="Où loger une fois sur le campus."
                cta="En savoir plus"
              />
            </CardGrid>
          </div>
        </div>
      </section>

      {/* FAQ — questions fréquentes, dérivées du contenu de la page ci-dessus */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Étudier aux Philippines,"
            titleAccent="en clair"
            faqs={UNIVERSITES_FAQS}
            withSchema
          />
        </div>
      </section>

      {/* Panneau signature de clôture */}
      <CTABand
        title="Une question sur"
        titleAccent="votre admission ?"
        subtitle="Posez votre cas à la communauté d'expatriés sur le forum, ou découvrez les écoles internationales si vous cherchez plutôt pour vos enfants."
        primary={{ label: 'Poser ma question sur le forum', href: '/forum-sur-les-philippines' }}
        secondary={{ label: 'Voir les écoles internationales', href: '/vivre-aux-philippines/etudier/ecoles-internationales' }}
      />
    </div>
  );
};

export default UniversitesPage;
