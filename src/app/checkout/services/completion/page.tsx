'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ServiceCompletionPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Give webhook time to process, then show success
    const timer = setTimeout(() => {
      setStatus(sessionId ? 'success' : 'error');
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Session introuvable</h1>
          <p className="text-muted-foreground mb-6">
            Nous n&apos;avons pas pu vérifier votre paiement. Si vous avez été débité, contactez-nous.
          </p>
          <Link href="/services" className="text-primary hover:underline">
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-lg">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Merci pour votre achat !</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Vos services sont en cours d&apos;activation. Rendez-vous dans <strong>Mon Espace</strong> pour suivre
          l&apos;avancement et accéder à vos services.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/mon-espace"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Mon Espace <FontAwesomeIcon icon={faArrowRight} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            Voir d&apos;autres services
          </Link>
        </div>
      </div>
    </div>
  );
}
