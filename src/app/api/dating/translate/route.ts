import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { getDatingGateStatus } from '@/services/userService';
import { DATING_CONFIG } from '@/config/dating';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

const N8N_WEBHOOK_URL = process.env.N8N_DATING_TRANSLATE_URL || 'https://n8n.adascanpro.com/webhook/dating-translate';
const N8N_API_KEY = process.env.N8N_API_KEY;
const UPSTREAM_TIMEOUT_MS = 15000;
const MAX_TEXT_LENGTH = 900;
const VALID_TARGETS = ['fr', 'en', 'tl'] as const;
type Target = (typeof VALID_TARGETS)[number];

const FREE_DAILY_LIMIT = DATING_CONFIG.free_plan.translation_daily_limit;

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
    }

    const { text: rawText, target: rawTarget } = (body ?? {}) as { text?: unknown; target?: unknown };
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    const target = rawTarget as Target;

    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: 'invalid_text' }, { status: 400 });
    }
    if (!VALID_TARGETS.includes(target)) {
      return NextResponse.json({ error: 'invalid_target' }, { status: 400 });
    }

    // Auth + dating gate — meme garde que les pages chat (profil valide requis)
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const gateStatus = await getDatingGateStatus(supabase, user.id);
    if (gateStatus !== 'validated') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { data: callerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('[dating/translate] failed to load caller plan', profileError);
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    const isPremium = callerProfile?.plan === 'premium';

    // Quota gratuit : claim atomique via RPC service_role (insert-or-increment
    // + retour du compteur en un aller-retour, pas de race entre requetes
    // concurrentes). Premium bypasse entierement cette table.
    if (!isPremium) {
      const serviceRole = createServiceRoleClient();
      const { data: newCount, error: quotaError } = await serviceRole.rpc(
        'increment_dating_translation_usage',
        { p_user_id: user.id }
      );

      if (quotaError) {
        console.error('[dating/translate] quota claim error', quotaError);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
      }

      if (typeof newCount === 'number' && newCount > FREE_DAILY_LIMIT) {
        return NextResponse.json({ error: 'quota', limit: FREE_DAILY_LIMIT }, { status: 429 });
      }
    }

    // Proxy vers le webhook n8n, timeout 15s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    let upstreamResponse: Response;
    try {
      upstreamResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-Key': N8N_API_KEY || '',
        },
        body: JSON.stringify({ text, target }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      console.error('[dating/translate] upstream fetch failed', fetchError);
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    } finally {
      clearTimeout(timeoutId);
    }

    const rawUpstreamText = await upstreamResponse.text();

    if (!upstreamResponse.ok || !rawUpstreamText) {
      console.error(
        '[dating/translate] upstream non-200 or empty body',
        upstreamResponse.status,
        rawUpstreamText?.slice(0, 300)
      );
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    }

    let result: { detected?: string; translation?: string; error?: string };
    try {
      result = JSON.parse(rawUpstreamText);
    } catch {
      console.error('[dating/translate] upstream returned invalid JSON', rawUpstreamText.slice(0, 300));
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    }

    if (result.error || typeof result.translation !== 'string') {
      console.error('[dating/translate] upstream reported failure', result);
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    }

    return NextResponse.json({
      detected: typeof result.detected === 'string' ? result.detected : null,
      translation: result.translation,
    });
  } catch (error) {
    console.error('[dating/translate] unexpected error', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
