import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_urls: string[] | null;
  vendors: {
    name: string;
  } | null;
};

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  price.toLocaleString('fr-FR', {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/marketplace-aux-philippines/produit/${product.slug}`}
      className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        border: '0.5px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div className="relative w-full h-[180px] overflow-hidden">
        {product.image_urls?.[0] ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-soft-blue" />
        )}
      </div>
      <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
        {product.vendors?.name && (
          <span
            className="inline-flex items-center self-start mb-2.5 px-2 py-0.5 rounded"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#3B5BDB',
              backgroundColor: '#F4F7FE',
            }}
          >
            {product.vendors.name}
          </span>
        )}
        <h3
          className="text-foreground mb-3 line-clamp-2"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Prix
            </p>
            <p
              className="text-foreground tabular-nums"
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {formatPrice(product.price)} €
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1 text-primary text-sm font-medium flex-shrink-0"
            aria-hidden="true"
          >
            Voir
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};
