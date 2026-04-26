import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import {
  Map as MapIcon, Download, ExternalLink, Sparkles,
  CheckCircle2, AlertCircle, Calendar,
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

const VARIANT_TONE: Record<string, { bg: string; text: string; dot: string }> = {
  relax: { bg: 'bg-sky-500/10', text: 'text-sky-700', dot: 'bg-sky-500' },
  balanced: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  adventure: { bg: 'bg-amber-500/10', text: 'text-amber-700', dot: 'bg-amber-500' },
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
    .select('id, preferences, selected_variant, payment_status, status, created_at')
    .eq('user_id', user.id)
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(3);

  const totalPaid = gens?.length || 0;
  const totalSpent = (gens || []).reduce((s, g: any) => s + Number(g.amount_paid || 0), 0);
  const totalModRemaining = (gens || []).reduce((s, g: any) => s + Number(g.modifications_remaining || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1">
          Mes itinéraires
        </span>
        <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
          Vos voyages <span className="text-accent">sur-mesure</span>
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1.5">
          Tous les itinéraires que vous avez débloqués — téléchargez, faites-vous-les renvoyer ou demandez une modification.
        </p>
      </div>

      {/* KPI strip */}
      {totalPaid > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <KPI label="Itinéraires débloqués" value={totalPaid} icon={<MapIcon className="w-4 h-4" />} accent="bg-primary/10 text-primary" />
          <KPI label="Total dépensé" value={`${totalSpent.toFixed(2)}€`} icon={<Sparkles className="w-4 h-4" />} accent="bg-accent/15 text-accent" />
          <KPI label="Modifications restantes" value={totalModRemaining} icon={<CheckCircle2 className="w-4 h-4" />} accent="bg-emerald-500/10 text-emerald-700" />
        </div>
      )}

      {/* List */}
      {gens && gens.length > 0 ? (
        <div className="space-y-4">
          {gens.map((g: any) => {
            const prefs = g.preferences || {};
            const dur = (prefs.duration as Duration) || '1-week';
            const offer = (g.offer_type as OfferType) || 'express';
            const variantLabel = g.selected_variant ? VARIANT_LABEL[g.selected_variant] || g.selected_variant : null;
            const variantTone = g.selected_variant ? VARIANT_TONE[g.selected_variant] : null;
            const offerInfo = OFFER_LABELS[offer];
            const itineraries = Array.isArray(g.itineraries) ? g.itineraries : [];
            const selectedFull = itineraries.find((it: any) => it.variant === g.selected_variant);
            const days = selectedFull?.full?.days || [];
            const hasMods = (g.modifications_remaining ?? 0) > 0;

            return (
              <article
                key={g.id}
                className="rounded-2xl border border-border/60 bg-card shadow-card-rest overflow-hidden"
              >
                {/* Header strip */}
                <div className="px-5 py-4 border-b border-border/50 flex flex-wrap items-center gap-3 bg-muted/20">
                  {variantLabel && variantTone && (
                    <span className={['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em]', variantTone.bg, variantTone.text].join(' ')}>
                      <span className={['w-1.5 h-1.5 rounded-full', variantTone.dot].join(' ')} />
                      {variantLabel}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    Acheté le {formatDate(g.created_at)}
                  </span>
                  {g.delivered_at && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Livré
                    </span>
                  )}
                  <span className="ml-auto text-[13px] font-bold tabular-nums text-ink">
                    {g.amount_paid ? formatPrice(Number(g.amount_paid)) : ''}
                  </span>
                </div>

                {/* Body */}
                <div className="px-5 py-5 lg:px-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h2 className="text-[18px] font-bold text-ink leading-tight">
                      {selectedFull?.full?.title || selectedFull?.preview?.title || `Voyage ${variantLabel || ''}`}
                    </h2>
                    <span className="text-[12px] text-muted-foreground font-medium">
                      {DURATION_LABELS[dur]} · Formule {offerInfo?.name || offer}
                    </span>
                  </div>

                  {selectedFull?.full?.description && (
                    <p className="text-[13.5px] text-muted-foreground leading-snug mb-4 line-clamp-2">
                      {selectedFull.full.description}
                    </p>
                  )}

                  {/* Days teaser */}
                  {days.length > 0 && (
                    <div className="mb-4">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                        Aperçu du parcours
                      </span>
                      <ul className="space-y-1.5 list-none p-0">
                        {days.slice(0, 4).map((d: any, i: number) => (
                          <li key={i} className="flex items-baseline gap-2 text-[13px] text-foreground/90">
                            <span className="shrink-0 w-12 text-[11px] font-bold uppercase tracking-[0.05em] text-accent tabular-nums">
                              J{d.day}
                            </span>
                            <span className="truncate">
                              <strong className="font-semibold">{d.location || d.title}</strong>
                              {d.title && d.location && <span className="text-muted-foreground"> · {d.title}</span>}
                            </span>
                          </li>
                        ))}
                        {days.length > 4 && (
                          <li className="text-[12px] text-muted-foreground italic pl-14">
                            … et {days.length - 4} jour{days.length - 4 > 1 ? 's' : ''} de plus dans le PDF
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/40">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/itineraire/${g.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent text-ink px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Voir le détail (carte, photos, jours)
                      </Link>
                      <a
                        href={`/api/itinerary/pdf/${g.id}`}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card text-foreground px-4 py-2 text-[13px] font-medium hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                      <ResendItineraryButton generationId={g.id} email={g.delivery_email} />
                      {hasMods && (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 bg-muted/40 text-muted-foreground px-4 py-2 text-[12px] font-medium cursor-not-allowed"
                          title="Modifications via le support — bientôt accessible en self-service"
                        >
                          {g.modifications_remaining} modification{g.modifications_remaining > 1 ? 's' : ''} restante{g.modifications_remaining > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
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
      {pendingGens && pendingGens.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="shrink-0 w-5 h-5 text-amber-700 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <strong className="block text-[14px] font-semibold text-ink mb-0.5">
                {pendingGens.length} génération{pendingGens.length > 1 ? 's' : ''} en attente de paiement
              </strong>
              <p className="text-[12.5px] text-muted-foreground leading-snug mb-2">
                Vous avez généré {pendingGens.length} itinéraire{pendingGens.length > 1 ? 's' : ''} sans le débloquer. Reprenez où vous en étiez.
              </p>
              <Link
                href="/itineraire-personnalise-pour-les-philippines"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                Reprendre <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({
  label, value, icon, accent,
}: {
  label: string; value: React.ReactNode; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest px-4 py-3">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
        <span className={['shrink-0 w-7 h-7 rounded-lg flex items-center justify-center', accent].join(' ')} aria-hidden="true">
          {icon}
        </span>
      </div>
      <span className="block text-[20px] font-bold tabular-nums text-ink leading-tight">{value}</span>
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
        className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform"
      >
        ✨ Créer mon itinéraire
      </Link>
    </div>
  );
}

