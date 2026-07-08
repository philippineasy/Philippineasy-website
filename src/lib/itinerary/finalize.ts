// ---------------------------------------------------------------------------
// Finalisation post-paiement : génère l'itinéraire COMPLET du variant acheté
// à partir de sa preview (contrat), vérifie la cohérence preview ↔ full
// (checks déterministes + juge LLM, 1 relance corrective), enrichit via
// Google Places puis livre (DB + email).
//
// Appelé par : le webhook Stripe (after()), POST /api/itinerary/finalize
// (fallback page completion), et le cron recover-itineraries (filet).
// Idempotent : claim atomique via finalize_status.
// ---------------------------------------------------------------------------
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendItineraryReadyEmail } from '@/emails/senders/itinerary';
import { getUserEmail } from '@/emails/send';
import { contextFromStoredPreferences } from './context';
import { callOpenAIJson } from './openai';
import {
  CONSISTENCY_SYSTEM,
  FULL_SYSTEM,
  buildConsistencyUserPrompt,
  buildFixInstruction,
  buildFullUserPrompt,
} from './prompts';
import { parseFullResponse, runHardChecks } from './normalize';
import { enrichDays } from './places';
import type { ConsistencyVerdict, ItineraryFull, ItineraryVariant, VariantName } from './types';

export interface FinalizeResult {
  status: 'ready' | 'generating' | 'failed' | 'not_found' | 'not_paid';
  error?: string;
}

// Un claim "generating" plus vieux que ça est considéré mort (fonction tuée,
// crash) et peut être repris.
const STALE_CLAIM_MINUTES = 15;

type Admin = ReturnType<typeof createServiceRoleClient>;

interface GenerationRow {
  id: string;
  user_id: string | null;
  delivery_email: string | null;
  selected_variant: string | null;
  offer_type: string | null;
  delivered_at: string | null;
  preferences: Record<string, unknown> | null;
  itineraries: unknown;
  delivered_itinerary: unknown;
}

