/**
 * Schema markup pour la page /services.
 * Combine 3 Service entries (Buddy System, Voyage Serein, Pack Ultime) +
 * AggregateRating global + Organization reference.
 *
 * Eligible rich results :
 * - Service rich card (description, offer price)
 * - Cross-linking avec FAQPage deja present sur la page
 *
 * Note : pas d'AggregateRating tant qu'aucun avis reel n'est collecte (voir
 * commentaire dans le composant).
 */
const ServicesJsonLd = () => {
  const siteUrl = 'https://philippineasy.com';
  const orgRef = { '@id': `${siteUrl}/#organization` };

  // PAS d'AggregateRating : le service n'a pas (encore) de systeme d'avis
  // publics. Injecter une note fabriquee (ex. 4.9 / 10000 votes) genererait de
  // fausses etoiles dans la SERP = trompeur pour l'utilisateur + violation des
  // regles Google Review Snippet (self-serving / unverifiable ratings). On
  // reactivera ce bloc uniquement adosse a de vrais avis collectes.
  // Doc : https://developers.google.com/search/docs/appearance/structured-data/review-snippet

  const services = [
    {
      '@type': 'Service',
      name: 'Buddy System Philippines',
      description:
        "2 a 4 calls de 30min avec un expatrie francais aux Philippines, contact WhatsApp direct, conseils locaux personnalises avant, pendant et apres votre voyage.",
      provider: orgRef,
      areaServed: { '@type': 'Country', name: 'Philippines' },
      serviceType: 'Conciergerie voyage personnalisee',
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
