// Cette section remplace d'anciens « témoignages » fictifs (noms et notes
// inventés). Un site jeune avec de VRAIS arguments vaut mieux que de faux avis :
// on met donc en avant 3 preuves concrètes et vérifiables, avec le même soin
// visuel. Aucun chiffre inventé, aucune note fabriquée.

type Proof = {
  stat: string;
  statLabel: string;
  title: string;
  text: string;
  icon: 'guides' | 'route' | 'community';
  tone: {
    bg: string;
    fg: string;
  };
};

// Exception : `tone.bg` / `tone.fg` sont une petite palette d'accents pour les
// pastilles d'icônes (fond doux + icône), lisible dans les deux thèmes —
// volontairement non tokenisée, comme les pastilles TrustBadge.
const proofs: Proof[] = [
  {
    stat: '47',
    statLabel: 'guides gratuits',
    title: 'Sourcés et sans paywall',
    text: "Voyage, visa, coût de la vie, logement, travail : nos guides sont en accès libre et mis à jour depuis le terrain, pas recopiés d'un guide touristique.",
    icon: 'guides',
    tone: { bg: '#FEF3C7', fg: '#B45309' },
  },
  {
    stat: '93',
    statLabel: 'itinéraires générés',
    title: 'IA + validation humaine',
    text: "L'IA compose votre programme jour par jour en quelques secondes, puis un Français installé aux Philippines vérifie que chaque étape tient la route.",
    icon: 'route',
    tone: { bg: '#F4F7FE', fg: '#3B5BDB' },
  },
  {
    stat: '100 %',
    statLabel: 'francophone',
    title: 'Une vraie communauté',
    text: "Forum d'entraide et support WhatsApp : posez vos questions à des expatriés francophones qui vivent l'archipel, jamais à un centre d'appels ni à un bot.",
    icon: 'community',
    tone: { bg: '#ECFDF5', fg: '#059669' },
  },
];

const ProofIcon = ({ name }: { name: Proof['icon'] }) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'guides') {
    // open book
    return (
      <svg {...common}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }
  if (name === 'route') {
    // route / map pins
    return (
      <svg {...common}>
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="5" r="3" />
        <path d="M9 19h6a3 3 0 0 0 3-3V8M6 16V8a3 3 0 0 1 3-3h6" />
      </svg>
    );
  }
  // community / chat
  return (
    <svg {...common}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Ce que vous trouvez ici
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            De vrais atouts, <span className="text-accent">concrets</span>
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6] mt-3">
            Un guide francophone indépendant, des ressources réelles et des
            conseils testés sur place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px] max-w-6xl mx-auto">
          {proofs.map((p) => (
            <article
              key={p.statLabel}
              className="relative bg-card rounded-2xl p-7 border-[0.5px] border-border shadow-card-rest transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:transform-none"
            >
              <span
                className="inline-flex items-center justify-center rounded-xl"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: p.tone.bg,
                  color: p.tone.fg,
                }}
                aria-hidden="true"
              >
                <ProofIcon name={p.icon} />
              </span>

              <div className="mt-5 flex items-baseline gap-2">
                <strong
                  className="text-[34px] font-bold text-foreground tabular-nums"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1 }}
                >
                  {p.stat}
                </strong>
                <span
                  className="text-[13px] font-medium uppercase text-muted-foreground"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {p.statLabel}
                </span>
              </div>

              <h3 className="text-[17px] font-semibold text-foreground mt-4 mb-2">
                {p.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-foreground/75">
                {p.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
