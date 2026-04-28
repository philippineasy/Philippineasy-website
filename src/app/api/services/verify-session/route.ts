import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json();

    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json({ error: 'session_id requis' }, { status: 400 });
    }

    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const { data: purchase, error } = await supabase
      .from('service_purchases')
      .select('user_id, amount_paid, currency, service_type, status')
      .eq('stripe_checkout_session_id', session_id)
      .single();

    if (error || !purchase) {
      return NextResponse.json({ error: 'Achat non trouve' }, { status: 404 });
    }

    if (purchase.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      amount: Number(purchase.amount_paid) || 0,
      currency: (purchase.currency || 'EUR').toUpperCase(),
      service_type: purchase.service_type,
      status: purchase.status,
    });
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
