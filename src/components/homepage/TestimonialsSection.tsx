type Testimonial = {
  initials: string;
  badgeBg: string;
  badgeText: string;
  stars: number;
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    initials: 'PD',
    badgeBg: '#3B5BDB',
    badgeText: '#ffffff',
    stars: 5,
    quote:
      "M'installer à Cebu a été la meilleure décision. Le coût de la vie, le climat, la gentillesse des gens… mon entreprise en ligne me permet d'en profiter pleinement.",
    name: 'Pierre D., 42 ans',
    role: 'Entrepreneur digital à Cebu',
  },
  {
    initials: 'SL',
    badgeBg: '#F59E0B',
    badgeText: '#1a1a00',
    stars: 5,
    quote:
      "Notre voyage de 3 semaines était incroyable ! L'outil itinéraire de Philippin'Easy nous a vraiment aidés à organiser notre séjour à Palawan et Bohol.",
    name: 'Sophie L., 29 ans',
    role: 'Voyageuse en couple',
  },
  {
    initials: 'MT',
    badgeBg: '#dc2626',
    badgeText: '#ffffff',
    stars: 4,
    quote:
      "Le forum est une mine d'or ! J'ai trouvé toutes les réponses à mes questions sur le visa SRRV et des contacts utiles avant mon départ à la retraite.",
    name: 'Marc T., 63 ans',
    role: 'Futur retraité aux Philippines',
  },
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? '#F59E0B' : 'none'}
    stroke={filled ? '#F59E0B' : '#cbd5e1'}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteGlyph = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-accent"
    style={{ opacity: 0.35 }}
    aria-hidden="true"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4.01-3 5-3 5z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4.01-3 5-3 5z" />
  </svg>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Ils ont choisi les{' '}
            <span className="text-accent">Philippines</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Plus de 10 000 voyageurs et expatriés francophones nous font
            confiance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <article
              key={t.initials}
              className="relative bg-card rounded-2xl p-7 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                border: '0.5px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div className="absolute top-5 right-5">
                <QuoteGlyph />
              </div>

              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < t.stars} />
                ))}
              </div>

              <p
                className="text-foreground mb-6 flex-1"
                style={{
                  fontSize: '15px',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  color: '#334155',
                }}
              >
                « {t.quote} »
              </p>

              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '0.5px solid #e5e7eb' }}>
                <span
                  className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: t.badgeBg,
                    color: t.badgeText,
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.02em',
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-foreground truncate"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="truncate"
                    style={{ fontSize: '12px', color: '#64748b' }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
