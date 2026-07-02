import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory } from '@/services/categoryService';

// TODO: remplacer par photo Supabase quand disponible (bucket articles, region Luzon & Manille)
// Exception: self-contained decorative illustration (stands in for a photo);
// its hex fills describe the drawing and render identically in both themes.
const LuzonManillePlaceholder = () => (
  <svg
    viewBox="0 0 400 220"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration des rizières en terrasse de Banaue et skyline de Manille au loin"
  >
    <defs>
      <linearGradient id="luzonSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="60%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#fef9c3" />
      </linearGradient>
      <linearGradient id="luzonHill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#65a30d" />
        <stop offset="100%" stopColor="#365314" />
      </linearGradient>
    </defs>
    <rect width="400" height="220" fill="url(#luzonSky)" />
    {/* Distant skyline (Manille) */}
    <g fill="#475569" opacity="0.55">
      <rect x="20" y="105" width="14" height="40" />
      <rect x="38" y="98" width="10" height="47" />
      <rect x="52" y="110" width="16" height="35" />
      <rect x="72" y="92" width="12" height="53" />
      <rect x="88" y="103" width="14" height="42" />
      <rect x="106" y="115" width="8" height="30" />
    </g>
    {/* Terraced rice fields cascading */}
    <path
      d="M0 145 Q 100 130, 200 138 Q 300 146, 400 132 L 400 160 L 0 160 Z"
      fill="url(#luzonHill)"
      opacity="0.85"
    />
    <path
      d="M0 165 Q 80 150, 180 158 Q 260 168, 400 153 L 400 178 L 0 178 Z"
      fill="#4d7c0f"
      opacity="0.9"
    />
    <path
      d="M0 183 Q 100 170, 220 178 Q 320 188, 400 175 L 400 198 L 0 198 Z"
      fill="#3f6212"
    />
    <path
      d="M0 200 Q 120 190, 260 198 Q 340 206, 400 195 L 400 220 L 0 220 Z"
      fill="#1a2e05"
    />
    {/* Subtle reflection lines on terraces */}
    <g stroke="#a3e635" strokeWidth="0.8" opacity="0.45" fill="none">
      <path d="M30 152 Q 100 140, 180 145" />
      <path d="M40 173 Q 130 162, 240 168" />
      <path d="M50 191 Q 150 182, 270 187" />
    </g>
  </svg>
);

type RegionDef = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  placeholder?: 'luzon';
};

const regionDefs: RegionDef[] = [
  {
    slug: 'palawan',
    name: 'Palawan',
    description:
      "Lagons turquoise, îles karstiques, plages immaculées — le joyau de l'archipel.",
    tags: ['Plongée', 'Îles', 'Lagons'],
    href: '/voyager-aux-philippines/palawan',
    fallbackImage: '/images/palawan/vue-aerienne-coron.webp',
    fallbackAlt:
      'Vue aérienne de Coron, Palawan, avec lagons turquoise et îles karstiques',
  },
  {
    slug: 'cebu-visayas',
    name: 'Cebu & Visayas',
    description:
      'Cascades, requins-baleines, Chocolate Hills. Le cœur vibrant des Philippines.',
    tags: ['Aventure', 'Nature'],
    href: '/voyager-aux-philippines/cebu-visayas',
    // Pas de fallback local — on utilise le heroImage Supabase si dispo, sinon placeholder
  },
  {
    slug: 'siargao',
    name: 'Siargao',
    description:
      'La capitale mondiale du surf, lagons et ambiance laid-back.',
    tags: ['Surf', 'Zen'],
    href: '/voyager-aux-philippines/siargao',
    fallbackImage: '/images/siargao/surf-a-siargao.webp',
    fallbackAlt:
      'Surfeur sur une vague à Siargao avec cocotiers en arrière-plan',
  },
  {
    slug: 'luzon-manille',
    name: 'Luzon & Manille',
    description:
      'De la mégapole aux rizières en terrasse millénaires de Banaue.',
    tags: ['Culture', 'Urbain'],
    // TODO: route /voyager-aux-philippines/luzon-manille a creer cote backend
    href: '/voyager-aux-philippines',
    placeholder: 'luzon',
  },
];

interface CategoryRow {
  slug: string;
  heroImage?: string | null;
  hero_image?: string | null;
}

export const RegionCards = async () => {
  // Fetch heroImage from Supabase 'categories' table (same source as /voyager-aux-philippines)
  const supabase = await createClient();
  const { data: categories } = await getCategoriesByMainCategory(
    supabase,
    'voyager-aux-philippines'
  );
  const categoriesBySlug = new Map<string, string>();
  (categories as CategoryRow[] | null)?.forEach((cat) => {
    const img = cat.heroImage ?? cat.hero_image ?? null;
    if (img) categoriesBySlug.set(cat.slug, img);
  });

  return (
    <section id="regions" className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Explorer par île
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3 mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Un archipel aux <span className="text-accent">mille visages</span>
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6]">
            Des lagons de Palawan aux rizières de Banaue, en passant par le surf
            à Siargao et la vie urbaine de Manille — choisissez votre porte
            d&apos;entrée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] max-w-6xl mx-auto">
          {regionDefs.map((region) => {
            const supabaseImg = categoriesBySlug.get(region.slug);
            const imageToShow = supabaseImg || region.fallbackImage;
            const imageAlt =
              supabaseImg
                ? `Photo représentative de ${region.name}`
                : region.fallbackAlt;

            return (
              <Link
                key={region.slug}
                href={region.href}
                className="group block bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="relative w-full h-[220px] overflow-hidden">
                  {imageToShow ? (
                    <Image
                      src={imageToShow}
                      alt={imageAlt || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
                    />
                  ) : region.placeholder === 'luzon' ? (
                    <LuzonManillePlaceholder />
                  ) : (
                    // Ultimate fallback: subtle gradient
                    <div className="w-full h-full bg-gradient-to-br from-soft-blue to-warm-yellow/30" />
                  )}

                  {/* Tags pill overlay bottom-left — frosted glass dark for guaranteed legibility */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                    {region.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-white text-[11px] font-semibold backdrop-blur-md shadow-sm"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-[22px] pt-5 pb-[22px]">
                  <h3
                    className="text-[22px] font-semibold text-foreground mb-2.5"
                    style={{ letterSpacing: '-0.01em', lineHeight: 1.25 }}
                  >
                    {region.name}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-[1.55] mb-3.5">
                    {region.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                    Explorer {region.name}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
