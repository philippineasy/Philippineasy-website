'use server';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { 
    addForumPost as addForumPostService,
    addForumTopic as addForumTopicService,
    getTopicsByCategorySlug as getTopicsByCategorySlugService,
    updateTopicDetails as updateTopicDetailsService,
    updateForumPost as updateForumPostService,
} from '@/services/forumService';

/**
 * Server Action to add a new post to a topic and revalidate relevant caches.
 * @param topicId The ID of the topic.
 * @param userId The ID of the user posting.
 * @param content The content of the post.
 * @returns The result of the add post operation.
 */
export async function addPostAndRevalidate(topicId: number, userId: string, content: string) {
    const supabase = await createClient();
    const { data, error } = await addForumPostService(supabase, topicId, userId, content);

    if (!error) {
        // Revalidate the cache for the posts of this specific topic
        revalidateTag('forum_posts'); 
        // Revalidate the list of topics, as last activity has changed
        revalidateTag('forum_topics_list');
        console.log(`Revalidated tags: 'forum_posts' and 'forum_topics_list'`);
    }

    return { success: !error, data, error };
}

/**
 * Server Action to add a new topic and revalidate relevant caches.
 * @param categoryId The ID of the category.
 * @param userId The ID of the user creating the topic.
 * @param title The title of the topic.
 * @param content The initial content of the topic.
 * @returns The result of the add topic operation.
 */
export async function addTopicAndRevalidate(categoryId: number, userId: string, title: string, content: string) {
    const supabase = await createClient();
    const { data, error } = await addForumTopicService(supabase, categoryId, userId, title, content);

    if (!error) {
        // Revalidate the list of topics
        revalidateTag('forum_topics_list');
        console.log(`Revalidated tag: 'forum_topics_list'`);
    }

    return { success: !error, data, error };
}

// TODO: Add other server actions for update, delete, pin, lock operations,
// each calling the corresponding service and revalidating the appropriate tags.

/**
 * Server Action to safely call the cached getTopicsByCategorySlug function from the client.
 * @param slug The slug of the category.
 * @param page The page number.
 * @param limit The number of items per page.
 * @returns The topics data.
 */
export async function getTopicsByCategorySlugAction(slug: string, page: number = 1, limit: number = 15) {
    const supabase = await createClient();
    const { data, error } = await getTopicsByCategorySlugService(supabase, slug, page, limit);
    
    if (error) {
        return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
}

export async function updateTopicAction(topicId: number, postId: number, title: string, content: string) {
    const supabase = await createClient();

    const topicUpdateResult = await updateTopicDetailsService(supabase, topicId, { title });
    if (topicUpdateResult.error) {
        return { success: false, error: `Failed to update topic title: ${topicUpdateResult.error.message}` };
    }

    const postUpdateResult = await updateForumPostService(supabase, postId, content);
    if (postUpdateResult.error) {
        return { success: false, error: `Failed to update topic content: ${postUpdateResult.error.message}` };
    }

    revalidateTag('forum_topics_list');
    revalidateTag('forum_posts');

    return { success: true };
}
