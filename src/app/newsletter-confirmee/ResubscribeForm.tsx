'use client';

import { useState } from 'react';
import { Loader2, Send, Check } from 'lucide-react';

export default function ResubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'confirm_retry' }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Vérifiez votre boîte mail pour confirmer votre inscription.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion.');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.08)] px-4 py-3 text-[14px] font-medium text-[hsl(var(--success))]">
        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
      <label htmlFor="resubscribe-email" className="sr-only">
        Adresse email
      </label>
      <input
        id="resubscribe-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        disabled={status === 'loading'}
        className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        Recevoir un nouveau lien
      </button>
      {status === 'error' && <p className="text-[13px] text-destructive sm:basis-full">{message}</p>}
    </form>
  );
}
