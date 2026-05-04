// ---------------------------------------------------------------------------
// Cron: recover-itineraries
// Schedule: 0 9 * * * (09:00 UTC = 11:00 Paris CEST — good morning slot)
// Trigger: Vercel Cron (see vercel.json)
//
// Sends up to 3 recovery emails for abandoned itinerary generations:
//   - Bucket 1 (24h): created 24h-72h ago, 24h email not yet sent
//   - Bucket 2 (72h): created 72h-7d ago, 72h email not yet sent
//   - Bucket 3 (7d):  created 7d-14d ago, 7d email not yet sent
//
// IDEMPOTENCY: Each row is "claimed" via an atomic UPDATE ... RETURNING
// before the email is sent. If two cron instances run concurrently, only
// the one that wins the UPDATE will send the email — the loser gets an
// empty RETURNING result and skips. This prevents double-sends.
//
// DURATION LABEL: Parsed from preferences.duration (e.g. "1-week" → "1 semaine")
// using the same DURATION_LABELS map as the frontend. Falls back to the raw
// string if the key is not recognized.
//
// OFFER TYPE / VARIANT: Defaults to 'express' / 'balanced' if absent in DB.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import {
  sendRecoveryEmail24h,
  sendRecoveryEmail72h,
  sendRecoveryEmail7d,
} from '@/emails/senders/itinerary-recovery';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Duration label map (mirrors itinerary-pricing.ts DURATION_LABELS)
// Defined here to avoid importing a client-side config in a server route.
// ---------------------------------------------------------------------------
const DURATION_LABELS: Record<string, string> = {
  '3-days':   '3-5 jours',
  '1-week':   '1 semaine',
  '10-days':  '10 jours',
  '2-weeks':  '2 semaines',
  '3-weeks':  '3 semaines',
  '1-month':  '1 mois',
  'more':     'Plus d\'un mois',
};

