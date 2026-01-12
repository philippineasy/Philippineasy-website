import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const N8N_DELIVER_URL = process.env.N8N_ITINERARY_DELIVER_URL || 'https://n8n.hugogotophilippines.com/webhook/itinerary-deliver';
const N8N_API_KEY = process.env.N8N_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generation_id, delivery_method, email, telegram_chat_id } = body;

    if (!generation_id || !delivery_method) {
      return NextResponse.json(
        { error: 'generation_id et delivery_method requis' },
        { status: 400 }
      );
    }

    if (delivery_method === 'email' && !email) {
      return NextResponse.json(
        { error: 'Email requis pour la livraison par email' },
        { status: 400 }
      );
    }

    if (delivery_method === 'telegram' && !telegram_chat_id) {
      return NextResponse.json(
        { error: 'Chat ID Telegram requis' },
        { status: 400 }
      );
    }

    // Vérifier que la génération existe et est payée
    const supabase = await createClientForRouteHandler();
    const { data: generation, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', generation_id)
      .single();

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      );
    }

    if (generation.payment_status !== 'completed') {
      return NextResponse.json(
        { error: 'Paiement requis avant la livraison' },
        { status: 403 }
      );
    }

    // Appeler le webhook n8n pour la livraison
    const n8nPayload = {
      generation_id,
      selected_variant: generation.selected_variant,
      delivery_method,
      email: email || null,
      telegram_chat_id: telegram_chat_id || null,
    };

    const n8nResponse = await fetch(N8N_DELIVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-Key': N8N_API_KEY || '',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      console.error('n8n deliver error:', await n8nResponse.text());
      return NextResponse.json(
        { error: 'Erreur lors de la livraison' },
        { status: 500 }
      );
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      success: true,
      google_maps_url: result.google_maps_url,
      alarms_data: result.alarms_data,
    });

  } catch (error) {
    console.error('Deliver error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
