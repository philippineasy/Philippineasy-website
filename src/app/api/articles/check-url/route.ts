import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .eq('source_url', url)
      .maybeSingle(); // Use maybeSingle() to avoid error if no row is found

    if (error) {
      console.error('Error checking URL:', error);
      throw error;
    }

    return NextResponse.json({ exists: data !== null });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
