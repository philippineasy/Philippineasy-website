'use client';

import { useRef, useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';

type Props = {
  generationId: string;
  email: string | null;
};

export function ResendItineraryButton({ generationId, email }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Synchronous double-click guard (setSubmitting is async).
  const inflight = useRef(false);

  const handleClick = async () => {
    if (inflight.current || submitting) return;
    inflight.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/itinerary/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: generationId,
          delivery_email: true,
          email: email || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Erreur ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec envoi');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSubmitting(false);
      inflight.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={submitting}
      title={email ? `Renvoyer à ${email}` : 'Renvoyer par email'}
      aria-label={email ? `Renvoyer l'itinéraire à ${email}` : 'Renvoyer l\'itinéraire par email'}
      aria-live="polite"
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        success
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
          : error
          ? 'border-rose-500/40 bg-rose-500/10 text-rose-700'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:text-primary',
        submitting ? 'opacity-60 cursor-wait' : '',
      ].join(' ')}
    >
      {submitting ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Envoi…</>
      ) : success ? (
        <><Check className="w-3.5 h-3.5" /> Envoyé</>
      ) : error ? (
        <>{error}</>
      ) : (
        <><Mail className="w-3.5 h-3.5" /> Renvoyer par email</>
      )}
    </button>
  );
}
