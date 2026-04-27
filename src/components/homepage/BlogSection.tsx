import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { generateArticleUrl } from '@/lib/utils';

type CategoryClass = 'blue' | 'emerald' | 'purple' | 'amber' | 'teal';

const categoryStyles: Record<CategoryClass, { bg: string; color: string }> = {
  blue: { bg: '#DBEAFE', color: '#1E40AF' },
  emerald: { bg: '#D1FAE5', color: '#065F46' },
  purple: { bg: '#E9D5FF', color: '#6B21A8' },
  amber: { bg: '#FEF3C7', color: '#854D0E' },
  teal: { bg: '#CCFBF1', color: '#115E59' },
};

// Each homepage slot maps to a real article slug. The category badge,
// fallback image and read-time are editorial overrides — they keep the
// homepage visually stable even if the underlying article is updated.
type Slot = {
  slug: string;
  badgeLabel: string;
  badgeClass: CategoryClass;
  fallbackImage: string;
  fallbackImageAlt: string;
  fallbackReadingTime: string;
  fallbackTitle: string;
  fallbackDate: string;
};

const FEATURED: Slot = {
  slug: 'partir-aux-philippines-guide-complet-2026',
  badgeLabel: 'Guide complet',
  badgeClass: 'blue',
  fallbackImage: '/images/voyager/iles-philippines-aeriennes.webp',
  fallbackImageAlt:
    'Vue aérienne de îles karstiques et lagons turquoise des Philippines',
  fallbackReadingTime: '14 min',
  fallbackTitle: 'Partir aux Philippines : le guide complet 2026',
  fallbackDate: '22 avril 2026',
};

const SIDE_SLOTS: Slot[] = [
  {
    slug: 'budget-voyage-35-euros-jour-philippines',
    badgeLabel: 'Budget',
    badgeClass: 'emerald',
    fallbackImage: '/imagesHero/maitriser-son-budget-aux-philippines.webp',
    fallbackImageAlt: 'Pesos philippins étalés sur une carte des Philippines',
    fallbackReadingTime: '8 min',
    fallbackTitle: 'Budget voyage : 35€/jour aux Philippines, vraiment ?',
    fallbackDate: '15 avril',
  },
  {
    slug: 'visa-longue-duree-srrv-13a-comparatif',
    badgeLabel: 'Visa',
    badgeClass: 'purple',
    fallbackImage: '/imagesHero/visa-philippines-processus.webp',
    fallbackImageAlt: 'Passeport et visa philippin sur un bureau',
    fallbackReadingTime: '11 min',
    fallbackTitle: 'Visa longue durée : SRRV, 13A, retraite — comparatif',
    fallbackDate: '8 avril',
  },
];

const ROW_SLOTS: Slot[] = [
  {
    slug: 'saison-pluies-quand-partir-philippines',
    badgeLabel: 'Climat',
    badgeClass: 'amber',
    fallbackImage: '/imagesHero/meteo-contrastee-aux-philippines.webp',
    fallbackImageAlt: 'Ciel contrasté sur les Philippines, nuages de mousson',
    fallbackReadingTime: '6 min',
    fallbackTitle: 'Saison des pluies : quand partir et où éviter',
    fallbackDate: '1 avril',
  },
  {
    slug: 'codes-culturels-philippins-couple-famille-religion',
    badgeLabel: 'Culture',
    badgeClass: 'teal',
    fallbackImage: '/imagesHero/couple-rencontre-aux-philippines.webp',
    fallbackImageAlt:
      'Couple franco-philippin marchant sur la plage au coucher du soleil',
    fallbackReadingTime: '9 min',
    fallbackTitle: 'Codes culturels philippins en couple',
    fallbackDate: '25 mars',
  },
];

const FEATURED_AUTHOR = { name: 'Marc L.', initial: 'M' };

interface FetchedArticle {
  slug: string;
  title: string;
  image: string | null;
  reading_time: number | null;
  published_at: string | null;
  category: { slug: string; main_category: string } | null;
}

const formatLongDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

const formatShortDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      })
    : '';

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

async function fetchSlots(slugs: string[]): Promise<Map<string, FetchedArticle>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('slug, title, image, reading_time, published_at, category:categories(slug, main_category)')
    .in('slug', slugs)
    .eq('status', 'published');

  if (error || !data) {
    console.error('BlogSection: failed to fetch articles', error);
    return new Map();
  }
  const map = new Map<string, FetchedArticle>();
  (data as unknown as FetchedArticle[]).forEach((a) => map.set(a.slug, a));
  return map;
}

const resolveSlot = (slot: Slot, fetched: Map<string, FetchedArticle>) => {
  const article = fetched.get(slot.slug);
  const url = article?.category
    ? generateArticleUrl({
        category: { slug: article.category.slug, main_category: article.category.main_category },
        slug: article.slug,
      })
    : '/';
  return {
    href: url,
    title: article?.title || slot.fallbackTitle,
    image: article?.image || slot.fallbackImage,
    imageAlt: article?.image ? slot.fallbackTitle : slot.fallbackImageAlt,
    readingTime: article?.reading_time
      ? `${article.reading_time} min`
      : slot.fallbackReadingTime,
    longDate: article?.published_at
      ? formatLongDate(article.published_at)
      : slot.fallbackDate,
    shortDate: article?.published_at
      ? formatShortDate(article.published_at)
      : slot.fallbackDate,
  };
};

export const BlogSection = async () => {
  const allSlugs = [FEATURED, ...SIDE_SLOTS, ...ROW_SLOTS].map((s) => s.slug);
  const fetched = await fetchSlots(allSlugs);

  const featured = resolveSlot(FEATURED, fetched);
  const sidePosts = SIDE_SLOTS.map((s) => ({ slot: s, ...resolveSlot(s, fetched) }));
  const rowPosts = ROW_SLOTS.map((s) => ({ slot: s, ...resolveSlot(s, fetched) }));

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
              <Badge category={FEATURED.badgeLabel} categoryClass={FEATURED.badgeClass} />
            </div>
            {/* Bottom overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.06em] font-medium mb-2.5">
                <span className="text-warm-yellow">★ À la une</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {featured.readingTime} de lecture
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
                Visa, budget, itinéraires, saisons, transports, culture. Tout ce
                qu&apos;il faut savoir avant de réserver votre vol pour Manille
                — compilé par notre équipe sur place depuis 2020.
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <span
                  className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center text-white font-bold text-[14px] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                  }}
                  aria-hidden="true"
                >
                  {FEATURED_AUTHOR.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[13px] font-semibold">
                    {FEATURED_AUTHOR.name}
                  </strong>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {featured.longDate}
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
                key={post.slot.slug}
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
                  <Badge
                    category={post.slot.badgeLabel}
                    categoryClass={post.slot.badgeClass}
                    size="sm"
                  />
                  <h4
                    className="text-[15px] font-semibold text-foreground leading-[1.35]"
                    style={{ letterSpacing: '-0.005em', textWrap: 'balance' }}
                  >
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.04em]">
                    <span>{post.shortDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
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
              key={post.slot.slug}
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
                  <Badge
                    category={post.slot.badgeLabel}
                    categoryClass={post.slot.badgeClass}
                    size="sm"
                  />
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
                  <span>{post.shortDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} lecture</span>
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
