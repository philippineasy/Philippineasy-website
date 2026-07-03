interface ProductJsonLdProps {
  product: any; // Using 'any' for now to match the structure from the page
}

const ProductJsonLd = ({ product }: ProductJsonLdProps) => {
  const reviews = product.product_reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
    : null;
  const reviewCount = reviews.length;
  const vendorName: string | undefined = product.vendor?.name;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_urls?.[0] || '',
    sku: product.id,
    mpn: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR', // Assuming EUR, adjust if dynamic
      availability: 'https://schema.org/InStock', // Assuming in stock
      url: `https://philippineasy.com/marketplace-aux-philippines/produit/${product.slug}`,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Valid for one year
      // The checkout charges no shipping fee, so advertise free shipping to keep
      // the announced price equal to the price actually paid.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
    hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    },
  };

  if (vendorName) {
    jsonLd.brand = {
      '@type': 'Brand',
      name: vendorName,
    };
    jsonLd.offers.seller = {
      '@type': 'Organization',
      name: vendorName,
    };
  }

  if (reviewCount > 0 && averageRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviewCount,
    };
    jsonLd.review = reviews.map((review: any) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      author: {
        '@type': 'Person',
        name: review.profiles?.username || 'Client vérifié',
      },
      reviewBody: review.comment,
      datePublished: review.created_at,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ProductJsonLd;
