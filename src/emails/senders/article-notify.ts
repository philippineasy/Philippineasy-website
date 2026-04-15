// ---------------------------------------------------------------------------
// New article notification — send to newsletter subscribers
// ---------------------------------------------------------------------------
import type { SupabaseClient } from '@supabase/supabase-js';
import { sendNewArticleNotification } from './lifecycle';
import { getNewsletterUnsubscribeUrl } from '../unsubscribe';
import { BRAND } from '../config';
import { getMainCategoryPath } from '@/lib/utils';

export async function notifyNewArticle(
  supabase: SupabaseClient,
  title: string,
  slug: string,
  categoryId: number,
  imageUrl: string | null,
) {
  // Get category info to build the article URL
  const { data: category } = await supabase
    .from('categories')
    .select('slug, main_category')
    .eq('id', categoryId)
    .single();

  const mainPath = category ? getMainCategoryPath(category.main_category) : 'actualites-sur-les-philippines';
  const categorySlug = category?.slug || 'actualites';
  const articleUrl = `${BRAND.siteUrl}/${mainPath}/${categorySlug}/${slug}`;

  // Get all newsletter subscribers
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email');

  if (!subscribers || subscribers.length === 0) return;

  // Send to each subscriber (with rate limiting — max 50 at a time)
  for (const subscriber of subscribers) {
    const unsubscribeUrl = await getNewsletterUnsubscribeUrl(subscriber.email);

    await sendNewArticleNotification(
      subscriber.email,
      title,
      articleUrl,
      imageUrl,
      unsubscribeUrl,
    );

    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
