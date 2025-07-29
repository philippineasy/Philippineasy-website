import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createArticleFromN8n } from '@/services/articleService'; // This function will be created next

export async function POST(request: Request) {
  const supabase = createClient();

  // Basic API Key authentication
  const n8nApiKey = request.headers.get('X-N8N-API-Key');
  if (n8nApiKey !== process.env.N8N_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, slug, category_id, image_url, status, source_url } = await request.json();

    if (!title || !content || !slug || !category_id || !image_url || !status || !source_url) {
      return NextResponse.json({ error: 'Missing required fields, including source_url' }, { status: 400 });
    }

    // Assuming a default author for n8n ingested articles, or you can pass an author_id from n8n
    // For now, we'll use a placeholder or fetch a specific user.
    // In a real scenario, you might have a dedicated 'n8n_bot' user in your profiles table.
    const { data: defaultUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'n8n_bot') // Replace with an actual username for your n8n bot user
      .single();

    let author_id = null;
    if (defaultUser) {
      author_id = defaultUser.id;
    } else {
      console.warn("N8N_BOT user not found. Articles will be created without an author_id.");
      // Optionally, you could throw an error or assign to a generic admin user
    }

    const articleData = {
      title,
      content,
      slug,
      category_id,
      image: image_url,
      status,
      author_id, // Assign the fetched author_id
      source_url,
    };

    const { data: newArticle, error } = await createArticleFromN8n(supabase, articleData);

    if (error) {
      console.error('Error creating article from n8n:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Article created successfully', article: newArticle }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error processing n8n article ingestion:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
