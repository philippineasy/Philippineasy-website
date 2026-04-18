import Link from 'next/link';
import Image from 'next/image';

// TODO: remplacer par photo Supabase quand disponible (bucket articles, région Cebu & Visayas)
const CebuVisayasPlaceholder = () => (
  <svg
    viewBox="0 0 400 180"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration coucher de soleil sur Cebu et Visayas avec palmiers"
  >
    <defs>
      <linearGradient id="cebuSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <radialGradient id="cebuSun" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="180" fill="url(#cebuSky)" />
    <circle cx="200" cy="115" r="70" fill="url(#cebuSun)" />
    <circle cx="200" cy="115" r="26" fill="#FEF3C7" opacity="0.95" />
    <path d="M0 145 Q 60 135, 120 145 T 240 143 T 400 148 L 400 180 L 0 180 Z" fill="#7c2d12" opacity="0.6" />
    <path d="M0 160 Q 80 152, 160 160 T 320 158 T 400 162 L 400 180 L 0 180 Z" fill="#450a0a" opacity="0.75" />
    <g stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M60 180 L 58 120" />
      <path d="M58 120 Q 40 108, 28 112" />
      <path d="M58 120 Q 76 108, 88 112" />
      <path d="M58 120 Q 44 112, 36 100" />
      <path d="M58 120 Q 72 112, 80 100" />
      <path d="M340 180 L 338 130" />
      <path d="M338 130 Q 322 118, 312 124" />
      <path d="M338 130 Q 354 118, 364 124" />
      <path d="M338 130 Q 328 122, 322 110" />
      <path d="M338 130 Q 348 122, 354 110" />
    </g>
    <text
      x="50%"
      y="48%"
      textAnchor="middle"
      fontFamily="Poppins, system-ui, sans-serif"
      fontSize="22"
      fontWeight="600"
      fill="#fff"
      opacity="0.95"
      style={{ letterSpacing: '0.02em' }}
    >
      Cebu &amp; Visayas
    </text>
  </svg>
);

type Region = {
  slug: string;
  name: string;
  description: string;
  image?: string;
  imageAlt?: string;
  placeholder?: boolean;
};

const regions: Region[] = [
  {
    slug: 'palawan',
    name: 'Palawan',
    description:
      'Découvrez les trésors de Palawan, de ses lagons enchanteurs à ses plages de sable blanc immaculées.',
    image: '/images/palawan/vue-aerienne-coron.webp',
    imageAlt:
      'Vue aérienne de Coron, Palawan, avec lagons turquoise et îles karstiques',
  },
  {
    slug: 'cebu-visayas',
    name: 'Cebu & Visayas',
    description:
      'Plongez au cœur des Visayas : cascades, requins-baleines, Chocolate Hills et plages idylliques vous attendent.',
    placeholder: true,
  },
  {
    slug: 'siargao',
    name: 'Siargao',
    description:
      'La capitale du surf des Philippines, avec des vagues de renommée mondiale et une ambiance décontractée unique.',
    image: '/images/siargao/surf-a-siargao.webp',
    imageAlt: 'Surfeur sur une vague à Siargao avec cocotiers en arrière-plan',
  },
];

export const RegionCards = () => {
  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Explorez les <span className="text-accent">Régions</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Cliquez sur une région pour découvrir ses trésors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {regions.map((region) => (
            <article
              key={region.slug}
              className="group bg-card rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                border: '0.5px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div className="relative w-full h-[180px] overflow-hidden">
                {region.placeholder ? (
                  <CebuVisayasPlaceholder />
                ) : (
                  <Image
                    src={region.image!}
                    alt={region.imageAlt!}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                  />
                )}
              </div>
              <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
                <h3
                  className="text-[19px] text-foreground mb-2"
                  style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
                >
                  {region.name}
                </h3>
                <p
                  className="text-[13px] mb-4 flex-1"
                  style={{ color: '#64748b', lineHeight: 1.55, minHeight: '60px' }}
                >
                  {region.description}
                </p>
                <Link
                  href={`/voyager-aux-philippines/${region.slug}`}
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                  aria-label={`Explorer la région ${region.name}`}
                >
                  Explorer {region.name}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
