import { Metadata } from 'next';
import { School, BookOpen, DollarSign, MapPin, Globe, Users, Award, FileCheck, GraduationCap, Languages, Shield, Building2, ExternalLink, CheckCircle, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faGlobe, faUsers, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, CTABand, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Écoles Internationales aux Philippines en 2026 : Guide Complet",
  description: "Guide complet des écoles internationales aux Philippines en 2026 : ISM, BSM, Brent, Nord Anglia. Frais de scolarité, curricula IB et britannique, admission et visas pour enfants d'expatriés.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/etudier/ecoles-internationales',
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
    title: "Écoles Internationales aux Philippines en 2026 : Guide Complet",
    description: "Guide complet des écoles internationales aux Philippines : ISM, BSM, Brent, Nord Anglia. Frais de scolarité, curricula et admission.",
    url: 'https://philippineasy.com/vivre-aux-philippines/etudier/ecoles-internationales',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Écoles Internationales aux Philippines en 2026",
    description: "Guide complet des écoles internationales aux Philippines : ISM, BSM, Brent, Nord Anglia, frais et admission.",
    site: '@philippineasy',
  },
};

/* -------------------------------------------------------------------------- */
/* Petit bloc éditorial local (server component), repris de la recette       */
/* validée sur visas-et-formalites / universites : eyebrow + h2 à mot        */
/* accentué.                                                                  */
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
// (visa des enfants, frais de scolarité, curricula, support EAL, admission).
const ECOLES_FAQS = [
  {
    q: "Faut-il un visa étudiant spécifique pour mon enfant ?",
    a: "Pas toujours. Les enfants mineurs (moins de 21 ans, non mariés) de titulaires d'un visa 9(g) travail, 9(d) diplomatique, SIRV ou SRRV sont exemptés du visa étudiant 9(f) et peuvent étudier avec un visa de dépendant lié à celui du parent. Sinon, un visa 9(f) reste nécessaire, pour environ ₱3 000-5 000.",
  },
  {
    q: "Combien coûte une scolarité dans une école internationale ?",
    a: "Comptez de 6 000 à 24 000 € par an selon l'école et le niveau. À titre d'exemple, ISM atteint environ 24 000 €/an, BSM se situe entre 10 000 et 22 500 €, et le pôle franco-allemand GESM démarre à partir de 6 500 € en maternelle — nettement plus abordable que les écoles anglo-saxonnes.",
  },
  {
    q: "Quels curricula proposent ces écoles ?",
    a: "Les principaux sont le IB (PYP, MYP, DP), l'américain (AP), le britannique (IGCSE, A-Levels) et le français (AEFE, au Lycée Français de Manille/GESM). Chaque établissement combine généralement deux de ces programmes, comme ISM (IB + AP) ou BSM (British + IB).",
  },
  {
    q: "Mon enfant ne parle pas encore bien anglais, est-ce un problème ?",
    a: "La plupart des écoles proposent un accompagnement English as an Additional Language (EAL) pour aider les enfants francophones à s'intégrer. À ISM par exemple, ce programme coûte 1 625 $/semestre la première année, puis 1 100 $/semestre la deuxième.",
  },
  {
    q: "Combien de temps à l'avance faut-il s'inscrire ?",
    a: "Comptez 6 à 12 mois avant la rentrée d'août : ISM et BSM ont notamment des listes d'attente pour les niveaux 6 à 10. Le dossier (formulaire, bulletins, recommandations) coûte entre 200 et 600 $, et la décision arrive généralement sous 2 à 4 semaines après les évaluations et l'entretien.",
  },
];

const ressources = [
  { name: 'ISM', url: 'https://www.ismanila.org/', domain: 'ismanila.org' },
  { name: 'British School Manila', url: 'https://www.britishschoolmanila.org/', domain: 'britishschoolmanila.org' },
  { name: 'Nord Anglia', url: 'https://www.nordangliaeducation.com/nais-manila', domain: 'nordangliaeducation.com' },
  { name: 'Brent International', url: 'https://www.brent.edu.ph/', domain: 'brent.edu.ph' },
  { name: 'GESM (Eurocampus)', url: 'https://www.gesm.org/', domain: 'gesm.org' },
  { name: 'CIS Cebu', url: 'https://cis.edu.ph/', domain: 'cis.edu.ph' },
  { name: 'Visa 9(f) - BI', url: 'https://immigration.gov.ph/student-visa-9f/', domain: 'immigration.gov.ph' },
  { name: "Council of Int'l Schools", url: 'https://www.cois.org/', domain: 'cois.org' },
  { name: 'IB Organization', url: 'https://www.ibo.org/', domain: 'ibo.org' },
];

