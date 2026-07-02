'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

type Product = {
  id: number;
  name: string;
  price: number;
  image_urls: string[] | null;
  // Add other fields that might be needed by the cart
};

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const ProductInteraction = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const stepBtn =
    'inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">Quantité</span>
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-card">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
            className={stepBtn}
          >
            <MinusIcon />
          </button>
          <span
            className="inline-flex h-11 min-w-[2.5rem] items-center justify-center px-1 text-[15px] font-semibold tabular-nums text-foreground"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Augmenter la quantité"
            className={stepBtn}
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <button
        onClick={() => addToCart(product, quantity)}
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-accent px-6 py-4 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.01] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <CartIcon />
        Ajouter au panier
      </button>
    </div>
  );
};
