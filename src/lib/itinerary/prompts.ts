// ---------------------------------------------------------------------------
// Prompts du pipeline itinéraire (previews-first).
// Les règles de cohérence géographique sont héritées du prompt n8n V3,
// écrites après des incidents réels (lieux Samal proposés sur Talikud).
// ---------------------------------------------------------------------------
import type { ItineraryFull, ItineraryPreview, TripContext, VariantName } from './types';

// Règles communes aux deux générations — un lieu inventé ou un ping-pong
// entre îles est le pire défaut produit possible.
const GEO_RULES = `COHÉRENCE GÉOGRAPHIQUE (CRITIQUE — NON NÉGOCIABLE):
- NE JAMAIS INVENTER de nom de lieu. Chaque restaurant, hôtel, plage DOIT être un lieu RÉEL vérifiable sur Google Maps.
- Si tu ne connais pas de lieu réel dans une zone, utilise des termes génériques ("restaurant local", "guesthouse") plutôt que d'inventer un nom.
- Le petit-déjeuner DOIT être au même endroit que l'hébergement de la nuit précédente (même hôtel/resort) ou à moins de 2 km.
- Toutes les activités d'une journée doivent être accessibles les unes des autres en moins de 30 minutes de transport local.
- Si on change d'île ou de ville, le TRANSPORT est la première chose du jour et les activités APRÈS sont sur la nouvelle destination.
- Ne PAS proposer un lieu d'une île comme activité sur une autre île.
- Pour les petites îles, propose uniquement des lieux QUI EXISTENT SUR CETTE ÎLE. En cas de doute, activités génériques (snorkeling, randonnée côtière, pique-nique).
- Chaque jour : matin → midi → après-midi → soir dans la MÊME zone, pas de ping-pong entre îles.
- Le dernier jour doit inclure le retour vers l'aéroport/port de départ.
- Prix réalistes en PHP (Peso Philippin), cohérents avec le budget indiqué.`;

const DAY_SHAPE = `{
  "day": 1,
  "title": "Titre du jour EN FRANÇAIS",
  "location": "Panglao",
  "transport": {"method": "Van", "from": "Aéroport Tagbilaran", "to": "Panglao", "cost": "300 PHP", "duration": "30min"},
  "activities": [
    {"time": "09:00", "name": "Alona Beach", "description": "Détente sur la plage de sable blanc", "cost": "Gratuit"},
    {"time": "14:00", "name": "Hinagdanan Cave", "description": "Visite de la grotte souterraine", "cost": "50 PHP"}
  ],
  "meals": {
    "breakfast": {"restaurant": "Bohol Bee Farm", "dish": "Organic breakfast set", "cost": "350 PHP"},
    "lunch": {"restaurant": "Dumaluan Beach Resort Restaurant", "dish": "Grilled squid", "cost": "400 PHP"},
    "dinner": {"restaurant": "Giuseppe Pizzeria", "dish": "Pizza margherita", "cost": "350 PHP"}
  },
  "accommodation": {"name": "Amorita Resort", "type": "resort", "cost": "4500 PHP/nuit"}
}`;

function contextBlock(ctx: TripContext): string {
  return `Destination souhaitée: ${ctx.destinations.length ? ctx.destinations.join(', ') : 'Libre — choisis les régions les plus adaptées'}
Type: ${ctx.travelTypeLabel}
Durée: ${ctx.numberOfDays} jours
Budget: ${ctx.budgetLabel} — soit ${ctx.budgetPhpPerDay}
Style: ${ctx.tripStyleLabel}
Intérêts: ${ctx.interestsLabel}
Notes du voyageur: ${ctx.prefs.additionalInfo || 'Aucune'}`;
}

// ─── Étape 1 : previews (3 variants, pas d'itinéraire complet) ──────────────

export const PREVIEW_SYSTEM = `Tu es un expert du voyage aux Philippines qui travaille pour Philippineasy, le guide francophone de référence. Réponds UNIQUEMENT en JSON valide.

RÈGLES:
1. TOUT en FRANÇAIS (titres, descriptions, résumés). Les noms de lieux restent en anglais/local.
2. Chaque lieu cité doit être un VRAI lieu aux Philippines.
3. Les 3 variants doivent être réellement différents (régions, rythme ou focus distincts).

${GEO_RULES}`;