const EcolesInternationalesPage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Les Écoles"
        titleAccent="Internationales"
        subtitle="Offrez à vos enfants une éducation de classe mondiale dans un environnement multiculturel aux Philippines."
        imageUrl="/imagesHero/ou-et-comment-etudier-aux-philippines.webp"
        imageAlt="Les Écoles Internationales"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Éducation des enfants d'expatriés"
            title="Scolariser ses enfants,"
            accent="sans compromis"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Partir vivre aux Philippines ne signifie pas mettre la scolarité de vos enfants
              entre parenthèses. Le pays compte une vingtaine d&apos;écoles internationales
              accréditées, concentrées pour l&apos;essentiel à Metro Manila, où curricula IB,
              américain et britannique côtoient un vrai brassage de nationalités.
            </p>
            <p>
              De la maternelle à la terminale, ces établissements visent les mêmes standards
              qu&apos;en Europe ou aux États-Unis, avec des classes réduites et un encadrement
              personnalisé. Voici les écoles qui comptent, leurs frais de scolarité et les
              démarches de visa pour vos enfants.
            </p>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '20+', label: 'Écoles accréditées', icon: <FontAwesomeIcon icon={faSchool} className="text-[18px]" /> },
                { value: '50+', label: 'Nationalités', icon: <FontAwesomeIcon icon={faGlobe} className="text-[18px]" /> },
                { value: '15-22', label: 'Élèves/classe', icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" /> },
                { value: '6-24K€', label: 'Scolarité/an', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Avantages clés (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Le choix qui structure le séjour" title="Pourquoi une école" accent="internationale" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Six raisons reviennent systématiquement dans les échanges avec les familles
              installées à Manille ou à Cebu — du programme académique à la reconnaissance
              internationale des diplômes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Curricula Internationaux</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">AP</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IGCSE</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Français</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Programmes IB (PYP, MYP, DP), américain (AP), britannique (IGCSE, A-Levels) et français (AEFE).
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Environnement Multiculturel</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                40 à 60 nationalités par école. À ISM, plus de 50 nationalités parmi 2 200 élèves.
                Ouverture d&apos;esprit et maîtrise de plusieurs langues.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Classes Réduites</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                15 à 22 élèves maximum par classe. Enseignants internationaux hautement qualifiés.
                Suivi personnalisé garanti.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Accréditations</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">CIS</span>
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">WASC</span>
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">IBO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Seules 22% des écoles internationales dans le monde obtiennent ces accréditations prestigieuses.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Localisation</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Majoritairement à Metro Manila : BGC, Makati, Parañaque, Alabang.
                Accès facile depuis les quartiers d&apos;expatriés.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Débouchés</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Accès aux meilleures universités mondiales. À ISM, 60% poursuivent aux USA,
                les autres en Europe, Australie et Asie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vie de famille et quartier (photo condominium, à gauche) */}
      <SplitSection
        eyebrow="Vie de famille"
        title="Un quartier,"
        titleAccent="une école"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Résidence avec piscine sous les palmiers, quartier résidentiel prisé des familles expatriées à Manille"
      >
        <p>
          Le choix de l&apos;école va souvent de pair avec celui du quartier. À Metro Manila,
          les familles expatriées se regroupent autour de BGC, Makati, Parañaque ou Alabang —
          des zones résidentielles avec condominiums sécurisés, parcs et commerces de proximité,
          à quelques minutes des principaux campus.
        </p>
        <p className="!mt-5">
          Un trajet scolaire court compte double avec de jeunes enfants : la circulation dense
          de Manille aux heures de pointe peut vite allonger un trajet pourtant modeste sur la
          carte. Beaucoup de familles choisissent d&apos;abord leur condominium en fonction de
          l&apos;école visée, plutôt que l&apos;inverse.
        </p>
      </SplitSection>

      {/* Principales écoles (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Les références de Metro Manila" title="Cinq écoles qui" accent="font référence" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              ISM, BSM, Nord Anglia, Brent et le pôle franco-allemand GESM concentrent l&apos;essentiel
              des inscriptions d&apos;enfants d&apos;expatriés dans la capitale. Chacune a sa personnalité
              — curriculum, taille, quartier — et des frais qui varient sensiblement d&apos;un
              établissement à l&apos;autre.
            </p>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {/* ISM */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">International School Manila (ISM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Plus ancienne d'Asie SE</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Depuis 1920</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Première école en Asie à proposer le programme IB Diploma. Située à BGC,
                    elle accueille plus de 2 200 élèves de 50+ nationalités.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> IB + AP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Langues:</strong> 7 langues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> WASC, CIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Candidature</span>
                      <span className="font-semibold">$600</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Matriculation</span>
                      <span className="font-semibold">$4,500</span>
                    </li>
                    <li className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-medium">Scolarité/an</span>
                      <span className="font-bold text-primary">~24,000€</span>
                    </li>
                  </ul>
                  <a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* BSM */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">British School Manila (BSM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Curriculum UK</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Depuis 1976</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Éducation britannique de premier plan à BGC. Plus de 1 000 élèves de 40+ nationalités.
                    Excellence académique et responsabilité sociale.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Âges:</strong> 3 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> CIS, COBIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Nursery-Y2</span>
                      <span className="font-semibold">10-15K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Y3-Y9</span>
                      <span className="font-semibold">~17K€</span>
                    </li>
                    <li className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-medium">Y10-Y13</span>
                      <span className="font-bold text-primary">~22,500€</span>
                    </li>
                  </ul>
                  <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Nord Anglia */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Nord Anglia (NAIS Manila)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Réseau mondial</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">MIT + Juilliard</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Partie du réseau mondial Nord Anglia (80+ écoles). Collaborations exclusives
                    avec le MIT (STEAM) et la Juilliard School (arts).
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Âges:</strong> 2 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Spécialité:</strong> STEAM, Arts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">1ère année (2 ans)</span>
                      <span className="font-semibold">~16,400€</span>
                    </li>
                    <li className="text-xs text-muted-foreground mt-2">
                      Frais progressifs selon niveau. Inclut inscription et matériel.
                    </li>
                  </ul>
                  <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Brent */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Brent International School</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">American</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Internat dispo</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Trois campus aux Philippines : Manila (Laguna), Subic et Baguio.
                    Excellentes infrastructures sportives. Option d&apos;internat disponible.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> American + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Élèves:</strong> 1000+ de 30+ pays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Spécialité:</strong> Sports, Boarding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Biñan, Laguna</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Scolarité/an</span>
                      <span className="font-semibold">10-21K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">1ère année (3 ans)</span>
                      <span className="font-semibold">~11,100€</span>
                    </li>
                  </ul>
                  <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* EIS/GESM */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">European International School / GESM</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Français</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Allemand</span>
                        <span className="px-2 py-0.5 bg-muted text-foreground border border-border text-xs rounded-full">Eurocampus</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Eurocampus" unique regroupant le GESM et le Lycée Français de Manille.
                    Premier des sept Eurocampus dans le monde. Idéal pour familles européennes.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> FR, DE, IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Langues:</strong> FR, DE, EN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> AEFE, ZfA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Kindergarten</span>
                      <span className="font-semibold">~6,500€</span>
                    </li>
                    <li className="text-xs text-muted-foreground mt-2">
                      Paiement mixte EUR + PHP. Plus abordable que les écoles anglo-saxonnes.
                    </li>
                  </ul>
                  <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Écoles hors Manila (fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="En dehors de la capitale" title="Cebu a aussi" accent="ses écoles" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Vivre à Cebu ou dans les Visayas ne veut pas dire renoncer à un curriculum
              international. Deux établissements y proposent un enseignement solide, dans un
              cadre nettement plus tranquille qu&apos;à Metro Manila.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Cebu International School</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Fondée en 1924 à Cebu City. IB World School (PYP, MYP, DP).
                Accréditée CIS, WASC et PAASCU.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">14,200 - 25,000€/an</span>
                <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:text-primary/80 flex items-center gap-1">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Singapore School Cebu</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Unique école à Cebu offrant Cambridge IGCSE + IB Diploma.
                Curriculum singapourien avec emphase STEM.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">Preschool → Pre-University</span>
                <a href="https://www.singaporeschoolcebu.com/" target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:text-primary/80 flex items-center gap-1">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau comparatif (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="En un coup d'œil" title="Comparatif des" accent="frais de scolarité" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Les frais annuels varient sensiblement d&apos;un établissement à l&apos;autre, et
              selon le niveau scolaire au sein d&apos;une même école. Voici les six écoles
              présentées plus haut, mises côte à côte pour faciliter la comparaison.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <div className="overflow-hidden rounded-2xl border border-border shadow-card-rest">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left font-semibold">École</th>
                    <th className="p-4 text-left font-semibold">Localisation</th>
                    <th className="p-4 text-center font-semibold">Curricula</th>
                    <th className="p-4 text-right font-semibold">Scolarité/an</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">ISM</td>
                    <td className="p-4 text-muted-foreground">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">AP</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~24,000€</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <td className="p-4 font-semibold">BSM</td>
                    <td className="p-4 text-muted-foreground">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">10-22,500€</td>
                  </tr>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">NAIS Manila</td>
                    <td className="p-4 text-muted-foreground">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~16,400€+</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <td className="p-4 font-semibold">Brent Manila</td>
                    <td className="p-4 text-muted-foreground">Biñan, Laguna</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">American</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">10-20,700€</td>
                  </tr>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">EIS/GESM</td>
                    <td className="p-4 text-muted-foreground">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">FR</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">DE</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~6,500€+</td>
                  </tr>
                  <tr className="bg-muted">
                    <td className="p-4 font-semibold">CIS Cebu</td>
                    <td className="p-4 text-muted-foreground">Cebu City</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">14-25,000€</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              * Tarifs indicatifs 2025-2026. Conversion : 1€ ≈ 58 PHP. Frais additionnels possibles.
            </p>
          </div>
        </div>
      </section>

      {/* Environnement multiculturel et intégration (photo dialogue, à droite) */}
      <SplitSection
        reverse
        eyebrow="Vivre avec 50 nationalités"
        title="S'intégrer, dans toutes les"
        titleAccent="langues"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Étudiants échangeant en anglais dans un environnement multiculturel, illustration de la vie dans une école internationale aux Philippines"
      >
        <p>
          Arriver dans une classe où l&apos;on ne connaît personne, dans une langue qui
          n&apos;est pas la sienne, reste l&apos;une des plus grandes inquiétudes des parents.
          Les écoles internationales y sont rodées : avec 40 à 60 nationalités représentées
          selon l&apos;établissement, l&apos;anglais devient vite la langue commune de la cour
          de récréation, bien avant celle de la salle de classe.
        </p>
        <p className="!mt-5">
          Un accompagnement English as an Additional Language (EAL) existe dans la plupart des
          écoles pour les enfants qui démarrent sans base solide en anglais — un vrai filet de
          sécurité les premiers mois, le temps que la nouvelle langue s&apos;installe.
        </p>
      </SplitSection>

      {/* Visa pour les enfants (fond muté) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Formalités" title="Le visa des" accent="enfants" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              L&apos;inscription à l&apos;école ne suffit pas : chaque enfant doit aussi être
              en règle avec l&apos;immigration philippine. Bonne nouvelle, la plupart n&apos;ont
              pas besoin d&apos;un visa étudiant à part entière — mais quelques cas particuliers
              demandent une vigilance supplémentaire.
            </p>
          </div>

          {/* Bonne nouvelle */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-primary/10 border border-primary/25 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Bonne nouvelle pour les expatriés</h3>
                  <p className="text-muted-foreground">
                    Les enfants mineurs (moins de 21 ans, non mariés) de titulaires de certains visas sont
                    <strong> exemptés</strong> du visa étudiant 9(f). Ils peuvent étudier avec un
                    <strong> visa de dépendant</strong> lié au visa principal du parent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Exemptés */}
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-primary-foreground" />
                </div>
                Enfants exemptés du visa étudiant
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Enfants des titulaires de ces visas :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>9(g)</strong> - Visa de travail</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>9(d)</strong> - Diplomatique/consulaire</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>SIRV</strong> - Special Investor's Visa</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>SRRV</strong> - Special Retiree's Visa</span>
                </li>
              </ul>
            </div>

            {/* Visa 9(f) */}
            <div className="bg-accent/10 rounded-xl p-6 border border-accent/25">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-accent-foreground" />
                </div>
                Visa étudiant 9(f) - Si nécessaire
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Pour étudiants 18+ ans ou sans visa parent éligible :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Lettre d&apos;admission de l&apos;école</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Passeport valide 6+ mois</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Preuve de moyens financiers</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Frais : ~₱3,000-5,000</span>
                </li>
              </ul>
            </div>
          </div>

          {/* WEG Warning — ton destructive assumé, vrai avertissement */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="rounded-r-xl border-l-4 border-destructive bg-destructive/5 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Enfants de moins de 15 ans voyageant seuls</h4>
                  <p className="text-sm text-muted-foreground">
                    Un <strong>Waiver of Exclusion Ground (WEG)</strong> est requis pour les enfants non accompagnés.
                    À obtenir auprès de l'ambassade des Philippines avant le voyage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus d'admission (fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 mx-auto max-w-2xl">
            <SectionHeader eyebrow="Étape par étape" title="Le processus" accent="d'admission" />
            <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Entre la première visite d&apos;école et la rentrée d&apos;août, comptez plusieurs
              mois. Voici les cinq étapes qui jalonnent une admission réussie — ISM et BSM étant
              parmi les plus demandées.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">1</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Recherche et visite (6-12 mois avant)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Contactez les écoles pour visites et portes ouvertes.
                      ISM et BSM ont des listes d'attente pour les niveaux 6-10.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">2</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Constitution du dossier
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <span>• Formulaire en ligne</span>
                      <span>• Bulletins (2-3 ans)</span>
                      <span>• Lettres de recommandation</span>
                      <span>• Passeports/visas parents</span>
                      <span>• Certificat de naissance</span>
                      <span>• Frais: $200-600</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">3</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Évaluations et entretien
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Tests d'admission (anglais, maths), évaluation du niveau scolaire,
                      entretien avec l'équipe pédagogique. Évaluations à distance possibles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">4</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Décision et inscription (2-4 semaines)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      En cas d'acceptation : versement du dépôt et frais de matriculation.
                      Signature du contrat d'inscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">5</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Préparation de la rentrée (août)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Uniformes, fournitures, transport scolaire, journées d'orientation.
                      L'année scolaire commence généralement en août.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EAL Support */}
            <div className="mt-8 bg-muted rounded-xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Languages className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Support linguistique (EAL/ESL)</h3>
                  <p className="text-muted-foreground">
                    La plupart des écoles proposent des programmes <strong>English as an Additional Language</strong>.
                    À ISM : $1,625/semestre (1ère année), $1,100/semestre (2ème année).
                    Aide les enfants francophones à s'intégrer rapidement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                title="Universités aux Philippines"
                href="/vivre-aux-philippines/etudier/universites"
                desc="Pour les études supérieures, une fois le bac en poche."
                cta="En savoir plus"
              />
              <LinkCard
                title="Guide familles expatriées"
                href="/vivre-aux-philippines/culture-integration"
                desc="S'installer et s'intégrer en famille aux Philippines."
                cta="En savoir plus"
              />
              <LinkCard
                title="Visas et permis"
                href="/vivre-aux-philippines/visas-et-formalites"
                desc="Le guide complet sur le visa 9(f) et les autres statuts."
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
            title="Scolariser ses enfants,"
            titleAccent="en clair"
            faqs={ECOLES_FAQS}
            withSchema
          />
        </div>
      </section>

      {/* Panneau signature de clôture */}
      <CTABand
        title="Une question sur"
        titleAccent="l'admission ?"
        subtitle="Posez votre cas à la communauté d'expatriés sur le forum, ou comparez avec les universités si vos enfants ont déjà passé le bac."
        primary={{ label: 'Poser ma question sur le forum', href: '/forum-sur-les-philippines' }}
        secondary={{ label: 'Voir les universités', href: '/vivre-aux-philippines/etudier/universites' }}
      />
    </div>
  );
};

export default EcolesInternationalesPage;
