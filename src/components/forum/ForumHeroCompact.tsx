import Image from 'next/image';

/**
 * ForumHeroCompact — a short photographic band for DEEP forum pages (a topic, a
 * "not found" state) where a full PageHero would compete with the page's real
 * <h1> (the topic title, rendered below). It gives the forum its photographic
 * identity without duplicating the heading: the overlaid label is a plain <p>
 * (contextual kicker, e.g. the category), never a heading.
 *
 * Same navy scrim recipe as PageHero (bottom-left weighted) so the white label
 * stays legible on any photo. Sits directly under the fixed header (the root
 * layout already reserves the header height), so it needs no big top padding.
 */

interface ForumHeroCompactProps {
  eyebrow?: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
}

export const ForumHeroCompact = ({ eyebrow, title, imageUrl, imageAlt }: ForumHeroCompactProps) => (
  <section className="relative flex min-h-[clamp(200px,28vh,280px)] items-end overflow-hidden">
    <Image src={imageUrl} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(9,16,42,0.28) 0%, rgba(9,16,42,0.52) 55%, rgba(9,16,42,0.82) 100%), linear-gradient(90deg, rgba(9,16,42,0.60) 0%, rgba(9,16,42,0.14) 62%, rgba(9,16,42,0) 100%)',
      }}
      aria-hidden="true"
    />
    <div className="container relative z-10 mx-auto px-4 pb-6 pt-10 md:pb-7">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-2.5 flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
            <span className="h-px w-7 flex-shrink-0 bg-accent" aria-hidden="true" />
            {eyebrow}
          </span>
        )}
        <p
          className="font-bold text-white"
          style={{
            fontSize: 'clamp(1.35rem, 3vw, 1.9rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 22px rgba(9,16,42,0.45)',
          }}
        >
          {title}
        </p>
      </div>
    </div>
  </section>
);

export default ForumHeroCompact;
