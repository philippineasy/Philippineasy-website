const HomepageJsonLd = () => {
  const siteUrl = 'https://philippineasy.com';
  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: "Philippin'Easy",
    url: siteUrl,
    logo: `${siteUrl}/logo-philippineasy.png`,
    sameAs: [
      // Add social media links here when available
      // e.g., "https://www.facebook.com/philippineasy",
    ],
  };

  const webSite = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: "Philippin'Easy",
    description: "Votre guide complet pour voyager, vivre et vous épanouir dans l'archipel des 7 641 îles.",
    publisher: {
      '@id': organization['@id'],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/recherche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organization, webSite],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default HomepageJsonLd;
