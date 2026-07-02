import Link from 'next/link';

/**
 * CTABand — end-of-page call-to-action band, aligned with FinalCtaSection. A
 * rounded blue gradient panel with a centred heading (amber `titleAccent`),
 * optional subtitle, an amber primary button and an optional outline secondary.
 * Server component; the blue surface is a brand constant across themes.
 */

interface CTALink {
  label: string;
  href: string;
}

interface CTABandProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  primary: CTALink;
  secondary?: CTALink;
}

export const CTABand = ({ title, titleAccent, subtitle, primary, secondary }: CTABandProps) => {
  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl text-center text-white"
          style={{
            /* Signature brand gradient — intentionally constant across themes. */
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3B5BDB 100%)',
            padding: 'clamp(3rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 2rem)',
          }}
        >
          {/* Decorative dashed circles for family consistency with the IA panel. */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '280px',
              height: '280px',
              top: '-110px',
              right: '-70px',
              border: '2px dashed rgba(255,255,255,0.12)',
            }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '180px',
              height: '180px',
              bottom: '-56px',
              left: '-36px',
              border: '2px dashed rgba(255,255,255,0.12)',
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl">
            <h2
              className="mb-5 font-bold text-white"
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.375rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
              {titleAccent && (
                <>
                  {' '}
                  <span className="text-accent">{titleAccent}</span>
                </>
              )}
            </h2>

            {subtitle && (
              <p
                className="mx-auto mb-8 max-w-xl text-[16px]"
                style={{ color: 'rgba(255,255,255,0.95)', lineHeight: 1.55 }}
              >
                {subtitle}
              </p>
            )}

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={primary.href}
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {primary.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>

              {secondary && (
                <Link
                  href={secondary.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white/15 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
