'use client';

import { useCart } from '@/contexts/CartContext';

type Product = {
  id: number;
  name: string;
  price: number;
  image_urls: string[] | null;
  // Add other fields that might be needed by the cart
};

export const ProductInteraction = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold text-lg"
    >
      Ajouter au panier
    </button>
  );
};
