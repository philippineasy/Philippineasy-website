import type { SupabaseClient } from '@supabase/supabase-js';

export const getForumCategories = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('forum_categories_with_stats')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching forum categories:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getForumCategoryBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('forum_categories')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching forum category by slug ${slug}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getTopicsByCategorySlug = async (supabase: SupabaseClient, slug: string, page: number = 1, limit: number = 15) => {
    const from = (page - 1) * limit;

    const { data, error } = await supabase
        .rpc('get_topics_with_preview', {
            p_category_slug: slug,
            p_limit: limit,
            p_offset: from
        });

    if (error) {
        console.error(`Error fetching topics for category slug ${slug}:`, error);
        return { data: null, error };
    }

    return { data, error: null };
};

export const getTopicBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('forum_topics_with_stats')
        .select('*, category:forum_categories(id, name, slug)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching topic by slug ${slug}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getAllTopics = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('forum_topics')
        .select('slug, updated_at, category:forum_categories(slug)');

    if (error) {
        console.error('Error fetching all topics:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getPostsByTopicId = async (supabase: SupabaseClient, topicId: number) => {
    const { data, error } = await supabase
        .from('forum_posts')
        .select('*, author:profiles(*)')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error(`Error fetching posts for topic ${topicId}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const addForumTopic = async (supabase: SupabaseClient, categoryId: number, userId: string, title: string, content: string) => {
    const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    
    const { data, error } = await supabase
        .rpc('create_topic_with_post', {
            p_category_id: categoryId,
            p_user_id: userId,
            p_title: title,
            p_content: content,
            p_slug: slug
        })
        .single();

    if (error) {
        console.error('Error creating topic with post:', error);
        return { data: null, error };
    }

    // The RPC function returns an object with the slug, e.g., { topic_slug: '...' }
    return { data: { topicSlug: (data as any).topic_slug }, error: null };
};

export const addForumPost = async (supabase: SupabaseClient, topicId: number, userId: string, content: string) => {
    const { data, error } = await supabase
        .from('forum_posts')
        .insert({ topic_id: topicId, user_id: userId, content: content })
        .select('*, author:profiles(*)')
        .single();

    if (error) {
        console.error('Error creating post:', error);
        return { data: null, error };
    }

    return { data, error: null };
};

export const updateForumPost = async (supabase: SupabaseClient, postId: number, content: string) => {
    const { data, error } = await supabase
        .from('forum_posts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .select()
        .single();
    
    return { data, error };
};

export const deleteForumPost = async (supabase: SupabaseClient, postId: number) => {
    const { data, error } = await supabase.from('forum_posts').delete().eq('id', postId).select();
    return { data, error };
};

export const deleteForumTopic = async (supabase: SupabaseClient, topicId: number) => {
    const { data, error } = await supabase.from('forum_topics').delete().eq('id', topicId).select();
    return { data, error };
};

export const lockForumTopic = async (supabase: SupabaseClient, topicId: number, is_locked: boolean) => {
    const { data, error } = await supabase.from('forum_topics').update({ is_locked }).eq('id', topicId).select();
    return { data, error };
};

export const pinForumTopic = async (supabase: SupabaseClient, topicId: number, is_pinned: boolean) => {
    const { data, error } = await supabase.from('forum_topics').update({ is_pinned }).eq('id', topicId).select();
    return { data, error };
};

export const updateForumCategory = async (supabase: SupabaseClient, categoryId: number, updates: Record<string, any>) => {
    const { data, error } = await supabase.from('forum_categories').update(updates).eq('id', categoryId).select();
    return { data, error };
};

export const deleteForumCategory = async (supabase: SupabaseClient, categoryId: number) => {
    const { data, error } = await supabase.from('forum_categories').delete().eq('id', categoryId).select();
    return { data, error };
};

export const updateTopicDetails = async (supabase: SupabaseClient, topicId: number, updates: Record<string, any>) => {
    const { data, error } = await supabase
        .from('forum_topics')
        .update(updates)
        .eq('id', topicId)
        .select()
        .single();
    
    return { data, error };
};

export const getTopicsByUserId = async (supabase: SupabaseClient, userId: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('title, slug')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user topics:', error);
    return { data: null, error };
  }
  return { data, error: null };
};

export const getRecentTopics = async (supabase: SupabaseClient, limit: number = 2) => {
    const { data, error } = await supabase
        .from('forum_topics')
        .select('*, author:profiles(username), category:forum_categories(name, slug)')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent topics:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getPostsByUserId = async (supabase: SupabaseClient, userId: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, content, topic:forum_topics(title, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user posts:', error);
    return { data: null, error };
  }
  return { data, error: null };
};
