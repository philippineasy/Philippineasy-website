import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Map as MapIcon, MessagesSquare } from 'lucide-react';
import { ModificationRequestForm } from './ModificationRequestForm';

export const dynamic = 'force-dynamic';

export default async function ModifierItinerairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?redirect=/mon-espace/itineraires/${id}/modifier`);

  const { data: gen } = await supabase
    .from('itinerary_generations')
    .select('id, user_id, preferences, selected_variant, offer_type, modifications_remaining, payment_status, itineraries')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!gen) notFound();

  const remaining = Number(gen.modifications_remaining ?? 0);
  const hasRemaining = remaining > 0;
  const itineraries = Array.isArray(gen.itineraries) ? gen.itineraries : [];
  const selectedFull = itineraries.find((it: any) => it.variant === gen.selected_variant);
  const title = selectedFull?.full?.title || selectedFull?.preview?.title || `Itinéraire #${id.slice(0, 8)}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/mon-espace/itineraires"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground font-medium mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mes itinéraires
        </Link>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1">
          Demande de modification
        </span>
        <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
          Modifier votre <span className="text-accent">itinéraire</span>
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">{title}</p>
      </div>

      {/* Status card */}
      {hasRemaining ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4 flex items-start gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center" aria-hidden="true">
            <MapIcon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <strong className="block text-[14.5px] text-ink mb-0.5 font-semibold">
              {remaining} modification{remaining > 1 ? 's' : ''} incluse{remaining > 1 ? 's' : ''} dans votre forfait
            </strong>
            <p className="text-[13px] text-muted-foreground leading-snug">
              Décrivez précisément ce que vous souhaitez changer. Notre équipe traite votre demande sous 24 h ouvrées et vous renvoie l'itinéraire mis à jour par email.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex items-start gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center" aria-hidden="true">
            <MessagesSquare className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <strong className="block text-[14.5px] text-ink mb-0.5 font-semibold">
              Aucune modification incluse dans votre forfait
            </strong>
            <p className="text-[13px] text-muted-foreground leading-snug">
              Vous pouvez tout de même soumettre une demande — nous vous proposerons un devis personnalisé avant traitement.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <ModificationRequestForm
        generationId={gen.id}
        userId={user.id}
        modificationsRemaining={remaining}
      />
    </div>
  );
}
