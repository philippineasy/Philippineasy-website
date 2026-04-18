import type { Metadata } from 'next'
import Image from 'next/image'
import { AffiliateLink } from '@/components/affiliate/AffiliateLink'
import { KlookCarousel } from '@/components/affiliate/KlookCarousel'
import { philippinesActivities } from '@/components/affiliate/klook-activities-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHotel,
  faShieldHalved,
  faMoneyBillTransfer,
  faSimCard,
  faLock,
  faStar,
  faArrowUpRightFromSquare,
  faHeart,
  faShieldAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const metadata: Metadata = {
  title: 'Nos Partenaires de Confiance',
  description:
    'Les meilleurs outils et services pour votre voyage aux Philippines. Hotels, assurance, eSIM, VPN, activites — selectionnes par notre equipe.',
  alternates: { canonical: '/partenaires' },
}

// ── Partner data ────────────────────────────────────────────

interface Partner {
  name: string
  description: string
  advantage: string
  url: string
  recommended?: boolean
  accentColor?: string
}

interface PartnerSection {
  category: string
  icon: IconDefinition
  description: string
  bgImage?: string
  items: Partner[]
}

const partnerSections: PartnerSection[] = [
  {
    category: 'Hebergement',
    icon: faHotel,
    description: 'Trouvez votre nid parfait — des auberges backpacker aux resorts de luxe',
    bgImage: '/images/palawan/bateau-bangka-el-nido.webp',
    items: [
      {
        name: 'Booking.com',
        description:
          "Le plus grand choix d'hotels, resorts et auberges aux Philippines. Annulation gratuite sur la plupart des reservations.",
        advantage: 'Prix negocie + annulation gratuite',
        url: 'https://www.booking.com/country/ph.fr.html',
        recommended: true,
        accentColor: 'from-blue-600 to-blue-500',
      },
    ],
  },
  {
    category: 'Assurance voyage',
    icon: faShieldHalved,
    description: 'Protegez votre sejour — les frais medicaux aux Philippines ne sont pas couverts par la Secu',
    bgImage: '/imagesHero/banque-assurance-philippines.webp',
    items: [
      {
        name: 'Chapka Assurances',
        description:
          "L'assurance voyage preferee des Francais a l'etranger. Rapatriement, frais medicaux, bagages et responsabilite civile.",
        advantage: 'A partir de 22 EUR/mois — couverture monde entier',
        url: 'https://www.chapkadirect.fr/assurance-voyage.html',
        recommended: true,
        accentColor: 'from-rose-600 to-rose-500',
      },
      {
        name: 'AVI International',
        description:
          'Specialiste assurance voyage longue duree. Ideal pour les expats et digital nomads installes aux Philippines.',
        advantage: 'Plans longue duree avantageux (6-12 mois)',
        url: 'https://www.avi-international.com/assurance-voyage/',
        accentColor: 'from-purple-600 to-purple-500',
      },
    ],
  },
  {
    category: 'Argent & Transferts',
    icon: faMoneyBillTransfer,
    description: 'Economisez sur chaque transaction EUR → PHP',
    bgImage: '/imagesHero/maitriser-son-budget-aux-philippines.webp',
    items: [
      {
        name: 'Wise',
        description:
          "Transferez en PHP au taux reel du marche. Compte multi-devises EUR + PHP + USD. Utilise par 16 millions de personnes.",
        advantage: 'Economisez 3-5% sur chaque transfert EUR → PHP',
        url: 'https://wise.com/fr/send-money/send-money-to-philippines',
        recommended: true,
        accentColor: 'from-green-600 to-emerald-500',
      },
    ],
  },
  {
    category: 'Communication',
    icon: faSimCard,
    description: "Restez connecte des l'atterrissage, sans chercher une SIM a l'aeroport",
    bgImage: '/imagesHero/antennes-reseaux-aux-philippines.webp',
    items: [
      {
        name: 'Airalo',
        description:
          "eSIM data pour les Philippines. Achetez et activez AVANT de partir. Plus besoin de faire la queue a l'aeroport.",
        advantage: "A partir de 5 USD pour 1 GB — activation en 2 minutes",
        url: 'https://www.airalo.com/philippines-esim',
        recommended: true,
        accentColor: 'from-orange-600 to-amber-500',
      },
    ],
  },
  {
    category: 'Securite & VPN',
    icon: faLock,
    description: 'Protegez vos donnees sur les Wi-Fi publics et accedez au contenu francais',
    items: [
      {
        name: 'NordVPN',
        description:
          "Chiffrez votre connexion sur les Wi-Fi d'hotels et cafes. Accedez a Netflix France, Canal+ et la TV francaise depuis les Philippines.",
        advantage: 'A partir de 3 EUR/mois — Netflix France depuis les Philippines',
        url: 'https://nordvpn.com/fr/',
        recommended: true,
        accentColor: 'from-indigo-600 to-blue-500',
      },
    ],
  },
]

// ── Page component ──────────────────────────────────────────

