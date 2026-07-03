import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_urls: string[] | null;
  // Supabase returns joined rows as an array; hub page normalises to an object.
  // Accept both so the vendor badge shows on hub, category, vendor and related grids.
  vendors: { name: string } | { name: string }[] | null;
};

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  price.toLocaleString('fr-FR', {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

const ImagePlaceholderIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const ProductCard = ({ product }: ProductCardProps) => {
  const vendorName = Array.isArray(product.vendors)
    ? product.vendors[0]?.name
    : product.vendors?.name;

  return (
    <Link
      href={`/marketplace-aux-philippines/produit/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        {product.image_urls?.[0] ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground/40">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-[18px]">
        {vendorName && (
          <span className="mb-2.5 inline-flex self-start rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-primary">
            {vendorName}
          </span>
        )}

        <h3
          className="mb-3 line-clamp-2 text-[16px] font-semibold leading-[1.35] text-foreground"
          style={{ letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Prix
            </p>
            <p
              className="text-[18px] font-bold leading-none tabular-nums text-accent-strong"
              style={{ letterSpacing: '-0.01em' }}
            >
              {formatPrice(product.price)} €
            </p>
          </div>
          <span
            className="inline-flex flex-shrink-0 items-center gap-1 text-sm font-medium text-primary"
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
