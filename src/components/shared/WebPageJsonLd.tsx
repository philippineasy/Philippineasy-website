interface WebPageJsonLdProps {
  title: string;
  description: string;
  path: string;
}

const WebPageJsonLd = ({ title, description, path }: WebPageJsonLdProps) => {
  const siteUrl = 'https://philippineasy.com';
  const pageUrl = `${siteUrl}${path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: "Philippin'Easy",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-philippineasy.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default WebPageJsonLd;
