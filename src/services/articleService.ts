import type { SupabaseClient } from '@supabase/supabase-js';
import { uploadArticleThumbnail } from './uploadService';
import { getRecentTopics } from './forumService';
import { EditorJSContent, ArticleCreate, ArticleUpdate, HomepageItem, Article, ForumTopic } from '@/types';

const ARTICLE_WITH_CATEGORY_SELECT = '*, category:categories(*)';

// Function to calculate reading time
const calculateReadingTime = (content: EditorJSContent): number => {
  if (!content || !content.blocks) return 0;

  const wordsPerMinute = 200;
  const text = content.blocks
    .filter(block => block.type === 'paragraph' || block.type === 'header')
    .map(block => block.data.text)
    .join(' ');

  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

export const getArticles = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('articles')
        .select(ARTICLE_WITH_CATEGORY_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getArticleBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*), author:profiles(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching article by slug: ${slug}`, error);
        return { data: null, error };
    }


    return { data, error: null };
};

export const getArticlesByCategorySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories!inner(*)')
        .eq('category.slug', slug)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        console.error(`Error fetching articles by category slug: ${slug}`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const searchArticles = async (supabase: SupabaseClient, query: string) => {
    const { data, error } = await supabase
        .from('articles')
        .select(ARTICLE_WITH_CATEGORY_SELECT)
        .textSearch('fts', query)
        .eq('status', 'published');

    if (error) {
        console.error('Error searching articles:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getAllArticlesForAdmin = async (supabase: SupabaseClient, categoryId?: number) => {
    let query = supabase
        .from('articles')
        .select('*, author:profiles(username), category:categories(id, name, slug, main_category)');

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching all articles for admin:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const deleteArticle = async (supabase: SupabaseClient, articleId: number) => {
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    if (error) {
        console.error(`Error deleting article ${articleId}:`, error);
    }
    return { error };
};

export const createArticle = async (supabase: SupabaseClient, articleData: ArticleCreate, imageFile: File) => {
    try {
        // 1. Upload image
        const imageUrl = await uploadArticleThumbnail(supabase, imageFile);
        if (!imageUrl) {
            throw new Error("Échec du téléversement de l'image de l'article.");
        }

        // 2. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Utilisateur non authentifié.");
        }

        // 3. Calculate reading time
        const reading_time = calculateReadingTime(articleData.content);

        // 4. Create article
        const { data, error } = await supabase
            .from('articles')
            .insert({
                ...articleData,
                image: imageUrl,
                author_id: user.id,
                reading_time,
                source: 'website', // Explicitly set source for website creations
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Error creating article:', error);
        return { data: null, error };
    }
};

export const updateArticle = async (supabase: SupabaseClient, articleId: number, updates: ArticleUpdate, imageFile: File | null) => {
    try {
        const updateData: ArticleUpdate = { ...updates };

        if (imageFile && imageFile.size > 0) {
            const newImageUrl = await uploadArticleThumbnail(supabase, imageFile);
            if (!newImageUrl) {
                throw new Error("Échec du téléversement de la nouvelle image.");
            }
            updateData.image = newImageUrl;
        }

        // Recalculate reading time if content is updated
        if (updates.content) {
            updateData.reading_time = calculateReadingTime(updates.content);
        }
        
        if (Object.keys(updateData).length === 0) {
            const { data: currentData, error: currentError } = await supabase.from('articles').select(ARTICLE_WITH_CATEGORY_SELECT).eq('id', articleId).single();
            return { data: currentData, error: currentError };
        }

        const { data, error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', articleId)
            .select(ARTICLE_WITH_CATEGORY_SELECT)
            .single();

        if (error) {
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error(`Error updating article ${articleId}:`, error);
        return { data: null, error };
    }
};

export const createArticleFromN8n = async (supabase: SupabaseClient, articleData: {
    title: string;
    content: Record<string, any>; // Editor.js OutputData
    slug: string;
    category_id: number;
    image: string; // URL of the image
    status: string;
    author_id: string | null;
    source_url: string; // Add source_url to the type definition
}) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .insert({
                title: articleData.title,
                content: articleData.content,
                slug: articleData.slug,
                category_id: articleData.category_id,
                image: articleData.image,
                status: articleData.status,
                author_id: articleData.author_id,
                source: 'n8n', // Set source to 'n8n'
                source_url: articleData.source_url, // Insert the original URL
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Error creating article from n8n:', error);
        return { data: null, error };
    }
};

export const getHomepageArticles = async (supabase: SupabaseClient) => {
    try {
        // Hardcoded category IDs for performance
        const bestDealsCategoryIds = [14, 15, 16, 17];
        const newsCategoryIds = [11];

        // Setup queries
        const bestDealsQuery = supabase
            .from('articles')
            .select(ARTICLE_WITH_CATEGORY_SELECT)
            .in('category_id', bestDealsCategoryIds)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(3);

        const newsQuery = supabase
            .from('articles')
            .select(ARTICLE_WITH_CATEGORY_SELECT)
            .in('category_id', newsCategoryIds)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(2);
        
        const topicsQuery = getRecentTopics(supabase, 2);

        // Execute all queries in parallel
        const [bestDealsResult, newsResult, topicsResult] = await Promise.all([
            bestDealsQuery,
            newsQuery,
            topicsQuery
        ]);

        if (bestDealsResult.error || newsResult.error || topicsResult.error) {
            console.error('Error fetching homepage data:', bestDealsResult.error || newsResult.error || topicsResult.error);
            return { bestDeals: [], featuredItems: [] };
        }

        // Add type discriminant and sort_date to each item
        const newsItems: HomepageItem[] = (newsResult.data || []).map(item => ({
            ...(item as Article),
            type: 'article',
            sort_date: item.published_at
        }));

        const topicItems: HomepageItem[] = (topicsResult.data || []).map(item => ({
            ...(item as ForumTopic),
            type: 'topic',
            sort_date: item.created_at
        }));

        // Combine and sort
        const featuredItems = [...newsItems, ...topicItems]
            .sort((a, b) => new Date(b.sort_date).getTime() - new Date(a.sort_date).getTime());

        return {
            bestDeals: bestDealsResult.data || [],
            featuredItems: featuredItems,
        };

    } catch (error) {
        console.error('Exception in getHomepageArticles:', error);
        return { bestDeals: [], featuredItems: [] };
    }
};

export const getRelatedArticles = async (supabase: SupabaseClient, categoryId: number, currentArticleId: number) => {
    const { data, error } = await supabase
        .from('articles')
        .select(ARTICLE_WITH_CATEGORY_SELECT)
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .neq('id', currentArticleId) // Exclude the current article
        .order('published_at', { ascending: false })
        .limit(4); // Get 4 related articles

    if (error) {
        console.error('Error fetching related articles:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const recordArticleView = async (supabase: SupabaseClient, articleId: number, userId: string | null) => {
    const { error } = await supabase.from('article_views').insert({
        article_id: articleId,
        user_id: userId,
    });

    if (error) {
        console.error('Error recording article view:', error);
    }
};

export const getArticleAnalytics = async (supabase: SupabaseClient, timeRange: 'week' | 'month' = 'week') => {
    const { data, error } = await supabase.rpc('get_article_analytics', { time_range: timeRange });

    if (error) {
        console.error('Error fetching article analytics:', error);
        return { data: null, error };
    }

    return { data, error: null };
};
