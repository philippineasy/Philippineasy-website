import Link from 'next/link';
import Image from 'next/image';

type CategoryClass = 'blue' | 'emerald' | 'purple' | 'amber' | 'teal';

const categoryStyles: Record<CategoryClass, { bg: string; color: string }> = {
  blue: { bg: '#DBEAFE', color: '#1E40AF' },
  emerald: { bg: '#D1FAE5', color: '#065F46' },
  purple: { bg: '#E9D5FF', color: '#6B21A8' },
  amber: { bg: '#FEF3C7', color: '#854D0E' },
  teal: { bg: '#CCFBF1', color: '#115E59' },
};

type BlogPost = {
  title: string;
  category: string;
  categoryClass: CategoryClass;
  read: string;
  date: string;
  image: string;
  imageAlt: string;
  href: string;
};

// TODO: brancher sur getHomepageArticles ou nouveau service getBlogArticles
// quand la query DB sera prete. Contenus statiques alignes au proto en attendant.
const featured = {
  title: 'Partir aux Philippines : le guide complet 2026',
  excerpt:
    "Visa, budget, itinéraires, saisons, transports, culture. Tout ce qu'il faut savoir avant de réserver votre vol pour Manille — compilé par notre équipe sur place depuis 2020.",
  category: 'Guide complet',
  categoryClass: 'blue' as CategoryClass,
  author: 'Marc L.',
  authorInitial: 'M',
  date: '18 mars 2026',
  read: '14 min',
  image: '/images/voyager/iles-philippines-aeriennes.webp',
  imageAlt: 'Vue aérienne de îles karstiques et lagons turquoise des Philippines',
  href: '/voyager-aux-philippines',
};

const sidePosts: BlogPost[] = [
  {
    title: 'Budget voyage : 35€/jour aux Philippines, vraiment ?',
    category: 'Budget',
    categoryClass: 'emerald',
    read: '8 min',
    date: '12 mars',
    image: '/imagesHero/maitriser-son-budget-aux-philippines.webp',
    imageAlt: 'Pesos philippins étalés sur une carte des Philippines',
    href: '/voyager-aux-philippines/budget',
  },
  {
    title: 'Visa longue durée : SRRV, 13A, retraite — comparatif',
    category: 'Visa',
    categoryClass: 'purple',
    read: '11 min',
    date: '05 mars',
    image: '/imagesHero/visa-philippines-processus.webp',
    imageAlt: 'Passeport et visa philippin sur un bureau',
    href: '/vivre-aux-philippines',
  },
];

const rowPosts: BlogPost[] = [
  {
    title: 'Saison des pluies : quand partir et où éviter',
    category: 'Climat',
    categoryClass: 'amber',
    read: '6 min',
    date: '28 fév',
    image: '/imagesHero/meteo-contrastee-aux-philippines.webp',
    imageAlt: 'Ciel contrasté sur les Philippines, nuages de mousson',
    href: '/voyager-aux-philippines/quand-partir',
  },
  {
    title: 'Rencontrer une Philippine : les codes à connaître',
    category: 'Culture',
    categoryClass: 'teal',
    read: '9 min',
    date: '22 fév',
    image: '/imagesHero/couple-rencontre-aux-philippines.webp',
    imageAlt:
      'Couple franco-philippin marchant sur la plage au coucher du soleil',
    href: '/rencontre-philippines',
  },
];

