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
    <nav aria-label="Fil d'Ariane" className="text-sm text-slate-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-blue-600">
            Accueil
          </Link>
        </li>
        <li className="text-slate-400">/</li>
        <li>
          <Link href="/itineraires-philippines" className="hover:text-blue-600">
            Itinéraires Philippines
          </Link>
        </li>
        <li className="text-slate-400">/</li>
        <li className="text-slate-700" aria-current="page">
          Itinéraire {destinationName}
        </li>
      </ol>
    </nav>
  );
}
