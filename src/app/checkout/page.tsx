'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useCart } from '@/contexts/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const { cart, totalPrice } = useCart();

  useEffect(() => {
    if (cart.length > 0) {
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
    }
  }, [cart]);

  const appearance: { theme: 'stripe' | 'flat' | 'night' | undefined } = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1
        className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center"
        style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        Finaliser votre <span className="text-accent">commande</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2
            className="text-foreground mb-4 flex items-center gap-2"
            style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}
          >
            Résumé de la commande
          </h2>
          <div
            className="bg-card rounded-2xl p-6"
            style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <ul className="space-y-3 mb-4">
              {cart.map((item) => (
                <li key={item.product.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-foreground truncate"
                      style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.3 }}
                    >
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Quantité : {item.quantity}
                    </p>
                  </div>
                  <span
                    className="text-foreground tabular-nums flex-shrink-0"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 flex items-end justify-between" style={{ borderTop: '0.5px solid #f1f5f9' }}>
              <div>
                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}
                >
                  Total
                </p>
                <p
                  className="text-foreground tabular-nums"
                  style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1 }}
                >
                  {totalPrice.toFixed(2)} €
                </p>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>TTC</p>
            </div>
          </div>
        </div>
        <div>
          <h2
            className="text-foreground mb-4 flex items-center gap-2"
            style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}
          >
            Paiement
          </h2>
          <div
            className="bg-card rounded-2xl p-6"
            style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