export function buildPreviewUserPrompt(ctx: TripContext): string {
  return `Prépare 3 propositions d'itinéraires Philippines de ${ctx.numberOfDays} jours (variants: relax, balanced, adventure).

${contextBlock(ctx)}

Pour CHAQUE variant tu fournis UNIQUEMENT :
- un aperçu vendeur (title, description, budget, highlights, résumé des 2 premiers jours)
- le plan de route COMPLET jour par jour ("route_plan": la localité de chaque jour, du jour 1 au jour ${ctx.numberOfDays})
- le JOUR 1 COMPLET et détaillé ("sample_day") qui servira d'échantillon de qualité — il doit être irréprochable

Le plan de route est un ENGAGEMENT : l'itinéraire complet sera rédigé plus tard en suivant EXACTEMENT ce plan. Sois réaliste sur les temps de trajet inter-îles.

JSON OBLIGATOIRE (structure exacte, aucun champ omis) :
{
  "itineraries": [
    {
      "variant": "relax",
      "preview": {
        "title": "Titre accrocheur EN FRANÇAIS",
        "description": "2-3 phrases de description EN FRANÇAIS",
        "budget_estimate": "XXX-XXX EUR",
        "highlights": ["highlight 1", "highlight 2", "highlight 3"],
        "teaser_days": [{"day": 1, "summary": "résumé une phrase"}, {"day": 2, "summary": "résumé une phrase"}],
        "route_plan": [{"day": 1, "location": "Panglao"}, {"day": 2, "location": "Panglao"}, {"day": 3, "location": "Bohol"}],
        "sample_day": ${DAY_SHAPE}
      }
    },
    {"variant": "balanced", "preview": {…}},
    {"variant": "adventure", "preview": {…}}
  ]
}

CONTRAINTES:
- "route_plan" contient EXACTEMENT ${ctx.numberOfDays} entrées (jour 1 à ${ctx.numberOfDays}).
- "sample_day" correspond au jour 1 du route_plan et au premier teaser_day.
- "budget_estimate" en EUR, cohérent avec ${ctx.budgetPhpPerDay} sur ${ctx.numberOfDays} jours.
- Remplace les … par du vrai contenu complet pour les 3 variants.`;
}

// ─── Étape 2 : full (variant sélectionné uniquement, post-paiement) ─────────

export const FULL_SYSTEM = `Tu es un expert du voyage aux Philippines qui travaille pour Philippineasy. Tu rédiges l'itinéraire complet qu'un client vient d'ACHETER sur la base d'un aperçu précis. Réponds UNIQUEMENT en JSON valide.

RÈGLES:
1. TOUT en FRANÇAIS. Les noms de lieux restent en anglais/local.
2. L'aperçu vendu est un CONTRAT : titre identique, même plan de route, même jour 1, budget dans la fourchette annoncée. Toute divergence est un défaut grave.
3. Chaque repas = objet avec restaurant, dish, cost (jamais une simple string).
4. Chaque jour a une "location" = nom de la ville ou île, identique au route_plan.
5. 3 conseils pratiques minimum dans "tips".
6. NE PAS inclure de coordonnées GPS — elles seront ajoutées automatiquement.

${GEO_RULES}`;

