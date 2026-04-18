import Link from 'next/link';
import Image from 'next/image';

const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0 text-accent"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const regions = [
  'Palawan (El Nido, Coron)',
  'Visayas (Cebu, Bohol)',
  'Siargao',
  'Boracay',
  'Luzon (Banaue)',
  'Manille',
];

export const ArchipelMilleVisages = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Un archipel aux <span className="text-accent">mille visages</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Des lagons de Palawan aux rizières de Banaue, en passant par le surf
            à Siargao et la vie urbaine de Manille — choisissez votre porte
            d&apos;entrée.
          </p>
        </div>

        <div
          className="max-w-6xl mx-auto bg-card rounded-2xl p-6 md:p-8 grid gap-8 md:gap-10 items-center"
          style={{
            border: '0.5px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            gridTemplateColumns: '1fr',
          }}
        >
          <div className="md:grid md:grid-cols-[1.1fr_1fr] md:gap-10 grid gap-8 items-center">
            <div className="relative w-full h-64 md:h-[380px] rounded-xl overflow-hidden">
              <Image
                src="/images/voyager/iles-philippines-aeriennes.webp"
                alt="Vue aérienne des îles karstiques et lagons turquoise des Philippines"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                Six régions, mille ambiances
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Les Philippines, c&apos;est 7 641 îles et autant d&apos;univers à
                explorer. Plages paradisiaques, volcans majestueux, métropoles
                trépidantes, villages pêcheurs — chaque région raconte une
                histoire différente.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-7">
                {regions.map((region) => (
                  <li
                    key={region}
                    className="flex items-center gap-2.5 text-[15px] text-foreground"
                  >
                    <PinIcon />
                    <span>{region}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/voyager-aux-philippines"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold text-sm shadow-md transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-lg"
              >
                Explorer par île
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
