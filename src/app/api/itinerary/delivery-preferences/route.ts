import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
    }

    const body = await request.json();
    const { generation_id, email, delivery_email, delivery_telegram, delivery_pdf, telegram_chat_id } = body;

    if (!generation_id || !email) {
      return NextResponse.json({ error: 'generation_id et email requis' }, { status: 400 });
    }

    // Verify ownership
    const { data: generation } = await supabase
      .from('itinerary_generations')
      .select('id, user_id, payment_status')
      .eq('id', generation_id)
      .single();

    if (!generation || generation.user_id !== user.id) {
      return NextResponse.json({ error: 'Generation non trouvee' }, { status: 404 });
    }

    if (generation.payment_status !== 'completed') {
      return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });
    }

    // Upsert delivery preferences
    const { data, error } = await supabase
      .from('delivery_preferences')
      .upsert({
        generation_id,
        user_id: user.id,
        email,
        delivery_email: delivery_email ?? true,
        delivery_telegram: delivery_telegram ?? false,
        delivery_pdf: delivery_pdf ?? false,
        telegram_chat_id: telegram_chat_id || null,
        delivery_status: 'pending',
      }, {
        onConflict: 'generation_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Delivery preferences error:', error);
      return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
    }

    return NextResponse.json({ success: true, preferences: data });
  } catch (error) {
    console.error('Delivery preferences error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
