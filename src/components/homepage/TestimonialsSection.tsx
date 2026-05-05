type Testimonial = {
  initials: string;
  avatarColor: string;
  stars: number;
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    initials: 'PD',
    avatarColor: '#3B5BDB',
    stars: 5,
    quote:
      "M'installer à Cebu a été la meilleure décision. Le coût de la vie, le climat, la gentillesse des gens… mon entreprise en ligne me permet d'en profiter pleinement.",
    name: 'Pierre D., 42 ans',
    role: 'Entrepreneur digital à Cebu',
  },
  {
    initials: 'MC',
    avatarColor: '#F59E0B',
    stars: 5,
    quote:
      "L'itinéraire IA nous a fait gagner deux semaines de préparation. Tout était parfait, même la météo à Palawan.",
    name: 'Marie & Camille',
    role: 'Couple en voyage de noces',
  },
  {
    initials: 'SL',
    avatarColor: '#0EA5E9',
    stars: 5,
    quote:
      "Trois mois en coliving à Siargao grâce aux bons plans du forum. J'ai enfin trouvé ma communauté francophone.",
    name: 'Sophie L., 28 ans',
    role: 'Digital nomade à Siargao',
  },
];

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
    style={{ opacity: 0.25 }}
    aria-hidden="true"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4.01-3 5-3 5z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4.01-3 5-3 5z" />
  </svg>
);

const StarRow = ({ count }: { count: number }) => (
  <div
    className="flex items-center gap-0.5 text-accent-strong text-[15px] mb-3.5"
    aria-label={`Note ${count} sur 5`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} aria-hidden="true">
        ★
      </span>
    ))}
  </div>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Témoignages
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Ils ont choisi les <span className="text-accent-strong">Philippines</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px] max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <article
              key={t.initials}
              className="relative bg-card rounded-2xl p-7 border-[0.5px] border-border shadow-card-rest"
            >
              <div className="absolute top-5 right-5">
                <QuoteGlyph />
              </div>

              <StarRow count={t.stars} />

              <p
                className="text-[15px] italic leading-[1.6] mb-6"
                style={{ color: '#334155' }}
              >
                « {t.quote} »
              </p>

              <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                <span
                  className="inline-flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: t.avatarColor,
                    fontSize: '14px',
                    letterSpacing: '0.02em',
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate">
                    {t.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground truncate">
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
