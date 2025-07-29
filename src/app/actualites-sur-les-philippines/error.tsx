'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue !</h2>
      <p className="text-muted-foreground mb-8">
        Nous n'avons pas pu charger cet article. Veuillez réessayer.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold"
      >
        Réessayer
      </button>
    </div>
  );
}
