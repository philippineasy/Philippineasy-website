// ---------------------------------------------------------------------------
// Newsletter emails — double opt-in confirmation + welcome (post-confirmation)
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';
import { getNewsletterUnsubscribeUrl } from '../unsubscribe';

/** Double opt-in confirmation email — sent immediately after signup, before the subscriber is active. */
export async function sendNewsletterConfirmation(to: string, token: string) {
  const confirmUrl = `${BRAND.siteUrl}/api/newsletter/confirm?token=${token}`;

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Vous venez de demander votre inscription a la newsletter <strong>Philippin'Easy</strong>.
    </p>

    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Pour confirmer votre adresse et recevoir nos conseils, bons plans et actualites sur les Philippines,
      cliquez sur le bouton ci-dessous.
    </p>

    ${emailHighlightBox("Ce lien de confirmation expire au bout de 7 jours. Si vous n'etes pas a l'origine de cette demande, ignorez simplement cet email — aucune inscription ne sera activee.", 'info')}
  `;

  const html = buildEmailHtml({
    title: 'Confirmez votre inscription',
    preheader: 'Un clic pour confirmer votre inscription a la newsletter Philippin\'Easy.',
    bodyHtml,
    ctaText: 'Confirmer mon inscription',
    ctaUrl: confirmUrl,
  });

  return sendEmail({
    to,
    from: 'newsletter',
    subject: 'Confirmez votre inscription a la newsletter',
    html,
    category: 'transactional',
  });
}

export async function sendNewsletterWelcome(to: string) {
  const unsubscribeUrl = await getNewsletterUnsubscribeUrl(to);

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Vous etes maintenant inscrit(e) a la newsletter <strong>Philippin'Easy</strong> !
    </p>

    ${emailHighlightBox("Vous recevrez nos meilleurs conseils, bons plans et actualites sur les Philippines directement dans votre boite mail.", 'info')}

    <p style="font-size:14px;line-height:1.7;margin:16px 0;">
      En attendant, voici ce que vous pouvez decouvrir sur le site :
    </p>

    <ul style="color:${BRAND.text};font-size:14px;line-height:2;padding-left:20px;margin:0 0 16px;">
      <li><a href="${BRAND.siteUrl}/voyager-aux-philippines" style="color:${BRAND.primaryBlue};text-decoration:none;">Guides de voyage</a> — Palawan, Cebu, Siargao et plus</li>
      <li><a href="${BRAND.siteUrl}/vivre-aux-philippines" style="color:${BRAND.primaryBlue};text-decoration:none;">S'installer aux Philippines</a> — Visas, logement, travail</li>
      <li><a href="${BRAND.siteUrl}/itineraire-personnalise-pour-les-philippines" style="color:${BRAND.primaryBlue};text-decoration:none;">Itineraire IA</a> — Creez votre voyage sur mesure</li>
    </ul>

    ${emailMutedText('Vous pouvez vous desinscrire a tout moment via le lien en bas de chaque email.')}
  `;

  const html = buildEmailHtml({
    title: 'Bienvenue dans la newsletter !',
    preheader: 'Vous recevrez nos meilleurs conseils et bons plans Philippines.',
    bodyHtml,
    ctaText: 'Decouvrir le site',
    ctaUrl: BRAND.siteUrl,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'newsletter',
    subject: 'Bienvenue dans la newsletter Philippin\'Easy !',
    html,
    category: 'marketing',
  });
}
