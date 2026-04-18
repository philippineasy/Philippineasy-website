import Link from 'next/link';
import type { ReactNode } from 'react';

type SvgProps = { className?: string };

const HouseIcon = ({ className }: SvgProps) => (
  <svg
    width="40"
    height="40"
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
    width="40"
    height="40"
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
    width="40"
    height="40"
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
    width="40"
    height="40"
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
  icon: ReactNode;
};

const themes: Theme[] = [
  {
    href: '/vivre-aux-philippines/s-installer',
    title: "S'installer",
    description: 'Visas, logement, vie quotidienne.',
    icon: <HouseIcon className="text-primary" />,
  },
  {
    href: '/vivre-aux-philippines/travailler',
    title: 'Travailler',
    description: "Marché de l'emploi, création d'entreprise.",
    icon: <BriefcaseIcon className="text-primary" />,
  },
  {
    href: '/vivre-aux-philippines/investir',
    title: 'Investir',
    description: 'Opportunités, immobilier, business.',
    icon: <DollarIcon className="text-primary" />,
  },
  {
    href: '/vivre-aux-philippines/etudier',
    title: 'Étudier',
    description: 'Universités, écoles internationales.',
    icon: <GraduationIcon className="text-primary" />,
  },
];

export const InstallerCards = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            S&apos;installer aux <span className="text-accent">Philippines</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            S&apos;installer, travailler, investir — toutes les clés pour
            réussir votre projet de vie dans l&apos;archipel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {themes.map((theme) => (
            <Link
              key={theme.href}
              href={theme.href}
              className="group flex flex-col items-center text-center bg-card rounded-2xl px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                border: '0.5px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-[14px] transition-transform duration-200 group-hover:scale-105"
              >
                {theme.icon}
              </div>
              <h3
                className="text-[16px] text-foreground mb-1.5"
                style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {theme.title}
              </h3>
              <p
                className="text-[12px]"
                style={{ color: '#64748b', lineHeight: 1.55 }}
              >
                {theme.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
