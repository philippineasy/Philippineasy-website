import { NextRequest, NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ItineraryPDF } from '@/components/pdf/ItineraryPDF';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClientForRouteHandler();

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
    }

    // Get itinerary
    const { data: generation, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !generation) {
      return NextResponse.json({ error: 'Itineraire non trouve' }, { status: 404 });
    }

    if (generation.user_id !== user.id) {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }

    if (generation.payment_status !== 'completed') {
      return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });
    }

    // Parse itineraries
    let itineraries = generation.itineraries;
    if (typeof itineraries === 'string') itineraries = JSON.parse(itineraries);

    // Find selected variant
    const selectedVariant = generation.selected_variant;
    const variant = itineraries.find((it: { variant: string }) => it.variant === selectedVariant)
      || itineraries[0];

    if (!variant) {
      return NextResponse.json({ error: 'Variant non trouve' }, { status: 404 });
    }

    // Build itinerary data for PDF
    const full = variant.full || variant;
    const days = (full.days || []).map((d: any, i: number) => ({
      day: d.day || i + 1,
      title: d.title || `Jour ${d.day || i + 1}`,
      location: d.location || '',
      activities: (d.activities || []).map((a: any) => {
        if (typeof a === 'string') return { name: a };
        return {
          time: a.time,
          name: a.name || '',
          description: a.description || '',
          cost: a.cost || '',
          coordinates: a.coordinates || null,
          google_maps_url: a.google_maps_url || null,
          google_rating: a.google_rating || null,
        };
      }),
      meals: (() => {
        const raw = d.meals || {};
        const normalize = (m: any) => {
          if (!m) return undefined;
          if (typeof m === 'string') return { restaurant: m };
          return {
            restaurant: m.restaurant || m.name || '',
            dish: m.dish || '',
            cost: m.cost || '',
            coordinates: m.coordinates || null,
            google_maps_url: m.google_maps_url || null,
            google_rating: m.google_rating || null,
          };
        };
        return {
          breakfast: normalize(raw.breakfast),
          lunch: normalize(raw.lunch),
          dinner: normalize(raw.dinner),
        };
      })(),
      accommodation: (() => {
        const acc = d.accommodation;
        if (!acc) return undefined;
        if (typeof acc === 'string') return { name: acc };
        return {
          name: acc.name || '',
          type: acc.type || '',
          cost: acc.cost || '',
          coordinates: acc.coordinates || null,
          google_maps_url: acc.google_maps_url || null,
          google_rating: acc.google_rating || null,
        };
      })(),
      transport: d.transport || undefined,
    }));

    const itineraryData = {
      title: variant.preview?.title || full.title || 'Votre itineraire Philippines',
      description: variant.preview?.description || full.description || '',
      days,
      tips: full.tips || [],
      total_budget: full.total_budget?.total || variant.preview?.budget_estimate || '',
      variant: variant.variant || selectedVariant || 'balanced',
    };

    // Get user name
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .single();

    const userName = profile?.first_name || undefined;
    const preferences = generation.preferences || {};
    const duration = preferences.duration || `${days.length} jours`;

    const offerLabels: Record<string, string> = {
      express: 'Express',
      premium: 'Premium',
      conciergerie: 'Conciergerie',
    };
    const offerType = offerLabels[generation.offer_type] || generation.offer_type || '';

    // Generate PDF
    const pdfElement = React.createElement(ItineraryPDF, {
      itinerary: itineraryData,
      userName,
      duration,
      offerType,
    });
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // Build filename
    const destinations = [...new Set(days.map((d: any) => d.location).filter(Boolean))].join('-') || 'philippines';
    const filename = `philippineasy-itineraire-${destinations.toLowerCase().replace(/\s+/g, '-')}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Erreur generation PDF', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
