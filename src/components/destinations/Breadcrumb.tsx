import Link from 'next/link';

interface BreadcrumbProps {
  destinationName: string;
}

export function Breadcrumb({ destinationName }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://philippineasy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Itinéraires Philippines',
        item: 'https://philippineasy.com/itineraires-philippines',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Itinéraire ${destinationName}`,
      },
    ],
  };

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="text-[13px] text-muted-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href="/"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Accueil
          </Link>
        </li>
        <li className="text-muted-foreground/50" aria-hidden="true">
          ›
        </li>
        <li>
          <Link
            href="/itineraires-philippines"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Itinéraires Philippines
          </Link>
        </li>
        <li className="text-muted-foreground/50" aria-hidden="true">
          ›
        </li>
        <li className="font-medium text-ink" aria-current="page">
          {destinationName}
        </li>
      </ol>
    </nav>
  );
}
