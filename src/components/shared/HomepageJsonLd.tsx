const HomepageJsonLd = () => {
  const siteUrl = 'https://philippineasy.com';
  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: "Philippin'Easy",
    url: siteUrl,
    logo: `${siteUrl}/logo-512.png`,
    description: "La communauté francophone des Philippines - Guide complet pour voyager, vivre et s'épanouir dans l'archipel.",
    // Aligné sur les liens réels du Footer (src/components/layout/Footer.tsx) —
    // pas de Twitter/X, aucun compte n'existe.
    sameAs: [
      "https://www.facebook.com/share/1RfoyAcYFU/?mibextid=wwXIfr",
      "https://www.instagram.com/philippineseasy",
      "https://t.me/philippineasy",
      "https://youtube.com/@philippineasy",
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
