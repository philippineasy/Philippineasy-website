import type { SupabaseClient } from '@supabase/supabase-js';

export const getNotifications = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      id,
      created_at,
      type,
      is_read,
      actor_id,
      link,
      topic:forum_topics!topic_id(title, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data;
};

export const markAsRead = async (supabase: SupabaseClient, notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
  }
  return { success: !error };
};

export const markAllAsRead = async (supabase: SupabaseClient, userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  
    if (error) {
      console.error('Error marking all notifications as read:', error);
    }
    return { success: !error };
};

export const getUnreadNotificationCount = async (supabase: SupabaseClient, userId: string) => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  
    if (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
    return count || 0;
};
