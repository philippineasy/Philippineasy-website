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

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden text-center group">
      <Link href={`/marketplace/produit/${product.slug}`} className="block">
        <div className="w-full h-48 relative">
          <Image 
            src={product.image_urls?.[0] || 'https://via.placeholder.com/300x200'} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
          />
        </div>
        <div className="p-4">
          <h4 className="font-bold text-lg truncate">{product.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{product.vendors?.name || 'Vendeur inconnu'}</p>
          <p className="font-semibold text-primary mb-3">{product.price.toFixed(2)} €</p>
          <span className="text-sm px-4 py-1 bg-primary/10 text-primary/90 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition">
            Voir détails
          </span>
        </div>
      </Link>
    </div>
  );
};
