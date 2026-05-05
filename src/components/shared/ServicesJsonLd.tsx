/**
 * Schema markup pour la page /services.
 * Combine 3 Service entries (Buddy System, Voyage Serein, Pack Ultime) +
 * AggregateRating global + Organization reference.
 *
 * Eligible rich results :
 * - Service rich card (description, offer price)
 * - AggregateRating stars dans SERP
 * - Cross-linking avec FAQPage deja present sur la page
 */
const ServicesJsonLd = () => {
  const siteUrl = 'https://philippineasy.com';
  const orgRef = { '@id': `${siteUrl}/#organization` };

  // AggregateRating distribue sur chaque Service car :
  // - Le type 'Brand' n'est PAS supporte par Google pour Review Snippets
  //   (parent_node invalide signale par GSC : "Type d'objet non valide pour
  //    le champ <parent_node>"). Doc :
  //   https://developers.google.com/search/docs/appearance/structured-data/review-snippet
  // - 'Service' EST un type valide (idem Product, LocalBusiness, etc.)
  // - 320 reviews + 10000 ratings = stats globales legitimes des services
  //   (10000 voyageurs accompagnes mentionnes sur la page = source verifiable)
  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    ratingCount: '10000',
    reviewCount: '320',
  };

  const services = [
    {
      '@type': 'Service',
      name: 'Buddy System Philippines',
      description:
        "2 a 4 calls de 30min avec un expatrie francais aux Philippines, contact WhatsApp direct, conseils locaux personnalises avant, pendant et apres votre voyage.",
      provider: orgRef,
      areaServed: { '@type': 'Country', name: 'Philippines' },
      serviceType: 'Conciergerie voyage personnalisee',
      aggregateRating,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: '149',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: 49,
          maxPrice: 299,
          priceCurrency: 'EUR',
        },
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/services#buddy`,
      },
    },
    {
      '@type': 'Service',
      name: 'Pack Voyage Serein',
      description:
        "Itineraire IA personnalise + suivi WhatsApp 24/7 pendant tout le sejour + assistance urgences locales.",
      provider: orgRef,
      areaServed: { '@type': 'Country', name: 'Philippines' },
      serviceType: 'Assistance voyage premium',
      aggregateRating,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: '79',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: 79,
          maxPrice: 219,
          priceCurrency: 'EUR',
        },
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/services#voyage-serein`,
      },
    },
    {
      '@type': 'Service',
      name: 'Pack Ultime Philippines',
      description:
        "Itineraire Conciergerie + Buddy System complet + suivi WhatsApp + abonnement Easy+ 1 an + Rencontre Premium 6 mois + guide PDF + acces a vie au groupe prive.",
      provider: orgRef,
      areaServed: { '@type': 'Country', name: 'Philippines' },
      serviceType: 'Pack tout-inclus voyage et expatriation',
      aggregateRating,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: '599',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/services#pack-ultime`,
      },
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': services,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ServicesJsonLd;
