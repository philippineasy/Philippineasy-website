import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { trackServerEvent, extractClientId } from '@/lib/ga4-server';
import { validatePreferences, buildTripContext, InvalidPreferencesError } from '@/lib/itinerary/context';
import { callOpenAIJson, OpenAIError } from '@/lib/itinerary/openai';
import { PREVIEW_SYSTEM, buildPreviewUserPrompt } from '@/lib/itinerary/prompts';
import { parsePreviewResponse, GenerationParseError } from '@/lib/itinerary/normalize';

// Previews-first (2026-07) : on ne génère plus que les 3 aperçus (+ jour 1
// échantillon + plan de route) en un appel OpenAI court (~10-20s). L'itinéraire
// complet du variant acheté est généré post-paiement (src/lib/itinerary/finalize.ts).
// Avant : proxy n8n synchrone qui générait 3 itinéraires complets en 60-90s.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let prefs;
    try {
      prefs = validatePreferences(body);
    } catch (err) {
      if (err instanceof InvalidPreferencesError) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
      }
      throw err;
    }

    // Auth optionnelle — le flux anonyme fournit un email pour recovery/magic link
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const submittedEmail = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail : '';

    // ── Génération des previews (OpenAI direct) ──────────────────────────────
    const ctx = buildTripContext(prefs);
    let variants;
    try {
      const { data } = await callOpenAIJson<unknown>({
        system: PREVIEW_SYSTEM,
        user: buildPreviewUserPrompt(ctx),
        temperature: 0.4,
        maxTokens: 8000,
        timeoutMs: 50_000,
      });
      variants = parsePreviewResponse(data, ctx.numberOfDays);
    } catch (err) {
      if (err instanceof OpenAIError || err instanceof GenerationParseError) {
        console.error('[itinerary/generate] generation failed:', err.message);
        return NextResponse.json(
          { success: false, error: 'Le générateur IA est temporairement indisponible. Réessayez dans une minute.' },
          { status: 502 }
        );
      }
      throw err;
    }

    // ── Persistance (service role : le flux anonyme n'a pas de session) ──────
    const admin = createServiceRoleClient();
    const { data: inserted, error: insertError } = await admin
      .from('itinerary_generations')
      .insert({
        user_id: user?.id || null,
        preferences: { ...prefs },
        itineraries: variants,
        status: 'generated',
        ...(submittedEmail ? { delivery_email: submittedEmail } : {}),
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      console.error('[itinerary/generate] insert failed:', insertError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la sauvegarde. Réessayez.' },
        { status: 500 }
      );
    }

    // Server-side GA4 tracking (bypass adblockers)
    const clientId = extractClientId(request.headers.get('cookie'));
    trackServerEvent(
      clientId,
      {
        name: 'ia_itinerary_generated',
        params: {
          generation_id: inserted.id,
          travel_type: prefs.travelType,
          duration: prefs.duration,
          budget: prefs.budget,
          trip_style: prefs.tripStyle,
          authenticated: user ? 'yes' : 'no',
        },
      },
      user?.id,
    ).catch(() => { /* non-bloquant */ });

    return NextResponse.json({
      success: true,
      generation_id: inserted.id,
      previews: variants.map((v) => ({ variant: v.variant, ...v.preview })),
    });
  } catch (error) {
    console.error('[itinerary/generate] unexpected error', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