export function buildFullUserPrompt(
  ctx: TripContext,
  variant: VariantName,
  preview: ItineraryPreview,
): string {
  const routePlan = (preview.route_plan || [])
    .map((s) => `Jour ${s.day}: ${s.location}`)
    .join('\n');

  return `Rédige l'itinéraire Philippines COMPLET de ${ctx.numberOfDays} jours acheté par le client (variant "${variant}").

${contextBlock(ctx)}

APERÇU VENDU AU CLIENT (contrat à respecter à la lettre) :
- Titre (à reprendre À L'IDENTIQUE): ${preview.title}
- Description: ${preview.description}
- Budget annoncé: ${preview.budget_estimate}
- Points forts promis (chacun DOIT apparaître dans l'itinéraire): ${(preview.highlights || []).join(' | ')}
- Résumés promis: ${(preview.teaser_days || []).map((t) => `Jour ${t.day}: ${t.summary}`).join(' | ')}

PLAN DE ROUTE À SUIVRE EXACTEMENT (la "location" de chaque jour doit correspondre) :
${routePlan || `À construire sur ${ctx.numberOfDays} jours cohérents.`}

JOUR 1 DÉJÀ MONTRÉ AU CLIENT — reprends-le tel quel comme jour 1 (tu peux uniquement compléter des champs manquants, jamais changer les lieux) :
${JSON.stringify(preview.sample_day || {}, null, 2)}

JSON OBLIGATOIRE (structure exacte) :
{
  "title": "${preview.title.replace(/"/g, '\\"')}",
  "description": "Description EN FRANÇAIS",
  "days": [ ${DAY_SHAPE} ],
  "total_budget": {"accommodation": "13500 PHP", "activities": "3000 PHP", "food": "9000 PHP", "transport": "2000 PHP", "total": "27500 PHP (~450 EUR)"},
  "tips": ["conseil 1", "conseil 2", "conseil 3"]
}

CONTRAINTES:
- "days" contient EXACTEMENT ${ctx.numberOfDays} jours COMPLETS (transport si déplacement, 2-3 activités, 3 repas en objets, hébergement chaque nuit sauf dernier jour si départ).
- Le total EUR de "total_budget.total" doit rester dans la fourchette annoncée (${preview.budget_estimate}).
- Chaque highlight promis apparaît dans une activité ou une journée.`;
}

// ─── Étape 3 : juge de cohérence preview ↔ full ─────────────────────────────

export const CONSISTENCY_SYSTEM = `Tu es un contrôleur qualité impitoyable chez Philippineasy. Un client a acheté un itinéraire sur la base d'un aperçu ; tu vérifies que l'itinéraire complet livré correspond parfaitement à cet aperçu. Réponds UNIQUEMENT en JSON valide.`;

export function buildConsistencyUserPrompt(preview: ItineraryPreview, full: ItineraryFull): string {
  // Le condensé DOIT inclure hébergements et restaurants, sinon le juge
  // signale à tort des éléments "absents" qu'il ne peut simplement pas voir
  // (faux rejet constaté en test = 1 régénération inutile de ~60s).
  const condensedFull = {
    title: full.title,
    days: (full.days || []).map((d) => ({
      day: d.day,
      title: d.title,
      location: d.location,
      activities: (d.activities || []).map((a) => a.name),
      accommodation: d.accommodation?.name || null,
      restaurants: (['breakfast', 'lunch', 'dinner'] as const)
        .map((mt) => d.meals?.[mt]?.restaurant)
        .filter(Boolean),
    })),
    total_budget: full.total_budget?.total,
    tips_count: (full.tips || []).length,
  };

  return `APERÇU VENDU :
${JSON.stringify({
    title: preview.title,
    description: preview.description,
    budget_estimate: preview.budget_estimate,
    highlights: preview.highlights,
    teaser_days: preview.teaser_days,
    route_plan: preview.route_plan,
    sample_day_places: {
      activities: (preview.sample_day?.activities || []).map((a) => a.name),
      accommodation: preview.sample_day?.accommodation?.name,
    },
  }, null, 2)}

ITINÉRAIRE COMPLET LIVRÉ (condensé) :
${JSON.stringify(condensedFull, null, 2)}

Vérifie point par point :
1. Titre identique.
2. La location de chaque jour suit le route_plan (tolérance : orthographe/précision, ex "El Nido" vs "El Nido, Palawan").
3. Le jour 1 livré reprend les lieux du sample_day (activités, hébergement).
4. Les jours 1-2 livrés correspondent aux teaser_days promis.
5. Chaque highlight promis se retrouve dans l'itinéraire.
6. Le budget total livré est dans la fourchette du budget_estimate.

Réponds en JSON : {"consistent": true/false, "issues": ["description précise de chaque divergence, vide si aucune"]}`;
}

/** Message correctif pour la relance après échec de cohérence. */
export function buildFixInstruction(issues: string[]): string {
  return `

⚠️ TA PRÉCÉDENTE VERSION A ÉTÉ REJETÉE PAR LE CONTRÔLE QUALITÉ pour les divergences suivantes avec l'aperçu vendu :
${issues.map((i) => `- ${i}`).join('\n')}

Corrige TOUTES ces divergences. L'aperçu est un contrat : c'est l'itinéraire qui s'adapte à l'aperçu, jamais l'inverse.`;
}
