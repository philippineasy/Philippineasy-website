// ---------------------------------------------------------------------------
// Contact form auto-reply — sent to the visitor after form submission
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailInfoBox, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';

export async function sendContactAutoReply(to: string, name: string, subject: string, message: string) {
  const preview = message.length > 200 ? message.slice(0, 200) + '...' : message;

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Nous avons bien recu votre message et nous vous repondrons dans les plus brefs delais (generalement sous 24-48h).
    </p>

    <p style="font-size:13px;color:${BRAND.muted};font-weight:600;margin:0 0 4px;">Recapitulatif de votre message :</p>
    ${emailInfoBox([
      { label: 'Sujet', value: subject },
      { label: 'Message', value: preview },
    ])}

    ${emailMutedText('Si vous avez des informations supplementaires a ajouter, repondez directement a cet email.')}
  `;

  const html = buildEmailHtml({
    title: 'Message bien recu !',
    preheader: `${name}, nous avons recu votre message et reviendrons vers vous rapidement.`,
    userName: name,
    bodyHtml,
    ctaText: 'Visiter le site',
    ctaUrl: BRAND.siteUrl,
  });

  return sendEmail({
    to,
    from: 'contact',
    subject: `Bien recu ! Re: ${subject}`,
    html,
    category: 'transactional',
    replyTo: 'contact@philippineasy.com',
  });
}