const Badge = ({
  category,
  categoryClass,
  size = 'md',
}: {
  category: string;
  categoryClass: CategoryClass;
  size?: 'sm' | 'md';
}) => {
  const style = categoryStyles[categoryClass];
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center rounded font-bold uppercase tracking-[0.05em] ${sizeClass}`}
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {category}
    </span>
  );
};

export const BlogSection = () => {
  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Magazine · 340+ articles
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3 mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Les <span className="text-accent">derniers articles</span> du blog
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6]">
            Guides pratiques, retours d&apos;expérience et analyses rédigés par
            notre rédaction et les expatriés de la communauté.
          </p>
        </div>

        {/* Layout split : featured (1.5fr) | side stack (1fr) */}
        <div
          className="max-w-6xl mx-auto grid grid-cols-1 gap-[22px] mb-[22px]"
          style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)' }}
        >
          {/* Featured hero */}
          <Link
            href={featured.href}
            className="group relative block rounded-[20px] overflow-hidden cursor-pointer min-h-[480px] shadow-hero transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)] motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:col-start-1"
          >
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={false}
            />
            {/* Scrim bottom→top */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10, 20, 50, 0.90) 0%, rgba(10, 20, 50, 0.55) 45%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            {/* Top-left badge */}
            <div className="absolute top-5 left-5 z-10">
              <Badge category={featured.category} categoryClass={featured.categoryClass} />
            </div>
            {/* Bottom overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.06em] font-medium mb-2.5">
                <span className="text-warm-yellow">★ À la une</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {featured.read} de lecture
                </span>
              </div>
              <h3
                className="text-[clamp(1.5rem,2.6vw,1.875rem)] font-bold leading-[1.2] tracking-[-0.02em] mb-3.5 max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                {featured.title}
              </h3>
              <p
                className="text-[15px] leading-[1.55] mb-5 max-w-xl"
                style={{ color: 'rgba(255,255,255,0.85)', textWrap: 'pretty' }}
              >
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <span
                  className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center text-white font-bold text-[14px] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                  }}
                  aria-hidden="true"
                >
                  {featured.authorInitial}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[13px] font-semibold">
                    {featured.author}
                  </strong>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {featured.date}
                  </span>
                </div>
                <span className="ml-auto text-[13px] font-semibold text-warm-yellow">
                  Lire l&apos;article
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>

          {/* Side stack 2 horizontal cards */}
          <div className="flex flex-col gap-[18px]">
            {sidePosts.map((post) => (
              <Link
                key={post.href + post.title}
                href={post.href}
                className="group flex bg-card rounded-[14px] overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30 motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="relative w-[140px] flex-shrink-0 min-h-[130px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    sizes="140px"
                  />
                </div>
                <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col gap-2 justify-center">
                  <Badge category={post.category} categoryClass={post.categoryClass} size="sm" />
                  <h4
                    className="text-[15px] font-semibold text-foreground leading-[1.35]"
                    style={{ letterSpacing: '-0.005em', textWrap: 'balance' }}
                  >
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.04em]">
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.read}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary row : 2 cards + "Tous les articles" CTA */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {rowPosts.map((post) => (
            <Link
              key={post.href + post.title}
              href={post.href}
              className="group block bg-card rounded-[14px] overflow-hidden border-[0.5px] border-border shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30 motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="relative h-[140px] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                <div className="absolute top-3 left-3">
                  <Badge category={post.category} categoryClass={post.categoryClass} size="sm" />
                </div>
              </div>
              <div className="px-4 py-4">
                <h4
                  className="text-[15px] font-semibold text-foreground leading-[1.35] mb-2"
                  style={{ letterSpacing: '-0.005em', textWrap: 'balance' }}
                >
                  {post.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.04em]">
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.read} lecture</span>
                </div>
              </div>
            </Link>
          ))}

          {/* "Tous les articles" CTA card — dashed border style */}
          <Link
            href="/actualites-sur-les-philippines"
            className="group rounded-[14px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #F4F7FE 0%, #ffffff 100%)',
              border: '1.5px dashed #C7D2FE',
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-2 justify-center min-h-[180px] h-full">
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-primary">
                Magazine
              </span>
              <strong
                className="text-[24px] font-bold text-foreground"
                style={{ letterSpacing: '-0.01em' }}
              >
                340+ articles
              </strong>
              <p className="text-[13px] text-muted-foreground leading-[1.5] mb-2">
                Visa, budget, régions, culture, expatriation, business, famille…
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                Tous les articles
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
