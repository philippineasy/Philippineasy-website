import type { ReactNode } from 'react';

/**
 * AppWindowPanel — the signature panel: rounded blue gradient with an editorial
 * left column (eyebrow, accent title, checklist) and a white "app window" on the
 * right (macOS-style bar) that holds any interactive tool passed as `children`.
 * Generalises the ItineraireIABlock / VisaSimulator layout. Server component.
 */

interface AppWindowPanelProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  bullets?: string[];
  windowTitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const AppWindowPanel = ({
  eyebrow,
  title,
  titleAccent,
  bullets,
  windowTitle,
  children,
  footer,
}: AppWindowPanelProps) => {
  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl text-white"
          style={{
            /* Signature brand gradient — intentionally constant across themes. */
            background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Decorative dashed circles (top-right + bottom-left). */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '320px',
              height: '320px',
              top: '-120px',
              right: '-80px',
              border: '2px dashed rgba(255,255,255,0.13)',
            }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              bottom: '-60px',
              left: '-40px',
              border: '2px dashed rgba(255,255,255,0.13)',
              opacity: 0.9,
            }}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
            {/* Left column — editorial pitch */}
            <div className="md:pt-1">
              <span
                className="mb-4 inline-block text-[13px] font-medium uppercase"
                style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.95)' }}
              >
                <span className="mr-1.5 text-accent" aria-hidden="true">
                  ✦
                </span>
                {eyebrow}
              </span>

              <h2
                className="mb-4 font-bold text-white"
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
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

              {bullets && bullets.length > 0 && (
                <ul className="flex flex-col gap-2.5" role="list">
                  {bullets.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-[14px]"
                      style={{ color: 'rgba(255,255,255,0.92)' }}
                    >
                      <span
                        className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent"
                        aria-hidden="true"
                      >
                        <CheckIcon />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right column — white "app" window */}
            <div className="overflow-hidden rounded-2xl bg-card text-foreground shadow-mockup">
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
                {windowTitle && (
                  <span className="ml-3 truncate text-[12px] font-semibold text-muted-foreground">
                    {windowTitle}
                  </span>
                )}
              </div>
              <div className="px-5 py-5">{children}</div>
            </div>
          </div>

          {footer && (
            <div className="relative mt-8 border-t border-white/15 pt-6 text-[13px] text-white/70">
              {footer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
