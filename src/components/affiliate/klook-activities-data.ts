// Curated Klook activities for Philippines destinations.
// Links use real affiliate tracking (aid=118789).
// aff_adid matches the destination-level Ad ID from Klook dashboard.
// Images use verified Unsplash URLs (Philippines-tagged when available).

export interface KlookActivity {
  id: string
  title: string
  subtitle: string
  image: string
  priceFrom: number // EUR
  duration: string
  highlights: string[]
  rating: number
  reviews: string
  url: string
}

const KLOOK_AFFILIATE_BASE = 'https://affiliate.klook.com/redirect?aid=118789'

function affiliateLink(klookUrl: string, affAdid: string): string {
  return `${KLOOK_AFFILIATE_BASE}&aff_adid=${affAdid}&k_site=${encodeURIComponent(klookUrl)}`
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`

// ── Palawan (aff_adid=1257880) ──────────────────────────────
const PALAWAN_ADID = '1257880'

export const palawanActivities: KlookActivity[] = [
  {
    id: 'el-nido-tour-a',
    title: 'El Nido Island Hopping — Tour A',
    subtitle: 'Big Lagoon, Small Lagoon & Secret Lagoon',
    image: u('1583685173048-342a162bb888'),
    priceFrom: 20,
    duration: 'Journee complete',
    highlights: ['4 lagons emblematiques', 'Dejeuner BBQ inclus', 'Snorkeling avec tortues'],
    rating: 4.8,
    reviews: '3200+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=El+Nido+Tour+A',
      PALAWAN_ADID
    ),
  },
  {
    id: 'coron-tour-a',
    title: 'Coron Ultimate Tour',
    subtitle: 'Kayangan Lake, Twin Lagoon & Barracuda Lake',
    image: u('1593994603115-deaa40043bae'),
    priceFrom: 25,
    duration: 'Journee complete',
    highlights: ["Lac le plus pur d'Asie", 'Epaves japonaises', 'Plages paradisiaques'],
    rating: 4.9,
    reviews: '2100+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Coron+Island+Hopping',
      PALAWAN_ADID
    ),
  },
  {
    id: 'el-nido-tour-c',
    title: 'El Nido Tour C — Iles cachees',
    subtitle: 'Helicopter Island & Hidden Beach',
    image: u('1695051702427-1c24ce3682e7'),
    priceFrom: 25,
    duration: 'Journee complete',
    highlights: ['Plages secretes', 'Falaises calcaires', "Dejeuner sur l'ile"],
    rating: 4.7,
    reviews: '1800+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=El+Nido+Tour+C',
      PALAWAN_ADID
    ),
  },
  {
    id: 'puerto-princesa-underground',
    title: 'Underground River de Puerto Princesa',
    subtitle: 'Merveille naturelle classee UNESCO',
    image: u('1759064094912-0461841b1da6'),
    priceFrom: 35,
    duration: 'Journee complete',
    highlights: ['Patrimoine mondial UNESCO', 'Riviere souterraine 8km', 'Transport + guide'],
    rating: 4.6,
    reviews: '950+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Underground+River',
      PALAWAN_ADID
    ),
  },
  {
    id: 'nacpan-beach',
    title: 'Nacpan Beach & Chaine de Falaises',
    subtitle: 'La plus belle plage de Palawan',
    image: u('1710104434456-d1fefd0fd482'),
    priceFrom: 15,
    duration: 'Demi-journee',
    highlights: ['4 km de sable blanc', 'Moins touristique', 'Coucher de soleil magique'],
    rating: 4.8,
    reviews: '680+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Nacpan+Beach',
      PALAWAN_ADID
    ),
  },
  {
    id: 'honda-bay',
    title: 'Honda Bay Island Hopping',
    subtitle: 'Plages et snorkeling depuis Puerto Princesa',
    image: u('1758135465127-1d76d50d9e1a'),
    priceFrom: 20,
    duration: 'Journee complete',
    highlights: ['3 iles visitees', 'Snorkeling inclus', 'Dejeuner sur la plage'],
    rating: 4.7,
    reviews: '1400+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Honda+Bay',
      PALAWAN_ADID
    ),
  },
]

// ── Cebu & Visayas (aff_adid=1257881) ───────────────────────
const CEBU_ADID = '1257881'

export const cebuActivities: KlookActivity[] = [
  {
    id: 'oslob-whale-sharks',
    title: 'Nage avec les requins-baleines',
    subtitle: 'Oslob + chutes Tumalog',
    image: u('1576647025587-2b77cd953cba'),
    priceFrom: 55,
    duration: 'Journee complete',
    highlights: ['Experience unique', 'Transport depuis Cebu', 'Chutes Tumalog inclues'],
    rating: 4.7,
    reviews: '4500+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Oslob+Whale+Shark',
      CEBU_ADID
    ),
  },
  {
    id: 'kawasan-canyoneering',
    title: 'Canyoneering aux chutes Kawasan',
    subtitle: 'Sauts de falaise et eau turquoise',
    image: u('1756571078015-36fa53db08a7'),
    priceFrom: 50,
    duration: '6-8 heures',
    highlights: ['3 niveaux de chutes', "Sauts jusqu'a 12m", 'Equipement fourni'],
    rating: 4.9,
    reviews: '2800+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Kawasan+Canyoneering',
      CEBU_ADID
    ),
  },
  {
    id: 'moalboal-sardines',
    title: 'Moalboal — Sardine Run & Tortues',
    subtitle: 'Snorkeling dans les bancs de sardines',
    image: u('1621451537084-482c73073a0f'),
    priceFrom: 40,
    duration: 'Demi-journee',
    highlights: ['Millions de sardines', 'Tortues marines', 'Equipement + guide'],
    rating: 4.8,
    reviews: '1900+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Moalboal+Sardine',
      CEBU_ADID
    ),
  },
  {
    id: 'bohol-day-tour',
    title: 'Bohol — Excursion journee depuis Cebu',
    subtitle: 'Chocolate Hills, tarsiers, Loboc River',
    image: u('1515511210479-bc02c48ec763'),
    priceFrom: 65,
    duration: 'Journee complete',
    highlights: ['Chocolate Hills', 'Sanctuaire tarsiers', 'Croisiere Loboc'],
    rating: 4.6,
    reviews: '1200+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Bohol+day+tour',
      CEBU_ADID
    ),
  },
  {
    id: 'pescador-island',
    title: 'Plongee a Pescador Island',
    subtitle: 'Paradis sous-marin de Moalboal',
    image: u('1759322787096-f896bd8a069a'),
    priceFrom: 60,
    duration: 'Demi-journee',
    highlights: ['Cathedral Wall', '2 plongees incluses', 'Tortues + coraux'],
    rating: 4.9,
    reviews: '450+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Pescador+diving',
      CEBU_ADID
    ),
  },
  {
    id: 'mactan-island-hopping',
    title: 'Mactan Island Hopping',
    subtitle: 'Dejeuner sur la plage et snorkeling',
    image: u('1757263511665-4614e927d455'),
    priceFrom: 30,
    duration: 'Journee complete',
    highlights: ['3 iles visitees', 'Dejeuner BBQ', 'Equipement snorkeling'],
    rating: 4.5,
    reviews: '2200+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Mactan+Island+Hopping',
      CEBU_ADID
    ),
  },
]

// ── Siargao (aff_adid=1257882) ──────────────────────────────
const SIARGAO_ADID = '1257882'

export const siargaoActivities: KlookActivity[] = [
  {
    id: 'cloud-9-surf',
    title: 'Cours de surf a Cloud 9',
    subtitle: 'Le spot legendaire de Siargao',
    image: u('1519855079734-7f171f9c2af8'),
    priceFrom: 15,
    duration: '2 heures',
    highlights: ['Moniteur certifie', 'Planche incluse', 'Tous niveaux'],
    rating: 4.9,
    reviews: '1800+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Siargao+surf+lesson',
      SIARGAO_ADID
    ),
  },
  {
    id: 'siargao-3-islands',
    title: 'Island Hopping — Naked, Daku, Guyam',
    subtitle: 'Les 3 iles iconiques de Siargao',
    image: u('1565113218386-934429f84cc2'),
    priceFrom: 25,
    duration: 'Journee complete',
    highlights: ['3 iles paradisiaques', 'Dejeuner sur Daku', 'Snorkeling inclus'],
    rating: 4.8,
    reviews: '2400+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Siargao+island+hopping',
      SIARGAO_ADID
    ),
  },
  {
    id: 'sugba-lagoon',
    title: 'Sugba Lagoon — Lagon de jade',
    subtitle: 'Paddle et plongeon depuis la plateforme',
    image: u('1696580436068-f19c26850e8b'),
    priceFrom: 30,
    duration: 'Journee complete',
    highlights: ['Eau turquoise unique', 'Paddle board inclus', 'Plateforme de saut'],
    rating: 4.7,
    reviews: '980+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Sugba+Lagoon',
      SIARGAO_ADID
    ),
  },
  {
    id: 'magpupungko-pools',
    title: 'Magpupungko Rock Pools',
    subtitle: 'Piscines naturelles a maree basse',
    image: u('1754778805689-1bd1da87eb96'),
    priceFrom: 20,
    duration: 'Demi-journee',
    highlights: ['Piscines cristallines', 'Visite marche local', 'Guide francophone'],
    rating: 4.6,
    reviews: '540+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Magpupungko',
      SIARGAO_ADID
    ),
  },
  {
    id: 'sohoton-cove',
    title: 'Sohoton Cove — Meduses sans dard',
    subtitle: 'Grottes et lagon cache',
    image: u('1763582519549-d833a8e0eabb'),
    priceFrom: 55,
    duration: 'Journee complete',
    highlights: ['Nage avec meduses', 'Grottes secretes', 'Tyrolienne sur lagon'],
    rating: 4.8,
    reviews: '720+ avis',
    url: affiliateLink(
      'https://www.klook.com/fr/search/?query=Sohoton+Cove',
      SIARGAO_ADID
    ),
  },
]

// ── Philippines general (aff_adid=1257878) ──────────────────
// For /partenaires page or homepage — mix of best activities
const PHILIPPINES_ADID = '1257878'

export const philippinesActivities: KlookActivity[] = [
  palawanActivities[0], // El Nido Tour A
  cebuActivities[0], // Oslob whale sharks
  siargaoActivities[0], // Cloud 9 surf
  palawanActivities[1], // Coron ultimate
  cebuActivities[3], // Bohol Chocolate Hills
  siargaoActivities[1], // 3 islands hopping
].map((a) => ({
  ...a,
  url: a.url.replace(/aff_adid=\d+/, `aff_adid=${PHILIPPINES_ADID}`),
}))