// Coupon code for email #2 — Hugo must create this in Stripe Dashboard.
// Code: RELANCE10 | Type: percentage | Value: 10% | Duration: once
// See final report for exact Stripe configuration steps.
const RECOVERY_COUPON_CODE = 'RELANCE10';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PendingGeneration {
  id: string;
  delivery_email: string;
  preferences: Record<string, string> | null;
  selected_variant: string | null;
  offer_type: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDurationLabel(preferences: Record<string, string> | null): string {
  const raw = preferences?.duration ?? '';
  return DURATION_LABELS[raw] ?? raw ?? 'non précisé';
}

function parseDestination(preferences: Record<string, string> | null): string {
  // The preferences JSONB does not have an explicit "destination" field —
  // all itineraries are for the Philippines. We enrich with the trip style
  // to make the email feel personal without fabricating data.
  const styleMap: Record<string, string> = {
    relax:     'Philippines (détente & plage)',
    adventure: 'Philippines (aventure & nature)',
    culture:   'Philippines (culture & histoire)',
    diving:    'Philippines (plongée)',
    mix:       'Philippines',
  };
  const style = preferences?.tripStyle ?? '';
  return styleMap[style] ?? 'Philippines';
}

function parseOfferType(raw: string | null): 'express' | 'premium' | 'conciergerie' {
  if (raw === 'premium' || raw === 'conciergerie') return raw;
  return 'express';
}

function parseVariant(raw: string | null): string {
  if (raw === 'relax' || raw === 'adventure') return raw;
  return 'balanced';
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date();

  const results = {
    sent_24h: 0,
    sent_72h: 0,
    sent_7d: 0,
    errors: 0,
  };

  // ── Helper: atomically claim a row by setting the sent_at column ──────────
  // Returns true if we claimed the row (i.e. the UPDATE touched exactly 1 row).
  // Returns false if another instance already claimed it (UPDATE matched 0 rows).
  async function claimRow(id: string, column: string): Promise<boolean> {
    const { data } = await supabase
      .from('itinerary_generations')
      .update({ [column]: now.toISOString() })
      .eq('id', id)
      .is(column, null) // only update if not already claimed
      .select('id');
    return Array.isArray(data) && data.length > 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUCKET 1: created 24h–72h ago, 24h email not yet sent
  // ─────────────────────────────────────────────────────────────────────────
  const bucket1Start = new Date(now.getTime() - 72 * 60 * 60 * 1000); // 72h ago
  const bucket1End   = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago

  const { data: bucket1Rows, error: bucket1Error } = await supabase
    .from('itinerary_generations')
    .select('id, delivery_email, preferences, selected_variant, offer_type, created_at')
    .eq('payment_status', 'pending')
    .is('recovery_email_24h_sent_at', null)
    .not('delivery_email', 'is', null)
    .gte('created_at', bucket1Start.toISOString())
    .lt('created_at', bucket1End.toISOString())
    .limit(50); // safety cap per cron tick

  if (bucket1Error) {
    console.error('[cron/recover-itineraries] Bucket 1 query error:', bucket1Error.message);
  }

  for (const row of (bucket1Rows ?? []) as PendingGeneration[]) {
    const claimed = await claimRow(row.id, 'recovery_email_24h_sent_at');
    if (!claimed) continue; // another instance got there first

    try {
      await sendRecoveryEmail24h({
        to: row.delivery_email,
        generationId: row.id,
        destination: parseDestination(row.preferences),
        durationLabel: parseDurationLabel(row.preferences),
        offerType: parseOfferType(row.offer_type),
        variant: parseVariant(row.selected_variant),
      });
      results.sent_24h++;
    } catch (err) {
      console.error(`[cron/recover-itineraries] Email #1 failed for ${row.id}:`, err);
      results.errors++;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUCKET 2: created 72h–7d ago, 72h email not yet sent
  // ─────────────────────────────────────────────────────────────────────────
  const bucket2Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7d ago
  const bucket2End   = bucket1Start; // = 72h ago

  const { data: bucket2Rows, error: bucket2Error } = await supabase
    .from('itinerary_generations')
    .select('id, delivery_email, preferences, selected_variant, offer_type, created_at')
    .eq('payment_status', 'pending')
    .is('recovery_email_72h_sent_at', null)
    .not('delivery_email', 'is', null)
    .gte('created_at', bucket2Start.toISOString())
    .lt('created_at', bucket2End.toISOString())
    .limit(50);

  if (bucket2Error) {
    console.error('[cron/recover-itineraries] Bucket 2 query error:', bucket2Error.message);
  }

  for (const row of (bucket2Rows ?? []) as PendingGeneration[]) {
    const claimed = await claimRow(row.id, 'recovery_email_72h_sent_at');
    if (!claimed) continue;

    try {
      await sendRecoveryEmail72h({
        to: row.delivery_email,
        generationId: row.id,
        destination: parseDestination(row.preferences),
        durationLabel: parseDurationLabel(row.preferences),
        offerType: parseOfferType(row.offer_type),
        variant: parseVariant(row.selected_variant),
        couponCode: RECOVERY_COUPON_CODE,
      });
      results.sent_72h++;
    } catch (err) {
      console.error(`[cron/recover-itineraries] Email #2 failed for ${row.id}:`, err);
      results.errors++;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUCKET 3: created 7d–14d ago, 7d email not yet sent
  // ─────────────────────────────────────────────────────────────────────────
  const bucket3Start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14d ago
  const bucket3End   = bucket2Start; // = 7d ago

  const { data: bucket3Rows, error: bucket3Error } = await supabase
    .from('itinerary_generations')
    .select('id, delivery_email, preferences, selected_variant, offer_type, created_at')
    .eq('payment_status', 'pending')
    .is('recovery_email_7d_sent_at', null)
    .not('delivery_email', 'is', null)
    .gte('created_at', bucket3Start.toISOString())
    .lt('created_at', bucket3End.toISOString())
    .limit(50);

  if (bucket3Error) {
    console.error('[cron/recover-itineraries] Bucket 7d query error:', bucket3Error.message);
  }

  for (const row of (bucket3Rows ?? []) as PendingGeneration[]) {
    const claimed = await claimRow(row.id, 'recovery_email_7d_sent_at');
    if (!claimed) continue;

    try {
      await sendRecoveryEmail7d({
        to: row.delivery_email,
        generationId: row.id,
        destination: parseDestination(row.preferences),
        durationLabel: parseDurationLabel(row.preferences),
        offerType: parseOfferType(row.offer_type),
        variant: parseVariant(row.selected_variant),
      });
      results.sent_7d++;
    } catch (err) {
      console.error(`[cron/recover-itineraries] Email #3 failed for ${row.id}:`, err);
      results.errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: now.toISOString(),
    ...results,
  });
}
