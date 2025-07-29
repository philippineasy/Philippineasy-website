'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

export const Cart = () => {
  const { cart, itemCount, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative text-foreground hover:text-primary">
        <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Votre Panier</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl hover:text-destructive">&times;</button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground mt-8">Votre panier est vide.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.product.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image src={item.product.image_urls?.[0] || 'https://via.placeholder.com/150'} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-primary">{item.product.price.toFixed(2)} €</p>
                        <div className="flex items-center mt-1">
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                            className="w-16 text-center border rounded-md"
                            min="1"
                          />
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="w-full block text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
                  Passer la commande
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
