// ---------------------------------------------------------------------------
// Itinerary recovery emails -- cart abandonment sequence
// Triggered by the /api/cron/recover-itineraries cron (3 stages).
//
// Email #1 -- 24-72h  : value reminder, soft "your itinerary is waiting"
// Email #2 -- 72h-7d  : soft incentive (-10% coupon RELANCE10, 24h validity)
// Email #3 -- 7d-14d  : last call, warm farewell, human touch
//
// Design principles applied (email-sequence SKILL):
//   - One Email One Job: each email has a single primary CTA
//   - Value Before Ask: remind them of what they built, not what they owe us
//   - Clear Path Forward: every email links directly to the resume_payment flow
//
// Copy principles applied (copywriting + marketing-psychology SKILLs):
//   - Zeigarnik Effect: open loop -- they started something, we remind them gently
//   - Endowment Effect: "your" itinerary -- they own it mentally
//   - Loss Aversion (email #3): soft deletion warning, not aggressive pressure
//   - Philippineasy positioning: guide francophone, accompaniment -- never an agency
// ---------------------------------------------------------------------------

import { buildEmailHtml } from '../templates/base';
import { emailHighlightBox, emailInfoBox, emailDivider, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecoveryEmailBase {
  /** Recipient email address */
  to: string;
  /** Optional display name (can be undefined for anonymous users) */
  userName?: string;
  /** UUID of the itinerary_generations row */
  generationId: string;
  /** Human-readable destination label */
  destination: string;
  /** Human-readable duration label, e.g. "1 semaine" */
  durationLabel: string;
  /** Offer type -- defaults to 'express' if absent in the DB row */
  offerType: 'express' | 'premium' | 'conciergerie';
  /** Selected variant -- defaults to 'balanced' if absent */
  variant: string;
}

interface RecoveryEmail72hParams extends RecoveryEmailBase {
  /** Stripe coupon code to display in email #2 */
  couponCode: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const OFFER_DISPLAY_NAMES: Record<string, string> = {
  express: 'Express',
  premium: 'Premium',
  conciergerie: 'Conciergerie',
};

function buildResumeUrl(
  generationId: string,
  offerType: string,
  variant: string,
  utmCampaign: string
): string {
  const base = `${BRAND.siteUrl}/itineraire-personnalise-pour-les-philippines`;
  const params = new URLSearchParams({
    resume_payment: generationId,
    offer: offerType,
    variant,
    utm_source: 'email',
    utm_medium: 'recovery',
    utm_campaign: utmCampaign,
  });
  return `${base}?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Email #1 -- 24-72h after abandonment
// Job: Remind them their itinerary is ready. Value reminder, zero pressure.
// Psychology: Endowment Effect (it is "theirs") + Zeigarnik (open loop).
// Subject: 44 chars, warm, no urgency word.
// ---------------------------------------------------------------------------

export async function sendRecoveryEmail24h(
  params: RecoveryEmailBase
): Promise<{ success: boolean; error?: string }> {
  const { to, userName, generationId, destination, durationLabel, offerType, variant } = params;

  const resumeUrl = buildResumeUrl(generationId, offerType, variant, 'relance_24h');
  const offerName = OFFER_DISPLAY_NAMES[offerType] ?? 'Express';

  const bodyHtml = [
    `<p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:${BRAND.text};">`,
    `  Vous avez configure un itineraire aux Philippines il y a quelques heures &mdash;`,
    `  et on l&apos;a garde de cote pour vous.`,
    `</p>`,
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:0 0 20px;color:${BRAND.text};">`,
    `  Trois versions de votre voyage ont ete preparees : une orientee detente, une equilibree,`,
    `  une pour les aventuriers. Elles attendent juste que vous choisissiez laquelle vous convient`,
    `  le mieux, et que vous finalisiez en quelques secondes.`,
    `</p>`,
    ``,
    emailInfoBox([
      { label: 'Destination', value: destination },
      { label: 'Duree', value: durationLabel },
      { label: 'Formule', value: offerName },
    ]),
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:16px 0 0;color:${BRAND.text};">`,
    `  Philippin&apos;Easy est un guide francophone independant &mdash; pas une agence de voyage.`,
    `  Nos itineraires IA sont construits a partir de centaines d&apos;experiences de voyageurs`,
    `  aux Philippines, et affines selon vos preferences exactes.`,
    `</p>`,
    ``,
    emailDivider(),
    ``,
    emailMutedText(
      'Des questions avant de vous decider ? Repondez simplement a cet email &mdash; on lit tout.'
    ),
  ].join('\n');

  const html = buildEmailHtml({
    title: 'Votre itineraire Philippines vous attend',
    preheader: `Trois versions de votre voyage ${destination} sont pretes -- il ne reste qu'un clic pour les debloquer.`,
    userName,
    bodyHtml,
    ctaText: 'Voir mon itineraire',
    ctaUrl: resumeUrl,
  });

  return sendEmail({
    to,
    from: 'itineraire',
    subject: 'Votre itineraire Philippines vous attend',
    html,
    category: 'transactional',
  });
}

// ---------------------------------------------------------------------------
// Email #2 -- 72h-7d after abandonment
// Job: Soft nudge with a -10% coupon to reduce price friction.
// Psychology: Gift framing (reciprocity), Rule of 100 (percentage beats absolute
//   for prices under 100 -- 10% off > -1 EUR on a 9.99 EUR product).
// Note: coupon RELANCE10 must be created manually in Stripe Dashboard.
//   Type: percentage | Value: 10% | Duration: once | No max_redemptions needed.
// ---------------------------------------------------------------------------

export async function sendRecoveryEmail72h(
  params: RecoveryEmail72hParams
): Promise<{ success: boolean; error?: string }> {
  const {
    to, userName, generationId, destination, durationLabel, offerType, variant, couponCode,
  } = params;

  const resumeUrl = buildResumeUrl(generationId, offerType, variant, 'relance_72h');
  const offerName = OFFER_DISPLAY_NAMES[offerType] ?? 'Express';

  const bodyHtml = [
    `<p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:${BRAND.text};">`,
    `  Votre itineraire ${destination} est toujours la, intact.`,
    `  On sait que passer le cap du paiement n&apos;est pas toujours facile &mdash;`,
    `  surtout quand on n&apos;est pas encore sur a 100% de son voyage.`,
    `</p>`,
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:0 0 16px;color:${BRAND.text};">`,
    `  Pour vous donner un coup de pouce, voici un code de reduction de 10% valable 24h :`,
    `</p>`,
    ``,
    emailHighlightBox(
      `<strong style="font-size:18px;letter-spacing:2px;">${couponCode}</strong><br>` +
      `<span style="font-size:13px;margin-top:4px;display:block;">&minus;10% sur votre itineraire ${offerName} &mdash; valable jusqu&apos;a demain.</span>`,
      'success'
    ),
    ``,
    emailInfoBox([
      { label: 'Destination', value: destination },
      { label: 'Duree', value: durationLabel },
      { label: 'Formule', value: offerName },
    ]),
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:16px 0 0;color:${BRAND.text};">`,
    `  Le code est applique automatiquement lors de votre paiement Stripe &mdash;`,
    `  pas besoin de le recopier manuellement.`,
    `</p>`,
    ``,
    emailDivider(),
    ``,
    emailMutedText(
      'Vous avez une question sur ce que comprend l&apos;offre, ou sur les Philippines en general ?' +
      ' Repondez a cet email, on est la.'
    ),
  ].join('\n');

  const html = buildEmailHtml({
    title: 'Un petit cadeau pour finaliser votre voyage',
    preheader: `Code ${couponCode} : -10% sur votre itineraire ${destination}, valable 24h.`,
    userName,
    bodyHtml,
    ctaText: "Profiter de l'offre",
    ctaUrl: resumeUrl,
  });

  return sendEmail({
    to,
    from: 'itineraire',
    subject: 'Un petit cadeau pour finaliser votre voyage',
    html,
    category: 'transactional',
  });
}

// ---------------------------------------------------------------------------
// Email #3 -- 7d-14d after abandonment
// Job: Last call. Warm, human, no aggression. Soft loss-aversion on data deletion.
// Psychology: Loss Aversion (soft data cleanup framing) + Personal Touch (Hugo).
// Tone: honest, not dramatic. "On libere de la place" not "NOW OR NEVER".
// After 14 days: no more emails sent, row stays in DB.
// ---------------------------------------------------------------------------

export async function sendRecoveryEmail7d(
  params: RecoveryEmailBase
): Promise<{ success: boolean; error?: string }> {
  const { to, userName, generationId, destination, durationLabel, offerType, variant } = params;

  const resumeUrl = buildResumeUrl(generationId, offerType, variant, 'relance_7d');
  const offerName = OFFER_DISPLAY_NAMES[offerType] ?? 'Express';

  const bodyHtml = [
    `<p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:${BRAND.text};">`,
    `  Ca fait une semaine que votre itineraire ${destination} attend dans nos serveurs.`,
    `  C&apos;est le dernier email qu&apos;on vous envoie a ce sujet &mdash; promis.`,
    `</p>`,
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:0 0 16px;color:${BRAND.text};">`,
    `  On fait regulierement le menage dans nos donnees pour liberer de l&apos;espace.`,
    `  Votre itineraire sera supprime dans les prochains jours si vous ne le deverrouillez pas.`,
    `  Si vous changez d&apos;avis plus tard, il faudra en generer un nouveau depuis le debut.`,
    `</p>`,
    ``,
    emailInfoBox([
      { label: 'Destination', value: destination },
      { label: 'Duree', value: durationLabel },
      { label: 'Formule', value: offerName },
    ]),
    ``,
    `<p style="font-size:14px;line-height:1.7;margin:16px 0 0;color:${BRAND.text};">`,
    `  Si vous hesitez encore, ou si vous avez une question sur les Philippines,`,
    `  repondez simplement a cet email. Je lis les messages personnellement`,
    `  et je ferai de mon mieux pour vous aider &mdash; que vous achetiez ou non.`,
    `</p>`,
    ``,
    emailDivider(),
    ``,
    emailMutedText(
      "Hugo &mdash; fondateur de Philippin&apos;Easy. Ce projet est ne d&apos;une passion pour les Philippines, pas d&apos;une salle de reunion."
    ),
  ].join('\n');

  const html = buildEmailHtml({
    title: 'Derniere chance pour votre itineraire Philippines',
    preheader: `Votre itineraire ${destination} sera supprime dans quelques jours -- voici votre derniere chance de le recuperer.`,
    userName,
    bodyHtml,
    ctaText: 'Finaliser maintenant',
    ctaUrl: resumeUrl,
  });

  return sendEmail({
    to,
    from: 'itineraire',
    subject: 'Derniere chance pour votre itineraire Philippines',
    html,
    category: 'transactional',
  });
}
