/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    const now = new Date().toISOString();

    // Find profiles with expired manual premium that don't have an active Stripe subscription
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('plan', 'premium')
      .is('stripe_subscription_id', null)
      .lt('premium_expires_at', now);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userIds = profiles.map(p => p.id);
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', premium_expires_at: null })
        .in('id', userIds);

      if (updateError) {
        throw updateError;
      }

      return new Response(JSON.stringify({ message: `Revoked premium for ${userIds.length} users.` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ message: 'No expired premium users to revoke.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
