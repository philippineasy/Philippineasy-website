import type { Metadata } from 'next';
import Link from 'next/link';
import { TriangleAlert, ArrowLeft, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Erreur de connexion',
  robots: { index: false, follow: false },
};

export default function AuthCodeError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 md:py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-7 text-center shadow-card sm:p-9">
        <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive" aria-hidden="true">
          <TriangleAlert className="h-6 w-6" />
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
          Espace membre
        </span>
        <h1 className="mt-1.5 text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
          Connexion impossible
        </h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-[14.5px] leading-relaxed text-muted-foreground">
          Nous n&apos;avons pas pu vous connecter. Le lien a peut-être expiré ou déjà été utilisé. Vous pouvez
          réessayer de vous connecter.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour à la connexion
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
