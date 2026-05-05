import Link from 'next/link';
import type { ReactNode } from 'react';

type SvgProps = { className?: string };

const HouseIcon = ({ className }: SvgProps) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
);

const BriefcaseIcon = ({ className }: SvgProps) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </svg>
);

const DollarIcon = ({ className }: SvgProps) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const GraduationIcon = ({ className }: SvgProps) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11v4c0 1.5 2.5 3 6 3s6-1.5 6-3v-4" />
    <path d="M22 9v5" />
  </svg>
);

type Theme = {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: ReactNode;
};

const themes: Theme[] = [
  {
    href: '/vivre-aux-philippines/s-installer',
    title: "S'installer",
    description: 'Visas, logement, vie quotidienne aux Philippines.',
    cta: 'En savoir plus',
    icon: <HouseIcon />,
  },
  {
    href: '/vivre-aux-philippines/travailler',
    title: 'Travailler',
    description: "Emploi, création d'entreprise, télétravail.",
    cta: 'Guides pro',
    icon: <BriefcaseIcon />,
  },
  {
    href: '/vivre-aux-philippines/investir',
    title: 'Investir',
    description: 'Opportunités, immobilier, fiscalité.',
    cta: 'Opportunités',
    icon: <DollarIcon />,
  },
  {
    href: '/vivre-aux-philippines/etudier',
    title: 'Étudier',
    description: "Universités, écoles, cours d'anglais.",
    cta: 'Découvrir',
    icon: <GraduationIcon />,
  },
];

export const InstallerCards = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-[720px] mx-auto mb-12">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Vivre aux Philippines
          </span>
          <h2
            className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mt-3 mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            S&apos;installer aux <span className="text-accent">Philippines</span>
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.6]">
            Quatre chemins pour faire des Philippines votre nouvelle maison.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px] max-w-6xl mx-auto">
          {themes.map((theme) => (
            <Link
              key={theme.href}
              href={theme.href}
              className="group flex flex-col items-center text-center bg-card rounded-2xl px-[22px] py-7 border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div
                className="w-16 h-16 mb-[18px] flex items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                style={{ backgroundColor: 'rgba(59, 91, 219, 0.08)' }}
              >
                {theme.icon}
              </div>
              <h3
                className="text-[19px] font-semibold text-foreground mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                {theme.title}
              </h3>
              <p className="text-[14px] text-muted-foreground leading-[1.55] mb-4 flex-1">
                {theme.description}
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                {theme.cta}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
