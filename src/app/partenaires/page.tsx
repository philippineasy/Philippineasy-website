import type { Metadata } from 'next'
import { AffiliateLink } from '@/components/affiliate/AffiliateLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHotel,
  faShieldHalved,
  faMoneyBillTransfer,
  faSimCard,
  faLock,
  faUmbrellaBeach,
  faStar,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'

export const metadata: Metadata = {
  title: 'Nos Partenaires de Confiance',
  description:
    'Les meilleurs outils et services pour votre voyage aux Philippines. Hotels, assurance, eSIM, VPN, activites — selectionnes par notre equipe.',
  alternates: { canonical: '/partenaires' },
}

// ── Partner data ────────────────────────────────────────────
// Replace placeholder URLs with your real affiliate links once enrolled.

// TODO: Replace direct URLs with affiliate tracking links once enrolled in each program.
const partners = [
  {
    category: 'Hebergement',
    icon: faHotel,
    items: [
      {
        name: 'Booking.com',
        description:
          "Le plus grand choix d'hotels, resorts et auberges aux Philippines. Annulation gratuite sur la plupart des reservations.",
        advantage: 'Prix negocie + annulation gratuite',
        url: 'https://www.booking.com/country/ph.fr.html',
        recommended: true,
      },
    ],
  },
  {
    category: 'Assurance voyage',
    icon: faShieldHalved,
    items: [
      {
        name: 'Chapka Assurances',
        description:
          "L'assurance voyage preferee des Francais a l'etranger. Couverture complete incluant rapatriement, frais medicaux et bagages.",
        advantage: 'A partir de 22 EUR/mois — couverture monde entier',
        url: 'https://www.chapkadirect.fr/assurance-voyage.html',
        recommended: true,
      },
      {
        name: 'AVI International',
        description:
          'Specialiste assurance voyage longue duree. Ideal pour les expats et digital nomads aux Philippines.',
        advantage: 'Plans longue duree avantageux (6-12 mois)',
        url: 'https://www.avi-international.com/assurance-voyage/',
        recommended: false,
      },
    ],
  },
  {
    category: 'Argent & Transferts',
    icon: faMoneyBillTransfer,
    items: [
      {
        name: 'Wise',
        description:
          "Transferez de l'argent en PHP au taux reel du marche. Economisez 3 a 5% par rapport aux banques traditionnelles.",
        advantage: 'Economisez 3-5% sur chaque transfert EUR → PHP',
        url: 'https://wise.com/fr/send-money/send-money-to-philippines',
        recommended: true,
      },
    ],
  },
  {
    category: 'Communication',
    icon: faSimCard,
    items: [
      {
        name: 'Airalo',
        description:
          "eSIM data pour les Philippines. Activez votre connexion avant meme d'atterrir a Manille — plus besoin de chercher une SIM a l'aeroport.",
        advantage: "eSIM activable avant le depart — internet des l'atterrissage",
        url: 'https://www.airalo.com/philippines-esim',
        recommended: true,
      },
    ],
  },
  {
    category: 'Securite & VPN',
    icon: faLock,
    items: [
      {
        name: 'NordVPN',
        description:
          'Securisez votre connexion sur les Wi-Fi publics philippins et accedez a vos contenus francais (Netflix, replay TV) depuis les Philippines.',
        advantage: 'A partir de 3 EUR/mois — Netflix France depuis les Philippines',
        url: 'https://nordvpn.com/fr/',
        recommended: true,
      },
    ],
  },
  {
    category: 'Activites & Experiences',
    icon: faUmbrellaBeach,
    items: [
      {
        name: 'Klook',
        description:
          'Reservez vos island-hopping, plongee, excursions et transferts aeroport aux Philippines aux meilleurs prix.',
        advantage: "Jusqu'a -30% vs prix sur place + annulation flexible",
        url: 'https://affiliate.klook.com/redirect?aid=118789&aff_adid=1257878&k_site=https%3A%2F%2Fwww.klook.com%2Ffr%2Fcountry%2Fphilippines%2F',
        recommended: false,
      },
    ],
  },
]

// ── Page component ──────────────────────────────────────────

export default function PartenairesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nos partenaires de confiance
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nous avons selectionne les meilleurs outils et services pour simplifier
          votre voyage aux Philippines. En utilisant ces liens, vous nous aidez a
          maintenir ce guide gratuit.
        </p>
      </section>

      {/* Partner sections */}
      {partners.map((section) => (
        <section key={section.category} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={section.icon} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{section.category}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {section.items.map((partner) => (
              <div
                key={partner.name}
                className="relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {partner.recommended && (
                  <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                    Recommande
                  </span>
                )}

                <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {partner.description}
                </p>

                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 mb-4">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    {partner.advantage}
                  </p>
                </div>

                <AffiliateLink
                  href={partner.url}
                  partner={partner.name.toLowerCase().replace(/\s/g, '-')}
                  location="partenaires_page"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Decouvrir {partner.name}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                </AffiliateLink>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Transparency disclaimer */}
      <section className="mt-16 rounded-xl border bg-muted/50 p-6 text-center">
        <h3 className="font-semibold mb-2">Transparence</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Les liens sur cette page sont des liens d&apos;affiliation. Si vous
          achetez via ces liens, nous recevons une petite commission sans cout
          supplementaire pour vous. Cela nous aide a maintenir ce site et a
          continuer de vous offrir du contenu gratuit de qualite.
        </p>
      </section>
    </div>
  )
}
