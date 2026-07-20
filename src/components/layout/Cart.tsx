'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

const formatPrice = (price: number) =>
  price.toLocaleString('fr-FR', {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

const ImagePlaceholderIcon = () => (
  <svg
    width="22"
    height="22"
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

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Cart = () => {
  const { cart, itemCount, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const stepBtn =
    'inline-flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={itemCount > 0 ? `Panier (${itemCount} ${itemCount === 1 ? 'article' : 'articles'})` : 'Panier'}
        className="relative w-11 h-11 inline-flex items-center justify-center rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
        {itemCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Portal obligatoire : la nav du header a un backdrop-filter, qui fait
          d'elle le containing block de tout descendant en position:fixed — sans
          portal, l'overlay est confiné à la hauteur du header. */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[60] bg-night/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Panier"
        >
          <div
            className="fixed top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-bold text-foreground">
                Votre panier
                {itemCount > 0 && (
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    ({itemCount} {itemCount === 1 ? 'article' : 'articles'})
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le panier"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                  </span>
                  <p className="font-semibold text-foreground">Votre panier est vide</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Parcourez la marketplace pour trouver des produits.
                  </p>
                  <Link
                    href="/marketplace-aux-philippines"
                    onClick={() => setIsOpen(false)}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Découvrir la marketplace
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => {
                    const productHref = item.product.slug
                      ? `/marketplace-aux-philippines/produit/${item.product.slug}`
                      : null;
                    const image = item.product.image_urls?.[0];
                    return (
                      <li
                        key={item.product.id}
                        className="flex gap-4 rounded-xl border-[0.5px] border-border bg-card p-3 shadow-card-rest"
                      >
                        {productHref ? (
                          <Link
                            href={productHref}
                            onClick={() => setIsOpen(false)}
                            className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {image ? (
                              <Image src={image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground/50">
                                <ImagePlaceholderIcon />
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            {image ? (
                              <Image src={image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground/50">
                                <ImagePlaceholderIcon />
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex min-w-0 flex-grow flex-col">
                          {productHref ? (
                            <Link
                              href={productHref}
                              onClick={() => setIsOpen(false)}
                              className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                            >
                              {item.product.name}
                            </Link>
                          ) : (
                            <p className="line-clamp-2 text-sm font-semibold text-foreground">
                              {item.product.name}
                            </p>
                          )}
                          <p className="mt-0.5 text-sm font-bold tabular-nums text-accent-strong">
                            {formatPrice(item.product.price)} €
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                            <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-card">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label={`Diminuer la quantité de ${item.product.name}`}
                                className={stepBtn}
                              >
                                <MinusIcon />
                              </button>
                              <span
                                className="inline-flex h-9 min-w-[2rem] items-center justify-center px-1 text-sm font-semibold tabular-nums text-foreground"
                                aria-live="polite"
                              >
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label={`Augmenter la quantité de ${item.product.name}`}
                                className={stepBtn}
                              >
                                <PlusIcon />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              aria-label={`Retirer ${item.product.name} du panier`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-xl font-bold tabular-nums text-foreground">
                    {formatPrice(totalPrice)} €
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.01] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Passer la commande
                  <span aria-hidden="true">→</span>
                </Link>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Paiement sécurisé via Stripe
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
