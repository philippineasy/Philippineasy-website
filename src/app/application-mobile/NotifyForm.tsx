'use client';

import { useState } from 'react';
import { trackNewsletterSignup } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'success' | 'error';

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

/**
 * NotifyForm — app-launch waitlist capture. Reuses the existing /api/newsletter
 * flow (same endpoint as the footer + lead magnet), tagged with a distinct
 * `source: 'app_launch'` so these leads are attributable. Designed to sit inside
 * the white "app window" of AppWindowPanel (bg-card / text-foreground).
 */
export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'app_launch' }),
      });
      const data = await res.json();

      if (res.ok || res.status === 200) {
        setStatus('success');
        setMessage(
          data.message === 'Vous êtes déjà inscrit(e) !'
            ? 'Vous êtes déjà sur la liste — on vous préviendra au lancement.'
            : "C'est noté ! On vous écrit dès que l'app est disponible."
        );
        trackNewsletterSignup({ source: 'app_launch' });
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion. Réessayez dans un instant.');
    }
  };

  if (status === 'success') {
    return (
      <div className="py-2 text-center" role="status" aria-live="polite">
        <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckIcon />
        </span>
        <p className="text-[15px] font-semibold text-foreground">{message}</p>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Merci — à très vite sur Philippin&apos;Easy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="app-notify-email" className="sr-only">
        Votre adresse email
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id="app-notify-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="votre@email.com"
          required
          disabled={status === 'loading'}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-[15px] font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] motion-reduce:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
        >
          {status === 'loading' ? (
            'Envoi…'
          ) : (
            <>
              <BellIcon />
              Me prévenir
            </>
          )}
        </button>
      </div>
      <p
        className={`mt-3 text-[13px] ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}
        role={status === 'error' ? 'alert' : undefined}
        aria-live="polite"
      >
        {status === 'error'
          ? message
          : 'Un seul email, le jour du lancement. Pas de spam, désinscription en un clic.'}
      </p>
    </form>
  );
}
