// ---------------------------------------------------------------------------
// Normalisation des sorties GPT + vérifications de cohérence déterministes.
// Porté du parser n8n (meals string→objet, variants synonymes) et durci :
// le pipeline previews-first exige un contrat strict entre preview et full.
// ---------------------------------------------------------------------------
import type {
  ItineraryDay,
  ItineraryFull,
  ItineraryMeal,
  ItineraryPreview,
  ItineraryVariant,
  VariantName,
} from './types';

const VARIANT_SYNONYMS: Record<string, VariantName> = {
  relax: 'relax', détente: 'relax', detente: 'relax', zen: 'relax',
  balanced: 'balanced', équilibré: 'balanced', equilibre: 'balanced', mix: 'balanced',
  adventure: 'adventure', aventure: 'adventure', sportif: 'adventure',
};

export class GenerationParseError extends Error {}

function normalizeMeal(meal: unknown): ItineraryMeal | undefined {
  if (!meal) return undefined;
  if (typeof meal === 'string') return { restaurant: meal };
  if (typeof meal === 'object') {
    const m = meal as Record<string, unknown>;
    return {
      restaurant: typeof m.restaurant === 'string' ? m.restaurant : typeof m.name === 'string' ? m.name : undefined,
      dish: typeof m.dish === 'string' ? m.dish : undefined,
      cost: typeof m.cost === 'string' ? m.cost : undefined,
    };
  }
  return undefined;
}

export function normalizeDay(raw: unknown, fallbackDayNumber: number): ItineraryDay {
  const d = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const meals = (d.meals && typeof d.meals === 'object' ? d.meals : {}) as Record<string, unknown>;
  const acc = d.accommodation;
  const transport = d.transport;

  return {
    day: typeof d.day === 'number' ? d.day : fallbackDayNumber,
    title: typeof d.title === 'string' ? d.title : `Jour ${fallbackDayNumber}`,
    location: typeof d.location === 'string' ? d.location : undefined,
    transport: transport && typeof transport === 'object' ? transport as ItineraryDay['transport'] : undefined,
    activities: Array.isArray(d.activities)
      ? d.activities
        .map((a) => {
          if (typeof a === 'string') return { name: a };
          if (a && typeof a === 'object') {
            const act = a as Record<string, unknown>;
            if (typeof act.name !== 'string' || !act.name) return null;
            return {
              time: typeof act.time === 'string' ? act.time : undefined,
              name: act.name,
              description: typeof act.description === 'string' ? act.description : undefined,
              cost: typeof act.cost === 'string' ? act.cost : undefined,
            };
          }
          return null;
        })
        .filter((a): a is NonNullable<typeof a> => a !== null)
      : [],
    meals: {
      breakfast: normalizeMeal(meals.breakfast),
      lunch: normalizeMeal(meals.lunch),
      dinner: normalizeMeal(meals.dinner),
    },
    accommodation: typeof acc === 'string'
      ? { name: acc }
      : acc && typeof acc === 'object'
        ? acc as ItineraryDay['accommodation']
        : undefined,
  };
}

/** Parse la réponse previews GPT → 3 variants normalisés. Throw si inutilisable. */
export function parsePreviewResponse(data: unknown, numberOfDays: number): ItineraryVariant[] {
  const root = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const rawList = Array.isArray(root.itineraries) ? root.itineraries : [];
  if (rawList.length === 0) throw new GenerationParseError('Aucun itinéraire dans la réponse IA');

  const variants: ItineraryVariant[] = [];
  const seen = new Set<VariantName>();

  for (const raw of rawList) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const name = VARIANT_SYNONYMS[String(r.variant ?? '').toLowerCase().trim()];
    if (!name || seen.has(name)) continue;

    const p = (r.preview && typeof r.preview === 'object' ? r.preview : {}) as Record<string, unknown>;
    if (typeof p.title !== 'string' || !p.title) continue;

    const routePlan = Array.isArray(p.route_plan)
      ? p.route_plan
        .map((s, i) => {
          const step = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;
          return {
            day: typeof step.day === 'number' ? step.day : i + 1,
            location: typeof step.location === 'string' ? step.location : '',
          };
        })
        .filter((s) => s.location)
      : [];

    const preview: ItineraryPreview = {
      title: p.title,
      description: typeof p.description === 'string' ? p.description : '',
      budget_estimate: typeof p.budget_estimate === 'string' ? p.budget_estimate : '',
      highlights: Array.isArray(p.highlights)
        ? p.highlights.filter((h): h is string => typeof h === 'string').slice(0, 4)
        : [],
      teaser_days: Array.isArray(p.teaser_days)
        ? p.teaser_days
          .map((t, i) => {
            const td = (t && typeof t === 'object' ? t : {}) as Record<string, unknown>;
            return {
              day: typeof td.day === 'number' ? td.day : i + 1,
              summary: typeof td.summary === 'string' ? td.summary : '',
            };
          })
          .filter((t) => t.summary)
          .slice(0, 2)
        : [],
      route_plan: routePlan,
      sample_day: p.sample_day ? normalizeDay(p.sample_day, 1) : undefined,
    };

    // Un variant sans plan de route complet est vendable (dégradé) mais on
    // complète les jours manquants avec la dernière localité connue pour que
    // l'UI verrouillée et le contrat full restent cohérents.
    if (preview.route_plan && preview.route_plan.length > 0 && preview.route_plan.length < numberOfDays) {
      const last = preview.route_plan[preview.route_plan.length - 1];
      for (let d = preview.route_plan.length + 1; d <= numberOfDays; d++) {
        preview.route_plan.push({ day: d, location: last.location });
      }
    }

    seen.add(name);
    variants.push({ variant: name, preview });
  }

  if (variants.length === 0) throw new GenerationParseError('Variants IA invalides');
  return variants;
}

