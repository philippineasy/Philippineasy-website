import { Metadata } from 'next';
import { Building, FileText, Users, Landmark, Shield, Globe, CheckCircle, AlertTriangle, Briefcase, Calculator, ExternalLink, Building2, User, Clock, Scale, TrendingUp, Award, Percent, Wallet, Banknote, BadgeCheck, Factory } from 'lucide-react';
import { PageHero, StatRow, CardGrid, LinkCard } from '@/components/sections';

export const metadata: Metadata = {
  title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet",
  description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
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
    title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Créer son Entreprise aux Philippines en 2026",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : structures, capital, démarches.",
    site: '@philippineasy',
  },
};

const CreerEntreprisePage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Créer son"
        titleAccent="Entreprise"
        subtitle="Guide complet pour lancer votre activité aux Philippines : structures juridiques, capital requis, démarches administratives et opportunités fiscales."
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Créer son Entreprise"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Stats */}
        <section className="mb-16 border-y border-border py-10">
          <StatRow
            stats={[
              { value: '+6%', label: 'Croissance/an' },
              { value: '115M', label: 'Habitants' },
              { value: '4-12', label: 'Semaines création' },
              { value: '422', label: 'Zones PEZA' },
            ]}
            className="mx-auto max-w-4xl justify-center"
          />
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            Avec une croissance économique soutenue, une population jeune de 115 millions d'habitants
            et un taux d'anglophonie parmi les plus élevés d'Asie, les Philippines représentent un terrain fertile pour
            l'entrepreneuriat. La plateforme <strong>eSPARC de la SEC</strong> permet désormais de créer
            une entreprise en 4 à 12 semaines.
          </p>
        </section>

        {/* Alerte FINL */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/15 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-accent-strong" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Foreign Investment Negative List (FINL)</h3>
                <p className="text-foreground/80 mb-4">
                  Avant tout projet, consultez la <strong>12ème FINL</strong> (Executive Order 175) qui définit les secteurs
                  où la participation étrangère est limitée ou interdite :
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Médias : interdits</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Retail : ₱25M min si &gt;40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Utilities : max 40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Professions : Philippins</span>
                  </div>
                </div>
                <a
                  href="https://emerhub.com/philippines/foreign-investment-negative-list-in-the-philippines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-strong hover:text-accent-strong/80 font-semibold transition-colors"
                >
                  Consulter la FINL complète
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Structures juridiques */}
        <section className="mb-16">
          <CardGrid
            title="Structures Juridiques Disponibles"
            subtitle="Le choix de la structure dépend de votre activité, du nombre d'associés et du niveau de contrôle souhaité."
            columns={3}
          >
            {/* Corporation - Recommandé */}
            <div className="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">Recommandé</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Building className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Corporation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Structure la plus courante pour les investisseurs étrangers. Responsabilité limitée aux apports.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">2-15 actionnaires</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">100% étranger possible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-foreground">US$200k (US$100k tech)</span>
                </div>
              </div>
            </div>

            {/* OPC */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <User className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">One Person Corp. (OPC)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Structure simplifiée pour un entrepreneur seul. Créée par le Revised Corporation Code de 2019.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Un seul actionnaire</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Ouvert aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Secrétaire PH requis</span>
                </div>
              </div>
            </div>

            {/* Branch Office */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Building2 className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Branch Office</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Extension d'une société étrangère. La maison-mère reste responsable des dettes.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">100% contrôle maison-mère</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Génère des revenus locaux</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-foreground">US$200k rapatrié</span>
                </div>
              </div>
            </div>

            {/* Representative Office */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Globe className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Representative Office</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Bureau de liaison sans activité commerciale. Idéal pour prospecter le marché.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Capital réduit : US$30k</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Promotion, étude marché</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Pas de revenus locaux</span>
                </div>
              </div>
            </div>

            {/* Partnership */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Users className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Partnership</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Association de 2+ personnes. Peut être générale ou limitée.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Formalités simplifiées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Pas de capital minimum</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Rare pour étrangers</span>
                </div>
              </div>
            </div>

            {/* Sole Proprietorship - Non disponible */}
            <div className="rounded-2xl border border-border bg-muted p-6 opacity-75">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted-foreground/10 text-muted-foreground" aria-hidden="true">
                  <FileText className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-muted-foreground">Sole Proprietorship</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Entreprise individuelle. Réservée aux citoyens philippins uniquement.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-foreground font-medium">Non accessible aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enregistrement DTI</span>
                </div>
              </div>
            </div>
          </CardGrid>
        </section>

        {/* Capital minimum */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Capital Minimum Requis</h2>

          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4">
              <h3 className="font-bold text-lg">Comparatif par structure</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Corporation/OPC */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Corporation / OPC</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">US$100,000 (tech/50+ employés)</span>
                  </div>
                </div>
              </div>

              {/* Branch Office */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Branch Office</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">₱5,000 (export PEZA)</span>
                  </div>
                </div>
              </div>

              {/* Representative Office */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Globe className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Representative Office</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$30,000</span>
                  </div>
                </div>
              </div>

              {/* Partnership */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Partnership</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Pas de minimum (règles FINL si &gt;40%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Étapes de création - Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Les Étapes de Création</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Processus complet de 30 à 45 jours ouvrés en moyenne via la plateforme eSPARC.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Réservation du Nom (SEC)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Vérifiez la disponibilité via <a href="https://esparc.sec.gov.ph" target="_blank" rel="noopener noreferrer" className="underline font-medium text-primary hover:text-primary/80">eSPARC</a>.
                      Réservation valable 90 jours (renouvelable 1x).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱100-500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement SEC</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Soumettez les Articles of Incorporation, By-laws et documents notariés.
                      Pour les étrangers : formulaire FIA + certificat bancaire capital.
                    </p>
                    <div className="bg-card/70 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-foreground mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Articles Inc.</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">By-laws</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">FIA (₱3k)</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Certif. bancaire</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">TIN/Passeport</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 7-20 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱10k-30k
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Barangay Clearance</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Obtenez l'autorisation du barangay (quartier) où sera situé votre bureau.
                      Indispensable pour le Mayor's Permit.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱300-1,800
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    4
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Mayor's Permit (Business Permit)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permis d'exploitation par la mairie. Inclut inspections sanitaire, incendie et zonage.
                    </p>
                    <div className="bg-card/70 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-foreground mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Certif. SEC</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Barangay</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Bail</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">CTC</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Zoning</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-15 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱5k-20k/an
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    5
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement BIR</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Bureau of Internal Revenue : TIN entreprise, autorisation factures (ATP),
                      enregistrement livres comptables.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-10 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱500-4,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    6
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement Employeurs</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Si vous embauchez : SSS (sécurité sociale), PhilHealth (santé), Pag-IBIG (logement).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-7 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-accent/15 text-accent-strong px-2 py-1 rounded-full">
                        <BadgeCheck className="h-3 w-3" /> Gratuit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estimation des coûts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Estimation des Coûts Totaux</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="font-bold text-lg">Budget prévisionnel (hors capital social)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Enregistrement SEC</span>
                  <span className="font-semibold text-foreground">₱10,000 - ₱30,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm text-foreground">Barangay Clearance + CTC</span>
                  <span className="font-semibold text-foreground">₱500 - ₱2,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Mayor's Permit (1ère année)</span>
                  <span className="font-semibold text-foreground">₱5,000 - ₱20,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm text-foreground">Fire Safety + Zoning</span>
                  <span className="font-semibold text-foreground">₱1,500 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Enregistrement BIR + ATP</span>
                  <span className="font-semibold text-foreground">₱2,000 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-l-accent">
                  <span className="text-sm text-foreground">Honoraires avocat/consultant (optionnel)</span>
                  <span className="font-semibold text-accent-strong">₱50,000 - ₱150,000</span>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <span className="font-semibold text-foreground">TOTAL (sans consultant)</span>
                    <span className="font-bold text-xl text-primary">₱19,000 - ₱62,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/30 mt-3">
                    <span className="font-semibold text-foreground">TOTAL (avec consultant)</span>
                    <span className="font-bold text-xl text-accent-strong">₱70,000 - ₱200,000</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * N'inclut pas le capital social requis (US$100,000-200,000 pour les étrangers)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PEZA et incitations */}
        <section className="mb-16">
          <CardGrid
            title="Incitations Fiscales : PEZA et BOI"
            subtitle="Le CREATE MORE Act de 2024 offre jusqu'à 27 ans d'avantages fiscaux pour les projets à fort impact."
            columns={2}
          >
            {/* PEZA */}
            <div className="rounded-2xl border-2 border-primary bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Factory className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-bold text-xl text-foreground">PEZA</h3>
                  <p className="text-sm text-muted-foreground">Philippine Economic Zone Authority</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                422 zones économiques. Idéal pour l'export, la tech et le BPO.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <Percent className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Income Tax Holiday</div>
                    <div className="text-xs text-muted-foreground">4-8 ans (8 pour green tech)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">5% SCIT après ITH</div>
                    <div className="text-xs text-muted-foreground">Au lieu de 25% CIT</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <BadgeCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Duty-free imports</div>
                    <div className="text-xs text-muted-foreground">Équipements et matières premières</div>
                  </div>
                </div>
              </div>
              <a
                href="https://www.peza.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-semibold"
              >
                Site officiel PEZA <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* BOI */}
            <div className="rounded-2xl border-2 border-accent bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                  <Briefcase className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-bold text-xl text-foreground">BOI</h3>
                  <p className="text-sm text-muted-foreground">Board of Investments</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pour les projets hors zones économiques dans les secteurs prioritaires.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <Percent className="h-5 w-5 text-accent-strong mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Income Tax Holiday</div>
                    <div className="text-xs text-muted-foreground">4-7 ans selon le projet</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <Award className="h-5 w-5 text-accent-strong mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Déductions additionnelles</div>
                    <div className="text-xs text-muted-foreground">Formation et R&D</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <Shield className="h-5 w-5 text-accent-strong mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Réductions douanières</div>
                    <div className="text-xs text-muted-foreground">Sur équipements importés</div>
                  </div>
                </div>
              </div>
              <a
                href="https://boi.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent-strong hover:text-accent-strong/80 font-semibold"
              >
                Site officiel BOI <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardGrid>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <CardGrid title="Conseils Pratiques" columns={2}>
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Scale className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-lg text-foreground mb-2">Engagez un Avocat Local</h3>
              <p className="text-sm text-muted-foreground">
                Un avocat philippin spécialisé en droit des affaires vous évitera des erreurs coûteuses,
                surtout concernant la FINL et les structures à capitaux étrangers.
              </p>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Landmark className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-lg text-foreground mb-2">Ouvrez un Compte Corporate</h3>
              <p className="text-sm text-muted-foreground">
                Préparez votre capital avant de démarrer. Les banques exigent une preuve de rapatriement
                de fonds pour les sociétés à capitaux étrangers.
              </p>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-lg text-foreground mb-2">Nommez un Agent Résident</h3>
              <p className="text-sm text-muted-foreground">
                Obligatoire pour les branches et corporations à capitaux étrangers. Peut être un citoyen
                philippin ou un étranger avec visa de travail.
              </p>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Calculator className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-lg text-foreground mb-2">Anticipez les Obligations Fiscales</h3>
              <p className="text-sm text-muted-foreground">
                Déclarations mensuelles (TVA, retenues), trimestrielles et annuelles.
                Un comptable local est quasi indispensable.
              </p>
            </div>
          </CardGrid>
        </section>

        {/* Ressources officielles */}
        <section className="mb-16">
          <CardGrid title="Ressources Officielles" columns={3}>
            <a
              href="https://esparc.sec.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">SEC eSPARC</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.bir.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Bureau of Internal Revenue</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.dti.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Dept. of Trade</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.peza.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">PEZA</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://boi.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Board of Investments</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.philembassy.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Ambassade PH (FR)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
          </CardGrid>
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <CardGrid title="Continuer votre exploration" columns={3}>
            <LinkCard
              title="Emploi Salarié"
              href="/vivre-aux-philippines/travailler/emploi-salarie"
              icon={<Briefcase className="h-5 w-5" />}
            />
            <LinkCard
              title="Immobilier"
              href="/vivre-aux-philippines/investir/immobilier"
              icon={<Building className="h-5 w-5" />}
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

export default CreerEntreprisePage;
