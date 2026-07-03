import Link from 'next/link';

// Exception: DecorWaves / DecorCircles are decorative warm-yellow (#FCD34D,
// = the `warm-yellow` token) artwork layered on the fixed signature blue
// gradient below — they read identically in both themes.
const DecorWaves = () => (
  <svg
    className="absolute inset-x-0 bottom-0 w-full pointer-events-none"
    viewBox="0 0 1440 200"
    preserveAspectRatio="none"
    style={{ height: 'clamp(90px, 14vh, 140px)', opacity: 0.2 }}
    aria-hidden="true"
  >
    <path
      d="M0 120 C 240 60, 480 180, 720 120 C 960 60, 1200 180, 1440 120 L 1440 200 L 0 200 Z"
      fill="#FCD34D"
    />
    <path
      d="M0 150 C 240 100, 480 200, 720 150 C 960 100, 1200 200, 1440 150 L 1440 200 L 0 200 Z"
      fill="#FCD34D"
      opacity="0.5"
    />
  </svg>
);

const DecorCircles = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1440 500"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <g fill="#FCD34D">
      <circle cx="120" cy="90" r="6" opacity="0.5" />
      <circle cx="1320" cy="120" r="4" opacity="0.45" />
      <circle cx="1180" cy="60" r="7" opacity="0.4" />
      <circle cx="220" cy="180" r="3" opacity="0.5" />
      <circle cx="1280" cy="220" r="5" opacity="0.4" />
      <circle cx="80" cy="280" r="4" opacity="0.45" />
      <circle cx="1380" cy="320" r="6" opacity="0.4" />
    </g>
  </svg>
);

export const FinalCtaSection = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const primaryHref = isAuthenticated ? '/profil' : '/connexion';
  const primaryLabel = isAuthenticated ? 'Accéder à mon compte' : 'Créer un compte';

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl text-center"
          style={{
            // Exception: signature brand gradient (dark blue), white text on top.
            background:
              'linear-gradient(135deg, #1e3a8a 0%, #3B5BDB 100%)',
            padding: 'clamp(3rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 2rem)',
          }}
        >
          <DecorCircles />
          <DecorWaves />

          <div className="relative max-w-3xl mx-auto">
            <h2
              className="text-white font-bold mb-5"
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.375rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Prêt à écrire votre histoire{' '}
              <span className="text-warm-yellow">philippine</span> ?
            </h2>

            <p
              className="mx-auto mb-8"
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: '16px',
                lineHeight: 1.55,
                maxWidth: '36rem',
              }}
            >
              Rejoignez une communauté francophone de voyageurs et
              d&apos;expatriés, et laissez-vous guider par des Français qui
              vivent l&apos;archipel au quotidien.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base bg-accent text-accent-foreground shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                {primaryLabel}
                <span aria-hidden="true">→</span>
              </Link>

              <button
                id="open-chatbot"
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-medium text-base text-white transition-all duration-200 hover:bg-white/15"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                Discuter avec l&apos;équipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