/** Parse + normalise la réponse full GPT. Throw si structure inutilisable. */
export function parseFullResponse(data: unknown): ItineraryFull {
  const root = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  // Tolère un wrapping {itinerary: {...}} ou direct {...}
  const body = (root.itinerary && typeof root.itinerary === 'object'
    ? root.itinerary
    : root) as Record<string, unknown>;

  const rawDays = Array.isArray(body.days) ? body.days : [];
  if (rawDays.length === 0) throw new GenerationParseError('Itinéraire complet sans jours');

  const days = rawDays.map((d, i) => normalizeDay(d, i + 1));

  return {
    title: typeof body.title === 'string' ? body.title : '',
    description: typeof body.description === 'string' ? body.description : '',
    days,
    total_budget: body.total_budget && typeof body.total_budget === 'object'
      ? body.total_budget as ItineraryFull['total_budget']
      : undefined,
    tips: Array.isArray(body.tips) ? body.tips.filter((t): t is string => typeof t === 'string') : [],
  };
}

// ─── Vérifications déterministes preview ↔ full ─────────────────────────────

function slug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function locationsMatch(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const sa = slug(a);
  const sb = slug(b);
  return sa === sb || sa.includes(sb) || sb.includes(sa);
}

export interface HardCheckResult {
  ok: boolean;
  issues: string[];
  /** Full corrigé (titre/description forcés depuis la preview). */
  fixed: ItineraryFull;
}

/**
 * Contrôles durs et corrections automatiques :
 * - nombre de jours exact (échec bloquant sinon)
 * - titre/description forcés depuis la preview (le contrat prime)
 * - plan de route respecté (échec si >25% de jours divergents)
 * - jour 1 fidèle au sample_day (échec si hébergement ou activités divergents)
 */
export function runHardChecks(
  full: ItineraryFull,
  preview: ItineraryPreview,
  expectedDays: number,
): HardCheckResult {
  const issues: string[] = [];
  const fixed: ItineraryFull = {
    ...full,
    // Le titre et la description vendus priment toujours.
    title: preview.title,
    description: preview.description || full.description,
  };

  if (full.days.length !== expectedDays) {
    issues.push(`Nombre de jours livrés (${full.days.length}) différent du nombre acheté (${expectedDays})`);
  }

  const plan = preview.route_plan || [];
  if (plan.length > 0) {
    let mismatches = 0;
    const details: string[] = [];
    for (const step of plan) {
      const day = full.days.find((d) => d.day === step.day);
      if (!day || !locationsMatch(day.location, step.location)) {
        mismatches++;
        if (details.length < 5) {
          details.push(`Jour ${step.day}: promis "${step.location}", livré "${day?.location || 'absent'}"`);
        }
      }
    }
    if (mismatches / plan.length > 0.25) {
      issues.push(`Plan de route non respecté (${mismatches}/${plan.length} jours divergents). ${details.join(' ; ')}`);
    }
  }

  const sample = preview.sample_day;
  const day1 = full.days.find((d) => d.day === 1);
  if (sample && day1) {
    const sampleActs = (sample.activities || []).map((a) => slug(a.name));
    const day1Acts = (day1.activities || []).map((a) => slug(a.name));
    const missingActs = sampleActs.filter(
      (sa) => !day1Acts.some((da) => da.includes(sa) || sa.includes(da)),
    );
    if (missingActs.length > 0 && missingActs.length >= sampleActs.length / 2) {
      issues.push(`Jour 1 différent de l'échantillon montré au client (activités promises absentes : ${missingActs.join(', ')})`);
    }
    const sampleAcc = sample.accommodation?.name;
    const day1Acc = day1.accommodation?.name;
    if (sampleAcc && day1Acc && !locationsMatch(sampleAcc, day1Acc)) {
      issues.push(`Hébergement jour 1 divergent : promis "${sampleAcc}", livré "${day1Acc}"`);
    }
  }

  return { ok: issues.length === 0, issues, fixed };
}
