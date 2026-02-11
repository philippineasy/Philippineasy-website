'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faLock } from '@fortawesome/free-solid-svg-icons';
import { SERVICE_CHECKOUT_MAP } from '@/config/services-pricing';
import type { ServiceType } from '@/types/services';
import { FEATURE_DISPLAY } from '@/types/services';
import { PACK_ENTITLEMENTS } from '@/types/services';

export default function ServiceCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceType = searchParams.get('type') as ServiceType | null;

  if (!serviceType || !(serviceType in SERVICE_CHECKOUT_MAP)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service introuvable</h1>
          <Link href="/services" className="text-primary hover:underline">
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  const config = SERVICE_CHECKOUT_MAP[serviceType];
  const entitlements = PACK_ENTITLEMENTS[serviceType] || [];

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/services/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_type: serviceType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Retour aux services
        </Link>

        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <h1 className="text-2xl font-bold mb-2">Récapitulatif de votre commande</h1>
          <p className="text-muted-foreground mb-8">
            Vérifiez les détails avant de procéder au paiement
          </p>

          <div className="border-b border-border pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{config.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Paiement {config.mode === 'subscription' ? 'récurrent' : 'unique'}
                </p>
              </div>
              <p className="text-2xl font-bold text-primary">
                {(config.amount / 100).toFixed(config.amount % 100 === 0 ? 0 : 2)}€
              </p>
            </div>
          </div>

          {entitlements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase mb-3">
                Ce qui est inclus
              </h3>
              <ul className="space-y-2">
                {entitlements.map((e) => {
                  const display = FEATURE_DISPLAY[e.feature_type];
                  return (
                    <li key={e.feature_type} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                        ✓
                      </span>
                      <span>{display.label}</span>
                      {e.total_quantity && (
                        <span className="text-muted-foreground">
                          × {e.total_quantity}
                        </span>
                      )}
                      {e.duration_days && (
                        <span className="text-muted-foreground">
                          ({e.duration_days}j)
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Redirection vers Stripe...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} />
                Payer {(config.amount / 100).toFixed(config.amount % 100 === 0 ? 0 : 2)}€
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Paiement sécurisé par Stripe. L&apos;activation peut prendre quelques minutes après le paiement.
          </p>
        </div>
      </div>
    </div>
  );
}