export default function PartenairesPage() {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/imagesHero/hero-home.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28 max-w-5xl">
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="inline-block w-8 h-px bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Selectionnes par notre equipe
            </span>
            <span className="inline-block w-8 h-px bg-primary" />
          </div>
          <h1 className="text-center text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Nos partenaires
            <span className="block text-primary">de confiance</span>
          </h1>
          <p className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Les outils et services que nous utilisons nous-memes pour voyager et vivre aux
            Philippines. En passant par ces liens, vous nous aidez a maintenir ce guide gratuit.
          </p>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faUsers} className="text-xl" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">10 000+</div>
              <div className="text-xs md:text-sm text-muted-foreground">voyageurs accompagnes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">100%</div>
              <div className="text-xs md:text-sm text-muted-foreground">testes par nous</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faHeart} className="text-xl" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">0 EUR</div>
              <div className="text-xs md:text-sm text-muted-foreground">cout pour vous</div>
            </div>
          </div>
        </div>
      </section>

      {/* Klook activities carousel — featured */}
      <section className="container mx-auto px-4 max-w-6xl py-8">
        <KlookCarousel
          activities={philippinesActivities}
          destination="philippines"
          title="Les activites incontournables"
          subtitle="Reservez les meilleures experiences aux meilleurs prix"
        />
      </section>

      {/* Partner sections */}
      <div className="container mx-auto px-4 max-w-6xl pb-20">
        {partnerSections.map((section, idx) => (
          <PartnerSectionBlock key={section.category} section={section} index={idx} />
        ))}
      </div>

      {/* Transparency disclaimer */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Notre engagement transparence</h3>
          <p className="text-muted-foreground leading-relaxed">
            Tous les liens sur cette page sont des liens d&apos;affiliation. Si vous reservez ou
            souscrivez via ces liens, nous recevons une petite commission de la part du partenaire,{' '}
            <strong className="text-foreground">sans aucun cout supplementaire pour vous</strong>.
            Ces commissions nous permettent de maintenir ce guide 100% gratuit et de continuer a
            produire du contenu de qualite.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Tous nos partenaires sont testes et approuves par notre equipe. Nous ne recommandons
            que des services que nous utilisons nous-memes.
          </p>
        </div>
      </section>
    </div>
  )
}

// ── Partner section block ───────────────────────────────────

function PartnerSectionBlock({ section, index }: { section: PartnerSection; index: number }) {
  const isHero = section.items.length === 1 // Single-partner sections get hero treatment

  return (
    <section className={`py-10 ${index > 0 ? 'border-t' : ''}`}>
      {/* Section header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
          <FontAwesomeIcon icon={section.icon} className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{section.category}</h2>
          <p className="text-muted-foreground mt-1">{section.description}</p>
        </div>
      </div>

      {/* Cards */}
      <div className={isHero ? '' : 'grid md:grid-cols-2 gap-5'}>
        {section.items.map((partner) => (
          <PartnerCard key={partner.name} partner={partner} hero={isHero} bgImage={section.bgImage} />
        ))}
      </div>
    </section>
  )
}

// ── Partner card ────────────────────────────────────────────

function PartnerCard({
  partner,
  hero,
  bgImage,
}: {
  partner: Partner
  hero: boolean
  bgImage?: string
}) {
  const accent = partner.accentColor || 'from-primary to-primary/70'

  if (hero) {
    return (
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-shadow group">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Image side */}
          {bgImage && (
            <div className="relative md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[280px]">
              <Image
                src={bgImage}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-20 mix-blend-multiply`} />
            </div>
          )}

          {/* Content side */}
          <div className={`p-6 md:p-8 flex flex-col justify-center ${bgImage ? 'md:col-span-3' : 'md:col-span-5'}`}>
            {partner.recommended && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-3 self-start">
                <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                Recommande par Philippin&apos;Easy
              </span>
            )}
            <h3 className="text-2xl md:text-3xl font-bold mb-3">{partner.name}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{partner.description}</p>

            <div className="flex items-center gap-2 mb-5 text-sm font-medium text-green-700 dark:text-green-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600" />
              {partner.advantage}
            </div>

            <AffiliateLink
              href={partner.url}
              partner={partner.name.toLowerCase().replace(/\s/g, '-')}
              location="partenaires_page"
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${accent} px-6 py-3 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all self-start`}
            >
              Decouvrir {partner.name}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
            </AffiliateLink>
          </div>
        </div>
      </div>
    )
  }

  // Grid card (used for multi-partner sections)
  return (
    <div className="relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      {partner.recommended && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-md">
          <FontAwesomeIcon icon={faStar} className="text-[9px]" />
          Recommande
        </span>
      )}
      <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{partner.description}</p>

      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-green-700 dark:text-green-400">
        <span className="inline-block w-1 h-1 rounded-full bg-green-600" />
        {partner.advantage}
      </div>

      <AffiliateLink
        href={partner.url}
        partner={partner.name.toLowerCase().replace(/\s/g, '-')}
        location="partenaires_page"
        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${accent} px-5 py-2.5 text-white text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all`}
      >
        Decouvrir
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
      </AffiliateLink>
    </div>
  )
}
