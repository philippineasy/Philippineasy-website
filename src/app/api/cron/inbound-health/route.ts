import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

// ---------------------------------------------------------------------------
// GET /api/cron/inbound-health — surveillance hebdomadaire du circuit inbound.
//
// Contexte : incident du 27/04→03/07/2026 — Resend a cessé de livrer les
// webhooks email.received pendant 2 mois en affichant « enabled » (2 emails
// perdus dont une réponse partenariat). Le statut du webhook ne prouve rien :
// seule une vérification de bout en bout fait foi.
//
// Fonctionnement (2 phases, sans attente serverless) :
//   1. VÉRIFIE que le probe envoyé au run précédent a bien été forwardé
//      (ligne email_log direction=inbound, subject [HEALTHCHECK]).
//      → Si absent : réarme le webhook Resend (toggle disabled→enabled,
//        le fix validé lors de l'incident) + alerte Telegram.
//   2. ENVOIE un nouveau probe vers contact@ pour le prochain run.
// ---------------------------------------------------------------------------

const RESEND_API = 'https://api.resend.com';
const PROBE_SUBJECT_PREFIX = '[HEALTHCHECK] inbound';
const INBOUND_WEBHOOK_ENDPOINT = 'https://philippineasy.com/api/webhooks/resend-inbound';

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  }).catch(() => {});
}

/** Réarme le circuit de livraison Resend (fix validé le 03/07/2026). */
async function rearmInboundWebhook(apiKey: string): Promise<boolean> {
  const list = await fetch(`${RESEND_API}/webhooks`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  }).then((r) => r.json()).catch(() => null);

  const webhook = list?.data?.find(
    (w: { endpoint?: string }) => w.endpoint === INBOUND_WEBHOOK_ENDPOINT,
  );
  if (!webhook?.id) return false;

  for (const status of ['disabled', 'enabled'] as const) {
    const res = await fetch(`${RESEND_API}/webhooks/${webhook.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return false;
  }
  return true;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY missing' }, { status: 500 });
  }

  const supabase = createServiceRoleClient();
  let previousProbeOk: boolean | null = null;
  let rearmed = false;

  // -- Phase 1 : le probe du run précédent est-il arrivé ? ------------------
  // On cherche un probe ÉMIS (outbound, loggé ici-même en phase 2) durant les
  // 8 derniers jours, puis sa contrepartie inbound forwardée.
  const { data: sentProbes } = await supabase
    .from('email_log')
    .select('subject, created_at')
    .eq('direction', 'outbound')
    .like('subject', `${PROBE_SUBJECT_PREFIX}%`)
    .gte('created_at', new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (sentProbes && sentProbes.length > 0) {
    const probe = sentProbes[0];
    const { data: received } = await supabase
      .from('email_log')
      .select('id')
      .eq('direction', 'inbound')
      .eq('subject', probe.subject)
      .gte('created_at', probe.created_at)
      .limit(1);

    previousProbeOk = !!(received && received.length > 0);

    if (!previousProbeOk) {
      rearmed = await rearmInboundWebhook(apiKey);
      await sendTelegram(
        `🚨 <b>Inbound email EN PANNE</b>\n` +
        `Le probe "${probe.subject}" n'a jamais été forwardé vers Gmail.\n` +
        `Les emails vers contact@philippineasy.com (dont le formulaire contact) sont perdus chez Resend.\n\n` +
        (rearmed
          ? `🔧 Webhook réarmé automatiquement (toggle). Vérification au prochain run — pense à récupérer les emails en attente via Resend → Emails → Receiving.`
          : `❌ Réarmement automatique ÉCHOUÉ — intervention manuelle requise (resend.com/webhooks).`),
      );
    }
  }

  // -- Phase 2 : envoyer le probe pour le prochain run ----------------------
  const stamp = new Date().toISOString().slice(0, 16);
  const subject = `${PROBE_SUBJECT_PREFIX} ${stamp}`;
  const sendRes = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'noreply@philippineasy.com',
      to: ['contact@philippineasy.com'],
      subject,
      html: '<p>Probe automatique du circuit inbound (cron inbound-health). Peut être supprimé ou filtré dans Gmail.</p>',
    }),
  });

  if (sendRes.ok) {
    // Loggé en outbound pour que le prochain run retrouve le probe émis.
    await supabase.from('email_log').insert({
      email_to: 'contact@philippineasy.com',
      email_from: 'noreply@philippineasy.com',
      subject,
      category: 'healthcheck',
      status: 'sent',
      direction: 'outbound',
    });
  }

  return NextResponse.json({
    previousProbeOk,
    rearmed,
    probeSent: sendRes.ok,
    subject,
  });
}
