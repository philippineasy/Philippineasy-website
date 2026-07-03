'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Fallback racine (aucun CSS externe chargé ici — Next isole cette route de
 * globals.css tant que le layout parent a lui-même crashé). Styles inline
 * sobres, alignés sur les tokens navy/amber de la charte, message en français.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#F59E0B',
            }}
          >
            Philippin&apos;Easy
          </p>
          <h1
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Une erreur inattendue est survenue
          </h1>
          <p
            style={{
              margin: '0 0 32px',
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'rgba(248, 250, 252, 0.75)',
            }}
          >
            Le site a rencontré un problème technique. L&apos;équipe a été
            automatiquement prévenue. Vous pouvez réessayer ou revenir à
            l&apos;accueil.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F59E0B',
                color: '#1C1917',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Recharger
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                global-error remplace <html>/<body> en entier (root layout
                bypassé) : le contexte du router App Router n'est pas garanti
                ici, next/link n'est pas fiable dans ce fichier spécial. */}
            <a
              href="/"
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                border: '1px solid rgba(248, 250, 252, 0.3)',
                color: '#F8FAFC',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