async function markFailed(admin: Admin, id: string, message: string): Promise<FinalizeResult> {
  await admin
    .from('itinerary_generations')
    .update({ finalize_status: 'failed', finalize_error: message.slice(0, 800), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('finalize_status', 'generating');
  return { status: 'failed', error: message };
}

/** Génère + vérifie le full. 2 tentatives max (la 2e nourrie des divergences). */
async function generateVerifiedFull(
  generationId: string,
  storedPreferences: Record<string, unknown>,
  variant: ItineraryVariant,
): Promise<{ full: ItineraryFull; warning?: string }> {
  const ctx = contextFromStoredPreferences(storedPreferences);
  const basePrompt = buildFullUserPrompt(ctx, variant.variant, variant.preview);

  let prompt = basePrompt;
  let lastIssues: string[] = [];
  let candidate: ItineraryFull | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const { data, finishReason } = await callOpenAIJson<unknown>({
      system: FULL_SYSTEM,
      user: prompt,
      temperature: 0.25,
      maxTokens: 32000,
      timeoutMs: 240_000,
    });
    if (finishReason === 'length') {
      // Sortie tronquée : JSON invalide 99% du temps, parseFullResponse throw.
      console.error(`[finalize] ${generationId} output truncated (attempt ${attempt})`);
    }

    const full = parseFullResponse(data);
    const hard = runHardChecks(full, variant.preview, ctx.numberOfDays);
    candidate = hard.fixed;

    let issues = [...hard.issues];

    // Juge LLM uniquement si les checks durs passent (sinon on connaît déjà
    // les problèmes bloquants, inutile de payer un appel de plus).
    if (hard.ok) {
      try {
        const verdict = await callOpenAIJson<ConsistencyVerdict>({
          system: CONSISTENCY_SYSTEM,
          user: buildConsistencyUserPrompt(variant.preview, hard.fixed),
          model: 'gpt-4.1-mini',
          temperature: 0,
          maxTokens: 1000,
          timeoutMs: 60_000,
        });
        if (!verdict.data.consistent && Array.isArray(verdict.data.issues) && verdict.data.issues.length > 0) {
          issues = verdict.data.issues;
        } else {
          return { full: hard.fixed };
        }
      } catch (judgeErr) {
        // Juge indisponible : les checks durs ont passé, on livre.
        console.error(`[finalize] ${generationId} consistency judge unavailable:`, judgeErr);
        return { full: hard.fixed };
      }
    }

    lastIssues = issues;
    if (attempt === 1) {
      console.warn(`[finalize] ${generationId} attempt 1 rejected: ${issues.join(' | ')}`);
      prompt = basePrompt + buildFixInstruction(issues);
    }
  }

  // Après 2 tentatives : un mauvais nombre de jours est indéfendable (le
  // client a payé N jours) → échec. Les divergences résiduelles plus douces
  // sont livrées avec les corrections déterministes + warning tracé.
  const dayCountIssue = lastIssues.find((i) => i.includes('Nombre de jours'));
  if (dayCountIssue || !candidate) {
    throw new Error(`Cohérence impossible après 2 tentatives: ${lastIssues.join(' | ')}`);
  }
  return { full: candidate, warning: `Livré avec divergences mineures: ${lastIssues.join(' | ')}` };
}

/**
 * Point d'entrée unique de la finalisation. Sûr à appeler plusieurs fois :
 * seul le détenteur du claim génère, les autres reçoivent l'état courant.
 */
export async function runFinalize(generationId: string): Promise<FinalizeResult> {
  const admin = createServiceRoleClient();

  // ── Claim atomique ─────────────────────────────────────────────────────────
  // 3 tentatives conditionnelles séquentielles plutôt qu'un .or() : PostgREST
  // rejette les filtres or() sur UPDATE (42703 "column does not exist").
  // Chaque UPDATE conditionnel reste atomique : sur deux appels concurrents,
  // un seul matche la condition, l'autre reçoit 0 rows.
  const staleCutoff = new Date(Date.now() - STALE_CLAIM_MINUTES * 60_000).toISOString();
  const claimUpdate = () => admin
    .from('itinerary_generations')
    .update({
      finalize_status: 'generating',
      finalize_started_at: new Date().toISOString(),
      finalize_error: null,
    })
    .eq('id', generationId)
    .eq('payment_status', 'completed');

  let claimed: GenerationRow[] | null = null;
  const conditions = [
    (q: ReturnType<typeof claimUpdate>) => q.is('finalize_status', null),
    (q: ReturnType<typeof claimUpdate>) => q.eq('finalize_status', 'failed'),
    (q: ReturnType<typeof claimUpdate>) =>
      q.eq('finalize_status', 'generating').lt('finalize_started_at', staleCutoff),
  ];
  for (const applyCondition of conditions) {
    const { data, error } = await applyCondition(claimUpdate()).select('*');
    if (error) {
      console.error(`[finalize] claim error for ${generationId}:`, error);
      return { status: 'failed', error: 'Erreur DB au claim' };
    }
    if (data && data.length > 0) {
      claimed = data;
      break;
    }
  }

  if (!claimed || claimed.length === 0) {
    // Pas de claim : soit déjà ready/en cours, soit non payé/inexistant.
    const { data: current } = await admin
      .from('itinerary_generations')
      .select('finalize_status, payment_status')
      .eq('id', generationId)
      .single();
    if (!current) return { status: 'not_found' };
    if (current.payment_status !== 'completed') return { status: 'not_paid' };
    if (current.finalize_status === 'ready') return { status: 'ready' };
    if (current.finalize_status === 'generating') return { status: 'generating' };
    return { status: 'failed', error: 'État inattendu' };
  }

  const gen = claimed[0];

  try {
    // ── Court-circuit : contenu déjà présent (rows legacy / re-run) ──────────
    const delivered = typeof gen.delivered_itinerary === 'string'
      ? JSON.parse(gen.delivered_itinerary)
      : gen.delivered_itinerary;
    if (delivered?.days?.length > 0) {
      await admin
        .from('itinerary_generations')
        .update({ finalize_status: 'ready', finalized_at: new Date().toISOString() })
        .eq('id', generationId);
      return { status: 'ready' };
    }

    const variants: ItineraryVariant[] = (
      typeof gen.itineraries === 'string' ? JSON.parse(gen.itineraries) : gen.itineraries
    ) || [];
    const selectedName = (gen.selected_variant || 'balanced') as VariantName;
    const variant = variants.find((v) => v.variant === selectedName) || variants[0];
    if (!variant) {
      return await markFailed(admin, generationId, 'Aucun variant en base');
    }

    // ── Génération (ou réutilisation legacy) ─────────────────────────────────
    let full: ItineraryFull;
    let warning: string | undefined;
    if (variant.full?.days && variant.full.days.length > 0) {
      // Row legacy pré-previews-first : le full existe déjà.
      full = variant.full;
    } else {
      const generatedResult = await generateVerifiedFull(
        generationId,
        gen.preferences || {},
        variant,
      );
      full = generatedResult.full;
      warning = generatedResult.warning;
    }

    // ── Enrichissement Places (coordonnées, notes, liens) ────────────────────
    try {
      await enrichDays(full.days, 60);
    } catch (enrichErr) {
      // Non bloquant : l'itinéraire sans coordonnées reste livrable.
      console.error(`[finalize] ${generationId} places enrichment failed:`, enrichErr);
    }

    // ── Persistance ──────────────────────────────────────────────────────────
    // delivered_itinerary : format consommé par /api/itinerary/[id] et le PDF.
    const deliveredItinerary = {
      name: selectedName,
      title: full.title,
      description: full.description,
      days: full.days,
      tips: full.tips,
      total_budget: full.total_budget?.total || variant.preview.budget_estimate || 'N/A',
    };
    // On réinjecte aussi le full dans itineraries[] pour les lecteurs legacy
    // (deliver Telegram, email destinations).
    const updatedVariants = variants.map((v) =>
      v.variant === variant.variant ? { ...v, full } : v,
    );

    const now = new Date().toISOString();
    const { error: persistError } = await admin
      .from('itinerary_generations')
      .update({
        delivered_itinerary: deliveredItinerary,
        itineraries: updatedVariants,
        status: 'delivered',
        delivered_at: gen.delivered_at || now,
        finalize_status: 'ready',
        finalized_at: now,
        finalize_error: warning || null,
        updated_at: now,
      })
      .eq('id', generationId);

    if (persistError) {
      console.error(`[finalize] persist error for ${generationId}:`, persistError);
      return await markFailed(admin, generationId, 'Erreur DB à la persistance');
    }

    // ── Email "Itinéraire prêt" (une seule fois : on détient le claim) ───────
    try {
      let to = gen.delivery_email as string | null;
      let userName: string | undefined;
      if (gen.user_id) {
        const user = await getUserEmail(gen.user_id);
        if (user) {
          to = to || user.email;
          userName = user.name;
        }
      }
      if (to) {
        // Destination principale dédupliquée : "El Nido (Corong-Corong)" et
        // "El Nido (Nacpan)" ne doivent donner qu'un seul "El Nido" dans le
        // sujet de l'email.
        const destinations = [...new Set(
          full.days
            .map((d) => (d.location || '').split('(')[0].split('/')[0].trim())
            .filter(Boolean),
        )].join(', ') || 'Philippines';
        await sendItineraryReadyEmail({
          to,
          userName,
          itineraryTitle: full.title,
          destination: destinations,
          days: full.days.length,
          variant: selectedName,
          generationId,
          offerType: (gen.offer_type as 'express' | 'premium' | 'conciergerie') || 'premium',
        });
      } else {
        console.error(`[finalize] ${generationId} ready but no email to notify`);
      }
    } catch (emailErr) {
      // L'itinéraire est livré en DB — l'email raté ne doit pas marquer failed.
      console.error(`[finalize] ${generationId} ready email failed:`, emailErr);
    }

    return { status: 'ready' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error(`[finalize] ${generationId} failed:`, err);
    return await markFailed(admin, generationId, message);
  }
}
