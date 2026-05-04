import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { trackServerEvent, extractClientId } from '@/lib/ga4-server';

// n8n GPT-4.1 + Supabase chain takes ~60-80s typically. Default Vercel Hobby
// is 10s, Pro is 60s. Bump to 90s to comfortably accommodate the workflow.
export const maxDuration = 90;
export const dynamic = 'force-dynamic';

const N8N_WEBHOOK_URL = process.env.N8N_ITINERARY_GENERATE_URL || 'https://n8n.adascanpro.com/webhook/itinerary-generate';
const N8N_API_KEY = process.env.N8N_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Valider les champs requis
    const requiredFields = ['travelType', 'duration', 'budget', 'tripStyle', 'interests'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Champ requis manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    // Vérifier l'authentification (optionnelle — flux anonyme supporte avec ou sans email)
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    // Email OPTIONNEL — capture si fournie (PreferencesForm landing page) pour recovery
    // mais pas bloquant pour les autres entry points (IAOverlay popup depuis Header
    // sans champ email). Validation regex simple si presente.
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const submittedEmail = rawEmail && emailRe.test(rawEmail) ? rawEmail : '';

    // Préparer les données pour n8n (workflow inchangé)
    const n8nPayload = {
      userId: user?.id || null,
      travelType: body.travelType,
      duration: body.duration,
      budget: body.budget,
      tripStyle: body.tripStyle,
      interests: body.interests,
      additionalInfo: body.additionalInfo || '',
    };

    // Appeler le webhook n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-Key': N8N_API_KEY || '',
      },
      body: JSON.stringify(n8nPayload),
    });

    const rawText = await n8nResponse.text();

    if (!n8nResponse.ok) {
      console.error('[itinerary/generate] upstream n8n non-200', n8nResponse.status, rawText);
      return NextResponse.json(
        { success: false, error: 'Le générateur IA est temporairement indisponible. Réessayez dans une minute.', upstream: n8nResponse.status },
        { status: 502 }
      );
    }

    if (!rawText || rawText.trim() === '') {
      console.error('[itinerary/generate] upstream n8n returned empty body — workflow likely throwing before Respond node');
      return NextResponse.json(
        { success: false, error: 'Le générateur IA n\'a renvoyé aucun résultat. Vérifiez votre formulaire ou réessayez.' },
        { status: 502 }
      );
    }

    let result: any;
    try {
      result = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error('[itinerary/generate] upstream n8n returned invalid JSON', rawText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: 'Réponse IA invalide. Réessayez.' },
        { status: 502 }
      );
    }

    if (!result.success) {
      console.error('[itinerary/generate] workflow reported failure', result);
      return NextResponse.json(
        { success: false, error: result.error || 'Erreur inconnue côté IA' },
        { status: 502 }
      );
    }

    // Stocker delivery_email apres generation reussie (flux anonyme : recovery + magic link payment)
    // n8n cree la row sans delivery_email -> on la met a jour cote Next.js pour eviter de toucher au workflow.
    // Pour les users authentifies, on stocke aussi l'email saisi s'il differe de l'email du compte
    // (cas oppose : user veut recevoir l'itineraire sur un email pro/perso different).
    if (result.generation_id && submittedEmail) {
      const { error: updateError } = await supabase
        .from('itinerary_generations')
        .update({ delivery_email: submittedEmail })
        .eq('id', result.generation_id);
      if (updateError) {
        // Non-bloquant : l'utilisateur a son apercu, mais le recovery email ne marchera pas pour cette gen
        console.error('[itinerary/generate] failed to store delivery_email', updateError);
      }
    }

    // Server-side GA4 tracking (bypass adblockers) — ia_itinerary_generated
    const clientId = extractClientId(request.headers.get('cookie'));
    trackServerEvent(
      clientId,
      {
        name: 'ia_itinerary_generated',
        params: {
          generation_id: result.generation_id || '',
          travel_type: body.travelType,
          duration: body.duration,
          budget: body.budget,
          trip_style: body.tripStyle,
          authenticated: user ? 'yes' : 'no',
        },
      },
      user?.id,
    ).catch(() => { /* non-bloquant */ });

    return NextResponse.json({
      success: true,
      generation_id: result.generation_id,
      previews: result.previews,
      meta: result.meta,
    });

  } catch (error) {
    console.error('[itinerary/generate] unexpected error', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
