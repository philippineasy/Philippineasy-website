import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { payment_intent_id } = await request.json();

    if (!payment_intent_id || typeof payment_intent_id !== 'string') {
      return NextResponse.json({ error: 'payment_intent_id requis' }, { status: 400 });
    }

    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, user_id, total_amount, status')
      .eq('stripe_payment_intent_id', payment_intent_id)
      .single();

    if (error || !order) {
      // Webhook peut ne pas avoir cree la ligne immediatement; on retourne success=false
      // pour permettre au front d'afficher la confirmation sans bloquer.
      return NextResponse.json({ success: false, error: 'Commande non encore traitee' });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: Number(order.total_amount) || 0,
      currency: 'EUR',
      status: order.status,
    });
  } catch (error) {
    console.error('Verify order payment error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
