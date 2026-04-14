// ---------------------------------------------------------------------------
// Dating notification emails
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail, getUserEmail } from '../send';
import { BRAND } from '../config';
import { getUnsubscribeUrl } from '../unsubscribe';

/** Notify a user when someone likes their profile */
export async function sendLikeNotification(likedUserId: string, likerUserId: string, isSuperLike: boolean) {
  const likedUser = await getUserEmail(likedUserId);
  const likerUser = await getUserEmail(likerUserId);
  if (!likedUser || !likerUser) return;

  const unsubscribeUrl = await getUnsubscribeUrl(likedUserId, 'community');

  const emoji = isSuperLike ? '&#11088;' : '&#10084;';
  const typeLabel = isSuperLike ? 'Super Like' : 'Like';

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      ${emoji} <strong>${likerUser.name}</strong> a envoye un <strong>${typeLabel}</strong> sur ton profil !
    </p>

    ${isSuperLike
      ? emailHighlightBox("Un Super Like signifie que cette personne est vraiment interessee. Ne laisse pas passer cette opportunite !", 'warning')
      : emailHighlightBox("Connecte-toi pour decouvrir son profil et peut-etre creer un match !", 'info')
    }

    ${emailMutedText('Tu recois cet email car tu as active les notifications Rencontre.')}
  `;

  const html = buildEmailHtml({
    title: isSuperLike ? 'Tu as recu un Super Like !' : 'Quelqu\'un a aime ton profil !',
    preheader: `${likerUser.name} a ${isSuperLike ? 'super like' : 'aime'} ton profil sur Philippin'Easy Rencontre`,
    userName: likedUser.name,
    bodyHtml,
    ctaText: 'Voir qui m\'aime',
    ctaUrl: `${BRAND.siteUrl}/rencontre-philippines`,
    unsubscribeUrl,
  });

  return sendEmail({
    to: likedUser.email,
    from: 'communaute',
    subject: isSuperLike
      ? `${likerUser.name} t'a envoye un Super Like !`
      : `${likerUser.name} a aime ton profil`,
    html,
    category: 'community',
    userId: likedUserId,
  });
}

/** Notify a user when they receive a new message */
export async function sendMessageNotification(recipientId: string, senderId: string, messagePreview: string) {
  const recipient = await getUserEmail(recipientId);
  const sender = await getUserEmail(senderId);
  if (!recipient || !sender) return;

  const unsubscribeUrl = await getUnsubscribeUrl(recipientId, 'community');
  const preview = messagePreview.slice(0, 100);

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      &#128172; <strong>${sender.name}</strong> t'a envoye un message :
    </p>

    ${emailHighlightBox(`"${preview}${messagePreview.length > 100 ? '...' : ''}"`, 'info')}

    ${emailMutedText('Tu recois cet email car tu as active les notifications Rencontre.')}
  `;

  const html = buildEmailHtml({
    title: 'Nouveau message !',
    preheader: `${sender.name} t'a envoye un message sur Philippin'Easy Rencontre`,
    userName: recipient.name,
    bodyHtml,
    ctaText: 'Lire le message',
    ctaUrl: `${BRAND.siteUrl}/rencontre-philippines/messages`,
    unsubscribeUrl,
  });

  return sendEmail({
    to: recipient.email,
    from: 'communaute',
    subject: `Nouveau message de ${sender.name}`,
    html,
    category: 'community',
    userId: recipientId,
  });
}

/** Welcome email after dating profile creation */
export async function sendDatingWelcome(userId: string, to: string, userName: string) {
  const unsubscribeUrl = await getUnsubscribeUrl(userId, 'community');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Ton profil Rencontre est maintenant actif ! Tu peux commencer a decouvrir les profils des autres membres.
    </p>

    ${emailHighlightBox("Ton profil sera visible par les autres membres apres validation par notre equipe (generalement sous 24h).", 'info')}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Pour maximiser tes chances :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Ajoute plusieurs photos de qualite</li>
      <li>Remplis ta description avec authenticite</li>
      <li>Reponds aux questions du profil</li>
      <li>Sois respectueux dans tes echanges</li>
    </ul>

    ${emailMutedText('Le compte gratuit permet 2 messages par jour. Passe en Premium pour un acces illimite.')}
  `;

  const html = buildEmailHtml({
    title: 'Bienvenue sur Rencontre !',
    preheader: `${userName}, ton profil Rencontre Philippin'Easy est pret.`,
    userName,
    bodyHtml,
    ctaText: 'Decouvrir les profils',
    ctaUrl: `${BRAND.siteUrl}/rencontre-philippines`,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'communaute',
    subject: 'Bienvenue sur Philippin\'Easy Rencontre !',
    html,
    category: 'community',
    userId,
  });
}
