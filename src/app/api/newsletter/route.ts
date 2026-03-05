import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Vous êtes déjà inscrit(e) !' }, { status: 200 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Inscription réussie !' }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    console.error('Newsletter subscription error:', error.message);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
