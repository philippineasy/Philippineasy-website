'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { KeyRound, MailCheck, ArrowLeft, Loader2 } from 'lucide-react';

const RESET_REDIRECT_URL = 'https://philippineasy.com/reinitialiser-mot-de-passe';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: RESET_REDIRECT_URL,
    });

    setLoading(false);
    if (error) {
      setError("Impossible d'envoyer l'e-mail pour le moment. Réessayez dans quelques instants.");
      return;
    }
    // Neutral confirmation regardless of whether the account exists (avoids
    // account enumeration).
    setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 md:py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-7 shadow-card sm:p-9">
        {sent ? (
          <div className="text-center">
            <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
              <MailCheck className="h-6 w-6" />
            </span>
            <h1 className="text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
              Vérifiez vos e-mails
            </h1>
            <p className="mx-auto mt-3 max-w-[40ch] text-[14.5px] leading-relaxed text-muted-foreground">
              Si un compte est associé à <strong className="font-semibold text-foreground">{email}</strong>, vous
              recevrez un lien pour réinitialiser votre mot de passe. Pensez à consulter vos spams.
            </p>
            <Link
              href="/connexion"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
              <KeyRound className="h-5 w-5" />
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
              Espace membre
            </span>
            <h1 className="mt-1.5 text-[clamp(1.375rem,3vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
              Mot de passe oublié ?
            </h1>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
              Entrez l&apos;adresse e-mail de votre compte. Nous vous enverrons un lien sécurisé pour définir un
              nouveau mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary"
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>

            <Link
              href="/connexion"
              className="mt-6 inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
