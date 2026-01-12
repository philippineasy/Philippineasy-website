import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const N8N_WEBHOOK_URL = process.env.N8N_ITINERARY_GENERATE_URL || 'https://n8n.hugogotophilippines.com/webhook/itinerary-generate';
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

    // Vérifier l'authentification (optionnel mais recommandé)
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    // Préparer les données pour n8n
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

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n error:', errorText);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la génération des itinéraires' },
        { status: 500 }
      );
    }

    const result = await n8nResponse.json();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Erreur inconnue' },
        { status: 500 }
      );
    }

    // Retourner les aperçus (sans les itinéraires complets)
    return NextResponse.json({
      success: true,
      generation_id: result.generation_id,
      previews: result.previews,
    });

  } catch (error) {
    console.error('Itinerary generate error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
