import type { SupabaseClient } from '@supabase/supabase-js';

export const getOrdersByUserId = async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders by user ID:', error);
        return { data: null, error };
    }
    return { data, error: null };
};
