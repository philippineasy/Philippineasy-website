'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type Entitlement = {
  feature_type: string;
  status: string;
  expires_at?: string | null;
};

type Props = {
  userId: string;
  entitlements: Entitlement[];
  whatsappNumber?: string | null;
};

const BUSINESS_WHATSAPP =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '+639171234567';

function hasActiveWhatsApp(entitlements: Entitlement[]): boolean {
  return entitlements.some(
    (e) =>
      e.feature_type === 'whatsapp_support' &&
      (e.status === 'available' || e.status === 'in_use') &&
      (!e.expires_at || new Date(e.expires_at) > new Date())
  );
}

function findExpiry(entitlements: Entitlement[]): Date | null {
  const wa = entitlements.find(
    (e) => e.feature_type === 'whatsapp_support' && e.expires_at
  );
  return wa?.expires_at ? new Date(wa.expires_at) : null;
}

function daysUntil(d: Date): number {
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function WhatsAppGate({ userId, entitlements, whatsappNumber }: Props) {
  const [number, setNumber] = useState(whatsappNumber || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!whatsappNumber);
  const [error, setError] = useState<string | null>(null);

  if (!hasActiveWhatsApp(entitlements)) return null;

  const expiry = findExpiry(entitlements);
  const days = expiry ? daysUntil(expiry) : null;

  const save = async () => {
    setError(null);
    const cleaned = number.replace(/[\s.\-()]/g, '');
    if (!/^\+?\d{8,16}$/.test(cleaned)) {
      setError('Numéro invalide. Utilisez le format international (ex: +33612345678).');
      return;
    }
    setSaving(true);
    const { error: upErr } = await supabase
      .from('profiles')
      .update({ whatsapp_number: cleaned })
      .eq('id', userId);
    setSaving(false);
    if (upErr) {
      setError('Échec sauvegarde. Réessayez.');
      return;
    }
    setSaved(true);
  };

  // Case A — number missing → prompt form
  if (!saved) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[15px] font-semibold text-ink mb-0.5">
              Renseignez votre numéro WhatsApp
            </strong>
            <p className="text-[13px] text-muted-foreground leading-snug mb-3">
              Votre support WhatsApp est actif{days !== null ? ` (${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''})` : ''}, mais nous avons besoin de votre numéro pour démarrer la conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={save}
                disabled={saving || !number.trim()}
                className="rounded-lg bg-accent text-ink px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-wait"
              >
                {saving ? 'Sauvegarde…' : 'Enregistrer'}
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-2 text-[12px] text-rose-700">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Case B — number set → show CTA WhatsApp link
  // We open a chat WITH the business number; the user's phone is already saved
  // server-side so admins can also initiate contact toward the customer.
  const businessPhone = BUSINESS_WHATSAPP.replace(/[\s.\-()+]/g, '');
  const text = encodeURIComponent(
    `Bonjour, je suis client Philippineasy (numéro de support actif). Je viens vers vous pour…`
  );

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <div className="min-w-0">
            <strong className="block text-[15px] font-semibold text-ink leading-tight">
              Support WhatsApp actif
            </strong>
            <p className="text-[12.5px] text-muted-foreground leading-snug mt-0.5">
              {days !== null
                ? `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''} · `
                : ''}
              Votre numéro : <code className="font-mono text-foreground">{whatsappNumber || number}</code>
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/${businessPhone}?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-[13px] font-semibold shadow-sm hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Démarrer WhatsApp
        </a>
      </div>
    </div>
  );
}
