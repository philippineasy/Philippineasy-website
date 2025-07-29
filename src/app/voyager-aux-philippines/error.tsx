'use client'; // Les composants d'erreur doivent être des composants clients

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur sur un service de reporting d'erreurs
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue !</h2>
      <p className="text-muted-foreground mb-8">
        Nous n'avons pas pu charger les informations. Veuillez réessayer.
      </p>
      <button
        onClick={
          // Tente de se rétablir en essayant de rendre à nouveau le segment
          () => reset()
        }
        className="px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold"
      >
        Réessayer
      </button>
    </div>
  );
}
