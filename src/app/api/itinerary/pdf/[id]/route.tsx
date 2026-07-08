import { NextRequest, NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ItineraryPDF } from '@/components/pdf/ItineraryPDF';
import { fetchPlacePhoto } from '@/lib/itinerary/places';
import React from 'react';

export const maxDuration = 90;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMealForPdf(m: any) {
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPdfDays(rawDays: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rawDays || []).map((d: any, i: number) => ({
    day: d.day || i + 1,
    title: d.title || `Jour ${d.day || i + 1}`,
    location: d.location || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    meals: {
      breakfast: normalizeMealForPdf(d.meals?.breakfast),
      lunch: normalizeMealForPdf(d.meals?.lunch),
      dinner: normalizeMealForPdf(d.meals?.dinner),
    },
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
    photoUrl: null as string | null,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClientForRouteHandler();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
    }

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

    // Le PDF est une feature Premium+ — Express n'y a pas droit
    // (cf. OFFER_LABELS dans src/config/itinerary-pricing.ts).
    const generationOfferType = (generation.offer_type as string) || 'express';
    if (generationOfferType === 'express') {
      return NextResponse.json(
        { error: 'PDF reserve aux offres Premium et Conciergerie', upgradeRequired: true },
        { status: 403 }
      );
    }

    // ── Source du contenu : delivered_itinerary (finalisé + enrichi Places),
    // fallback itineraries[].full pour les rows legacy.
    let delivered = generation.delivered_itinerary;
    if (typeof delivered === 'string') {
      try { delivered = JSON.parse(delivered); } catch { delivered = null; }
    }

    let title: string, description: string, tips: string[], totalBudget: string, variantName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawDays: any[];

    if (delivered?.days?.length > 0) {
      title = delivered.title || 'Votre itineraire Philippines';
      description = delivered.description || '';
      rawDays = delivered.days;
      tips = delivered.tips || [];
      totalBudget = typeof delivered.total_budget === 'string'
        ? delivered.total_budget
        : delivered.total_budget?.total || '';
      variantName = delivered.name || generation.selected_variant || 'balanced';
    } else {
      let itineraries = generation.itineraries;
      if (typeof itineraries === 'string') itineraries = JSON.parse(itineraries);
      const variant = itineraries.find((it: { variant: string }) => it.variant === generation.selected_variant)
        || itineraries[0];
      if (!variant?.full?.days?.length) {
        // Previews-first : le complet n'est pas encore généré
        return NextResponse.json(
          { error: 'Itineraire en cours de finalisation, reessayez dans une minute', generating: true },
          { status: 409 }
        );
      }
      const full = variant.full;
      title = variant.preview?.title || full.title || 'Votre itineraire Philippines';
      description = variant.preview?.description || full.description || '';
      rawDays = full.days;
      tips = full.tips || [];
      totalBudget = full.total_budget?.total || variant.preview?.budget_estimate || '';
      variantName = variant.variant || generation.selected_variant || 'balanced';
    }

    const days = buildPdfDays(rawDays);

    // ── Photos (Google Places) — tout en parallèle pour tenir le timeout ─────
    // 1 photo de couverture (destination principale, grande) + 1 bandeau par
    // jour (première activité) + hôtels en vignette.
    const photoJobs: Promise<void>[] = [];

    let coverPhotoUrl: string | null = null;
    const mainLocation = days[0]?.location || 'Palawan';
    photoJobs.push(
      fetchPlacePhoto(mainLocation, '', 1600).then((url) => { coverPhotoUrl = url; })
    );

    const MAX_DAY_BANNERS = 24;
    for (const day of days.slice(0, MAX_DAY_BANNERS)) {
      const target = day.activities?.[0]?.name || day.location;
      if (!target) continue;
      photoJobs.push(
        fetchPlacePhoto(target, day.location, 900).then((url) => { day.photoUrl = url; })
      );
    }

    const MAX_PLACE_THUMBS = 12;
    let thumbCount = 0;
    for (const day of days) {
      if (thumbCount >= MAX_PLACE_THUMBS) break;
      const acc = day.accommodation;
      if (acc?.name && acc.name !== 'N/A') {
        thumbCount++;
        photoJobs.push(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fetchPlacePhoto(acc.name, day.location, 400).then((url) => { (acc as any).photoUrl = url; })
        );
      }
    }

    await Promise.all(photoJobs);

    const itineraryData = {
      title,
      description,
      days,
      tips,
      total_budget: totalBudget,
      variant: variantName,
      coverPhotoUrl,
    };

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const userName = profile?.username || undefined;
    const preferences = generation.preferences || {};
    const duration = preferences.duration || `${days.length} jours`;

    const offerLabels: Record<string, string> = {
      express: 'Express',
      premium: 'Premium',
      conciergerie: 'Conciergerie',
    };
    const offerType = offerLabels[generation.offer_type] || generation.offer_type || '';

    const pdfElement = React.createElement(ItineraryPDF, {
      itinerary: itineraryData,
      userName,
      duration,
      offerType,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      {
        error: 'Erreur generation PDF',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
