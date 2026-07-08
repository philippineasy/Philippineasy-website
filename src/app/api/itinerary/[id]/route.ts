import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { enrichDays } from '@/lib/itinerary/places';
import { normalizeDay } from '@/lib/itinerary/normalize';
import type { ItineraryVariant } from '@/lib/itinerary/types';

// L'enrichissement Places des rows legacy peut prendre du temps (jusqu'à 60 lookups)
export const maxDuration = 120;

// ========== Main Handler ==========

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const supabase = await createClientForRouteHandler();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });

    const { data: rawItinerary, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !rawItinerary) return NextResponse.json({ error: 'Itineraire non trouve' }, { status: 404 });
    if (rawItinerary.user_id !== user.id) return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    if (rawItinerary.payment_status !== 'completed') return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });

    const baseFields = {
      id: rawItinerary.id,
      user_id: rawItinerary.user_id,
      preferences: rawItinerary.preferences,
      offer_type: rawItinerary.offer_type || 'express',
      modifications_remaining: rawItinerary.modifications_remaining ?? 0,
      payment_status: rawItinerary.payment_status,
      created_at: rawItinerary.created_at,
      delivered_at: rawItinerary.delivered_at,
    };

    // ── Cas nominal : delivered_itinerary (finalisé + enrichi) ───────────────
    let deliveredData = null;
    if (rawItinerary.delivered_itinerary) {
      try {
        deliveredData = typeof rawItinerary.delivered_itinerary === 'string'
          ? JSON.parse(rawItinerary.delivered_itinerary) : rawItinerary.delivered_itinerary;
      } catch { /* ignore */ }
    }

    if (deliveredData?.days?.length > 0) {
      return NextResponse.json({
        itinerary: {
          ...baseFields,
          selected_variant: {
            name: rawItinerary.selected_variant || 'balanced',
            title: deliveredData.title || 'Mon Itineraire',
            description: deliveredData.description || '',
            days: deliveredData.days.map((d: unknown, i: number) => normalizeDay(d, i + 1)),
            tips: deliveredData.tips || [],
            total_budget: deliveredData.total_budget || 'N/A',
          },
        },
      });
    }

    // ── Legacy : le full vit encore dans itineraries[] (rows pré-2026-07) ────
    let variants: ItineraryVariant[] = [];
    try {
      variants = typeof rawItinerary.itineraries === 'string'
        ? JSON.parse(rawItinerary.itineraries) : (rawItinerary.itineraries || []);
    } catch { /* ignore */ }

    const selectedName = rawItinerary.selected_variant || 'balanced';
    const variant = variants.find(v => v.variant === selectedName) || variants[0];
    const legacyDays = variant?.full?.days;

    if (!legacyDays || legacyDays.length === 0) {
      // Previews-first : payé mais le complet est en cours de génération
      // (webhook/completion). Le frontend poll jusqu'à finalize_status=ready.
      return NextResponse.json(
        { generating: true, finalize_status: rawItinerary.finalize_status || null },
        { status: 202 }
      );
    }

    const days = legacyDays.map((d, i) => normalizeDay(d, i + 1));

    // Enrichissement one-shot des rows legacy jamais enrichies
    const hasCoords = days.some(d =>
      d.activities?.some(a => a.coordinates?.lat) ||
      d.accommodation?.coordinates?.lat
    );

    if (!hasCoords && process.env.GOOGLE_PLACES_API_KEY) {
      const { count } = await enrichDays(days, 50);

      if (count > 0) {
        const enrichedVariant = {
          name: selectedName,
          title: variant.preview?.title || variant.full?.title || 'Mon Itineraire',
          description: variant.preview?.description || variant.full?.description || '',
          days,
          tips: variant.full?.tips || [],
          total_budget: variant.full?.total_budget?.total || variant.preview?.budget_estimate || 'N/A',
        };

        await supabase
          .from('itinerary_generations')
          .update({ delivered_itinerary: enrichedVariant })
          .eq('id', id);
      }
    }

    return NextResponse.json({
      itinerary: {
        ...baseFields,
        selected_variant: {
          name: selectedName,
          title: variant.preview?.title || variant.full?.title || 'Mon Itineraire',
          description: variant.preview?.description || variant.full?.description || '',
          days,
          tips: variant.full?.tips || [],
          total_budget: variant.full?.total_budget?.total || variant.preview?.budget_estimate || 'N/A',
        },
      },
    });

  } catch (error) {
    console.error('Get itinerary error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
