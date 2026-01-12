import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Utilisateur non connecté = prix standard
      return NextResponse.json({
        price: 9.99,
        is_free: false,
        credits_remaining: 0,
        is_premium: false,
        is_authenticated: false,
      });
    }

    // Appeler la fonction SQL pour vérifier les crédits
    const { data, error } = await supabase
      .rpc('check_itinerary_price', { p_user_id: user.id });

    if (error) {
      console.error('Error checking credits:', error);
      // Fallback: prix standard
      return NextResponse.json({
        price: 9.99,
        is_free: false,
        credits_remaining: 0,
        is_premium: false,
        is_authenticated: true,
      });
    }

    const result = data?.[0] || {
      price: 9.99,
      is_free: false,
      credits_remaining: 0,
      is_premium: false,
    };

    return NextResponse.json({
      ...result,
      is_authenticated: true,
    });

  } catch (error) {
    console.error('Check credits error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
