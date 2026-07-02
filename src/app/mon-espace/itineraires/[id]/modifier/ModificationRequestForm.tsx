'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

type Props = {
  generationId: string;
  userId: string;
  modificationsRemaining: number;
};

const SCOPE_OPTIONS = [
  { key: 'simple', label: 'Simple', desc: 'Changer 1 hôtel, 1 activité, 1 jour.' },
  { key: 'moyenne', label: 'Moyenne', desc: 'Modifier 2-3 jours, ajouter une étape.' },
  { key: 'majeure', label: 'Majeure', desc: 'Repenser plusieurs jours ou la destination.' },
] as const;

type Scope = typeof SCOPE_OPTIONS[number]['key'];

export function ModificationRequestForm({ generationId, userId, modificationsRemaining }: Props) {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>('simple');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 30) {
      setError('Décrivez votre demande en au moins 30 caractères.');
      return;
    }
    setError(null);
    setSubmitting(true);

    // Open / append to a CRM conversation tagged with this itinerary
    // NOTE: crm_conversations.related_purchase_id is FK → service_purchases(id),
    // not itinerary_generations. We track the itinerary id in the subject only
    // (which contains the short id #abcdef12) to avoid FK violation.
    const shortId = generationId.slice(0, 8);
    const subject = `Modification itinéraire #${shortId} (${scope})`;
    let convoId: string | null = null;

    // Reuse an existing conversation if one already covers this itinerary
    // (matches by subject prefix — admins see all related msgs threaded).
    const { data: existing } = await supabase
      .from('crm_conversations')
      .select('id')
      .eq('customer_id', userId)
      .ilike('subject', `Modification itinéraire #${shortId}%`)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      convoId = existing.id;
    } else {
      const { data: created, error: convoErr } = await supabase
        .from('crm_conversations')
        .insert({
          customer_id: userId,
          subject,
          status: 'open',
        })
        .select('id')
        .single();
      if (convoErr || !created) {
        setError("Impossible d'ouvrir la conversation. Réessayez.");
        setSubmitting(false);
        return;
      }
      convoId = created.id;
    }

    const messageContent = [
      `Demande de modification (scope ${scope})`,
      `Itinéraire #${generationId}`,
      modificationsRemaining > 0
        ? `Modifications restantes : ${modificationsRemaining}`
        : `Hors forfait — devis préalable demandé.`,
      '',
      description.trim(),
    ].join('\n');

    const { error: msgErr } = await supabase.from('crm_messages').insert({
      conversation_id: convoId,
      from_user_id: userId,
      content: messageContent,
      is_admin_message: false,
      is_read: false,
    });

    if (msgErr) {
      setError("Impossible d'envoyer le message. Réessayez.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => router.push('/mon-espace/messages'), 1800);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.05)] px-6 py-8 text-center">
        <CheckCircle2 className="w-10 h-10 mx-auto text-[hsl(var(--success))] mb-3" aria-hidden="true" />
        <strong className="block text-[16px] font-bold text-ink mb-1">
          Demande envoyée
        </strong>
        <p className="text-[13.5px] text-muted-foreground leading-snug max-w-[42ch] mx-auto mb-4">
          Notre équipe vous répondra sous 24 h ouvrées via la messagerie de votre espace.
        </p>
        <Link
          href="/mon-espace/messages"
          className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 transition-transform"
        >
          Aller aux messages →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Scope selector */}
      <div>
        <span className="block text-[14px] font-medium text-foreground mb-2">
          Ampleur de la modification
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SCOPE_OPTIONS.map((s) => {
            const selected = scope === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setScope(s.key)}
                aria-pressed={selected}
                className={[
                  'rounded-xl border px-4 py-3 text-left transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  selected
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-border bg-card hover:border-accent/40',
                ].join(' ')}
              >
                <strong className={['block text-[14px] font-semibold mb-0.5', selected ? 'text-accent' : 'text-ink'].join(' ')}>
                  {s.label}
                </strong>
                <span className="block text-[12px] text-muted-foreground leading-snug">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="modif-description" className="block text-[14px] font-medium text-foreground mb-2">
          Décrivez ce que vous souhaitez changer <span className="text-destructive">*</span>
        </label>
        <textarea
          id="modif-description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 1500))}
          rows={6}
          placeholder="Ex : Remplacer la nuit du jour 4 à Coron par une nuit à El Nido, ajouter 1 jour à Bohol entre J6 et J7, supprimer Manille en fin de séjour…"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[14px] leading-[1.5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60 resize-none"
        />
        <span className="block text-right text-[11px] text-muted-foreground mt-1">
          {description.length}/1500
        </span>
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <Link
          href="/mon-espace/itineraires"
          className="text-[13px] text-muted-foreground hover:text-foreground font-medium px-3 py-2"
        >
          ← Annuler
        </Link>
        <button
          type="submit"
          disabled={submitting || description.trim().length < 30}
          className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {submitting ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Envoi…</>
          ) : (
            <><Send className="w-3.5 h-3.5" /> Envoyer la demande</>
          )}
        </button>
      </div>
    </form>
  );
}
