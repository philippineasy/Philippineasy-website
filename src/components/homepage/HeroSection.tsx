import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center text-center px-4 h-[90vh] overflow-hidden">
      {/* Hero LCP optimise (audit PageSpeed 2026-05-05) :
          - Images statiques pre-resizees (640/1024/1600w) servies via /imagesHero/
            avec Cache-Control immutable -> bypass Vercel Image API et son delai
            d'optimization on-demand (3.15s mesure cold cache).
          - Le <link rel="preload"> dans <head> est gere par le composant homepage
            via un <link> inline (cf. src/app/page.tsx). */}
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/imagesHero/hero-home-640.webp"
          type="image/webp"
        />
        <source
          media="(max-width: 1024px)"
          srcSet="/imagesHero/hero-home-1024.webp"
          type="image/webp"
        />
        <source srcSet="/imagesHero/hero-home-1600.webp" type="image/webp" />
        <img
          src="/imagesHero/hero-home-1024.webp"
          alt="Vue aérienne d'une plage de sable blanc aux Philippines avec des bateaux traditionnels bangka"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </picture>
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(10,20,50,0.30) 0%, rgba(10,20,50,0.55) 100%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-20 max-w-3xl mx-auto">
        <span
          className="inline-flex items-center gap-2 mb-7 text-[13px] font-medium tracking-wide uppercase"
          style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.08em' }}
        >
          <span className="text-warm-yellow" aria-hidden="true">★</span>
          Guide francophone indépendant · Depuis 2020
        </span>
        <h1
          className="text-white font-semibold mb-6"
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 3.25rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Voyage & Expatriation aux{' '}
          <span className="text-accent">Philippines</span>
        </h1>
        <p
          className="text-base md:text-lg mb-10 mx-auto font-normal"
          style={{
            color: 'rgba(255,255,255,0.94)',
            letterSpacing: '0.005em',
            lineHeight: 1.6,
            maxWidth: '34rem',
          }}
        >
          Le guide francophone #1 pour voyager, vivre et s&apos;installer dans
          l&apos;archipel aux 7 641 îles.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold text-base shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            </svg>
            Créer mon itinéraire IA
          </Link>
          <Link
            href="/voyager-aux-philippines"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            Explorer l&apos;archipel
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px]"
          style={{ color: 'rgba(255,255,255,0.94)' }}
        >
          <span>
            <strong className="text-white">47</strong> guides gratuits · <strong className="text-white">93</strong> itinéraires générés
          </span>
          <span aria-hidden="true" className="opacity-50">·</span>
          <span>Sans inscription</span>
        </div>
      </div>
    </section>
  );
};
