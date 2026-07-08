import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import {
  Map as MapIcon, Download, ExternalLink,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import { ResendItineraryButton } from './ResendItineraryButton';
import {
  DURATION_LABELS, OFFER_LABELS, formatPrice,
  type Duration, type OfferType,
} from '@/config/itinerary-pricing';

export const dynamic = 'force-dynamic';

const VARIANT_LABEL: Record<string, string> = {
  relax: 'Relax',
  balanced: 'Équilibré',
  adventure: 'Aventure',
};

// Tonal pastel pills, declined for dark mode.
// balanced ≈ emerald-100/emerald-800 · adventure ≈ amber-100/amber-800.
const VARIANT_TONE: Record<string, string> = {
  relax: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300',
  balanced: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  adventure: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function MonEspaceItinerairesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/mon-espace/itineraires');

  // All paid itineraries by this user (capped to prevent loading too much JSONB)
  const { data: gens } = await supabase
    .from('itinerary_generations')
    .select('id, preferences, selected_variant, amount_paid, payment_status, delivery_email, delivered_at, status, created_at, offer_type, modifications_remaining, itineraries')
    .eq('user_id', user.id)
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: pendingGens } = await supabase
    .from('itinerary_generations')
    .select('id, preferences, selected_variant, offer_type, payment_status, status, created_at')
    .eq('user_id', user.id)
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(3);

  const totalPaid = gens?.length || 0;
  const totalSpent = (gens || []).reduce((s, g: any) => s + Number(g.amount_paid || 0), 0);
  const totalModRemaining = (gens || []).reduce((s, g: any) => s + Number(g.modifications_remaining || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header + breadcrumb */}
      <div className="space-y-4">
        <nav aria-label="Fil d'ariane" className="text-[12px] uppercase tracking-[0.12em]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li>
              <Link
                href="/mon-espace"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                Mon espace
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">
                Itinéraires
              </span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
            Vos voyages <span className="text-accent-strong">sur-mesure</span>
          </h1>
          <p className="text-[14.5px] text-muted-foreground mt-2 max-w-[62ch]">
            Tous les itinéraires que vous avez débloqués — téléchargez, faites-vous-les renvoyer ou demandez une modification.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      {totalPaid > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <KPI label="Itinéraires débloqués" value={totalPaid} />
          <KPI label="Total dépensé" value={formatPrice(totalSpent)} />
          <KPI label="Modifications restantes" value={totalModRemaining} />
        </div>
      )}

      {/* List */}
      {gens && gens.length > 0 ? (
        <div className="space-y-[18px]">
          {gens.map((g: any) => {
            const prefs = g.preferences || {};
            const dur = (prefs.duration as Duration) || '1-week';
            const offer = (g.offer_type as OfferType) || 'express';
            const variantLabel = g.selected_variant ? VARIANT_LABEL[g.selected_variant] || g.selected_variant : null;
            const variantTone = g.selected_variant ? VARIANT_TONE[g.selected_variant] : null;
            const offerInfo = OFFER_LABELS[offer];
            const itineraries = Array.isArray(g.itineraries) ? g.itineraries : [];
            const selectedFull = itineraries.find((it: any) => it.variant === g.selected_variant);
            const hasMods = (g.modifications_remaining ?? 0) > 0;

            return (
              <article
                key={g.id}
                className="rounded-2xl border border-border/60 bg-card shadow-card-rest overflow-hidden"
              >
                {/* Header strip */}
                <div className="px-[22px] py-3.5 border-b border-border/50 flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-muted/40">
                  {variantLabel && variantTone && (
                    <span className={['inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.06em]', variantTone].join(' ')}>
                      {variantLabel}
                    </span>
                  )}
                  <span className="text-[12.5px] text-muted-foreground">
                    Acheté le {formatDate(g.created_at)}
                  </span>
                  {g.delivered_at && (
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Livré
                    </span>
                  )}
                  <span className="ml-auto text-[14px] font-bold tabular-nums text-ink">
                    {g.amount_paid ? formatPrice(Number(g.amount_paid)) : ''}
                  </span>
                </div>

                {/* Body */}
                <div className="p-[22px]">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
                    <h2 className="text-[18px] font-bold text-ink leading-tight">
                      {selectedFull?.full?.title || selectedFull?.preview?.title || `Voyage ${variantLabel || ''}`}
                    </h2>
                    <span className="shrink-0 text-[12.5px] text-muted-foreground font-medium">
                      {DURATION_LABELS[dur]} · Formule {offerInfo?.name || offer}
                    </span>
                  </div>

                  {(selectedFull?.full?.description || selectedFull?.preview?.description) && (
                    <p className="text-[14px] text-muted-foreground leading-[1.6] line-clamp-3">
                      {selectedFull?.full?.description || selectedFull?.preview?.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/itineraire/${g.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        Voir le détail
                      </Link>
                      {/* PDF = feature Premium+ : la route renvoie 403 pour Express */}
                      {offer !== 'express' && (
                        <a
                          href={`/api/itinerary/pdf/${g.id}`}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card text-foreground px-4 py-2 text-[13px] font-medium hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          Télécharger le PDF
                        </a>
                      )}
                      <ResendItineraryButton generationId={g.id} email={g.delivery_email} />
                      {hasMods && (
                        <Link
                          href={`/mon-espace/itineraires/${g.id}/modifier`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground px-4 py-2 text-[12.5px] font-medium hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                          {g.modifications_remaining} modification{g.modifications_remaining > 1 ? 's' : ''} restante{g.modifications_remaining > 1 ? 's' : ''}
                        </Link>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground/80">
                      ID #{g.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyPaidState pendingCount={pendingGens?.length || 0} />
      )}

      {/* Pending (générés non payés) */}
      {pendingGens && pendingGens.length > 0 && (() => {
        // On reprend la generation la plus recente. Pour declencher resumePayment
        // dans la landing page on a besoin de id + offer + variant. Defaults
        // utilises si la generation n'a pas atteint l'etape "Pay" (express + balanced
        // sont les choix les plus universels).
        const latest = pendingGens[0] as {
          id: string;
          offer_type: string | null;
          selected_variant: string | null;
        };
        const resumeUrl = `/itineraire-personnalise-pour-les-philippines?resume_payment=${latest.id}&offer=${latest.offer_type || 'express'}&variant=${latest.selected_variant || 'balanced'}`;

        return (
          <div className="rounded-2xl border border-amber-300/70 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="shrink-0 w-5 h-5 text-accent-strong mt-0.5" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <strong className="block text-[14px] font-semibold text-ink mb-1">
                  {pendingGens.length} génération{pendingGens.length > 1 ? 's' : ''} en attente de paiement
                </strong>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-2.5">
                  Vous avez généré {pendingGens.length} itinéraire{pendingGens.length > 1 ? 's' : ''} sans le débloquer. Reprenez où vous en étiez.
                </p>
                <Link
                  href={resumeUrl}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-strong transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                >
                  Reprendre <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest px-5 py-[18px]">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {label}
      </span>
      <span className="block text-[24px] font-bold tabular-nums text-ink leading-none">
        {value}
      </span>
    </div>
  );
}

function EmptyPaidState({ pendingCount }: { pendingCount: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 lg:p-12 text-center">
      <span className="inline-flex w-14 h-14 rounded-full bg-primary/10 text-primary items-center justify-center mb-4" aria-hidden="true">
        <MapIcon className="w-6 h-6" />
      </span>
      <strong className="block text-[18px] font-bold text-ink mb-1">
        Aucun itinéraire débloqué
      </strong>
      <p className="text-[13.5px] text-muted-foreground leading-snug max-w-[42ch] mx-auto mb-5">
        {pendingCount > 0
          ? `Vous avez ${pendingCount} génération${pendingCount > 1 ? 's' : ''} en attente. Débloquez-en une pour la voir apparaître ici.`
          : `Créez votre premier itinéraire IA en 30 secondes — 3 propositions personnalisées générées sur mesure.`}
      </p>
      <Link
        href="/itineraire-personnalise-pour-les-philippines"
        className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform"
      >
        ✨ Créer mon itinéraire
      </Link>
    </div>
  );
}
