import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { sendItineraryEmail } from '@/services/emailService';

const N8N_DELIVER_URL = process.env.N8N_ITINERARY_DELIVER_URL || 'https://n8n.adascanpro.com/webhook/itinerary-deliver';
const N8N_API_KEY = process.env.N8N_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generation_id, delivery_email, delivery_telegram, email, telegram_chat_id } = body;

    const wantEmail = delivery_email ?? (body.delivery_method === 'email');
    const wantTelegram = delivery_telegram ?? (body.delivery_method === 'telegram');

    if (!generation_id) {
      return NextResponse.json({ error: 'generation_id requis' }, { status: 400 });
    }

    if (wantEmail && !email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    if (wantTelegram && !telegram_chat_id) {
      return NextResponse.json({ error: 'Chat ID Telegram requis' }, { status: 400 });
    }

    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const { data: generation, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', generation_id)
      .eq('user_id', user.id) // ownership check — block tiers
      .single();

    if (error || !generation) {
      return NextResponse.json({ error: 'Generation non trouvee' }, { status: 404 });
    }

    if (generation.payment_status !== 'completed') {
      return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });
    }

    const itineraries = typeof generation.itineraries === 'string'
      ? JSON.parse(generation.itineraries)
      : generation.itineraries;

    const selectedVariant = itineraries.find(
      (it: { variant: string }) => it.variant === generation.selected_variant
    ) || itineraries[0];

    // Source de vérité : delivered_itinerary (pipeline previews-first),
    // fallback itineraries[].full pour les rows legacy.
    const delivered = typeof generation.delivered_itinerary === 'string'
      ? JSON.parse(generation.delivered_itinerary)
      : generation.delivered_itinerary;
    const days: { location?: string }[] = delivered?.days?.length
      ? delivered.days
      : (selectedVariant?.full?.days || []);

    if (days.length === 0) {
      // Payé mais finalisation pas encore terminée — l'email "prêt" partira
      // automatiquement de runFinalize, inutile d'envoyer un email vide.
      return NextResponse.json(
        { error: 'Itineraire en cours de finalisation, reessayez dans une minute' },
        { status: 409 }
      );
    }

    const errors: string[] = [];

    // Email: send directly via Resend (not n8n)
    if (wantEmail) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', generation.user_id)
          .single();

        const destinations = [...new Set(
          days.map((d) => (d.location || '').split('(')[0].split('/')[0].trim()).filter(Boolean)
        )].join(', ') || 'Philippines';

        await sendItineraryEmail({
          to: email,
          userName: profile?.username || undefined,
          itineraryTitle: delivered?.title || selectedVariant?.preview?.title || selectedVariant?.full?.title || 'Votre itineraire',
          destination: destinations,
          days: days.length,
          variant: generation.selected_variant || 'balanced',
          generationId: generation_id,
          // CTA "Telecharger PDF" uniquement Premium+ (cf. OFFER_LABELS)
          offerType: (generation.offer_type as 'express' | 'premium' | 'conciergerie') || 'premium',
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        errors.push('email: ' + (emailError instanceof Error ? emailError.message : 'failed'));
      }
    }

    // Telegram: send via n8n (Telegram node needs bot credentials)
    if (wantTelegram) {
      if (!N8N_API_KEY) {
        console.error('N8N_API_KEY not configured — cannot dispatch Telegram delivery');
        errors.push('telegram: configuration manquante');
      } else try {
        const n8nResponse = await fetch(N8N_DELIVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-Key': N8N_API_KEY,
          },
          body: JSON.stringify({
            generation_id,
            selected_variant: generation.selected_variant,
            itineraries: generation.itineraries,
            delivery_email: false,
            delivery_telegram: true,
            telegram_chat_id,
          }),
        });

        if (!n8nResponse.ok) {
          const errText = await n8nResponse.text();
          console.error('n8n telegram error:', errText);
          errors.push('telegram: n8n error');
        }
      } catch (n8nError) {
        console.error('n8n request failed:', n8nError);
        errors.push('telegram: n8n unreachable');
      }
    }

    // Upsert (la row peut ne pas exister si la génération a été créée avant
    // l'introduction de la table delivery_preferences).
    await supabase
      .from('delivery_preferences')
      .upsert({
        generation_id,
        delivery_status: errors.length === 0 ? 'sent' : 'failed',
        delivered_at: errors.length === 0 ? new Date().toISOString() : null,
        error_log: errors.length > 0 ? errors.join('; ') : null,
      }, { onConflict: 'generation_id' });

    return NextResponse.json({
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Deliver error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
