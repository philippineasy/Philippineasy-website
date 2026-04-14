// ---------------------------------------------------------------------------
// Lifecycle emails — reminders, expiry, re-engagement
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailInfoBox, emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';
import { getUnsubscribeUrl } from '../unsubscribe';

/** Reminder 24h before a scheduled call */
export async function sendCallReminder(
  userId: string,
  to: string,
  userName: string,
  callDate: string,
  serviceName: string,
) {
  const unsubscribeUrl = await getUnsubscribeUrl(userId, 'service');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre appel est programme pour demain !
    </p>

    ${emailInfoBox([
      { label: 'Service', value: serviceName },
      { label: 'Date', value: callDate },
    ])}

    ${emailHighlightBox("Assurez-vous d'etre disponible a l'heure prevue. Vous recevrez un lien de connexion par email ou WhatsApp.", 'warning')}

    ${emailMutedText('Pour reporter ou annuler, contactez-nous au plus vite.')}
  `;

  const html = buildEmailHtml({
    title: 'Rappel : appel demain !',
    preheader: `${userName}, votre appel ${serviceName} est prevu pour demain.`,
    userName,
    bodyHtml,
    ctaText: 'Mon espace',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: `Rappel : votre appel ${serviceName} est demain`,
    html,
    category: 'service',
    userId,
  });
}

/** Warning 7 days before subscription expiry */
export async function sendExpiryWarning(
  userId: string,
  to: string,
  userName: string,
  serviceName: string,
  expiryDate: string,
) {
  const unsubscribeUrl = await getUnsubscribeUrl(userId, 'service');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre abonnement <strong>${serviceName}</strong> expire le <strong>${expiryDate}</strong>.
    </p>

    ${emailHighlightBox("Renouvelez maintenant pour ne pas perdre vos avantages.", 'warning')}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Ce que vous perdriez :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Acces aux fonctionnalites premium</li>
      <li>Messages illimites (retour a 2/jour)</li>
      <li>Visibilite prioritaire de votre profil</li>
    </ul>
  `;

  const html = buildEmailHtml({
    title: 'Votre abonnement expire bientot',
    preheader: `${userName}, votre ${serviceName} expire dans 7 jours.`,
    userName,
    bodyHtml,
    ctaText: 'Renouveler mon abonnement',
    ctaUrl: `${BRAND.siteUrl}/services`,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: `Votre ${serviceName} expire dans 7 jours`,
    html,
    category: 'service',
    userId,
  });
}

/** Dating premium activation confirmation */
export async function sendDatingPremiumConfirmation(to: string, userName: string) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre abonnement <strong>Rencontre Premium</strong> est maintenant actif !
    </p>

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Vos avantages Premium :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>&#128172; Messages illimites</li>
      <li>&#11088; Super Likes disponibles</li>
      <li>&#128064; Voir qui vous a like</li>
      <li>&#128161; Profil mis en avant</li>
    </ul>

    ${emailHighlightBox("Profitez de vos nouveaux avantages des maintenant !", 'success')}
  `;

  const html = buildEmailHtml({
    title: 'Premium active !',
    preheader: `${userName}, profitez de Rencontre Premium des maintenant.`,
    userName,
    bodyHtml,
    ctaText: 'Decouvrir les profils',
    ctaUrl: `${BRAND.siteUrl}/rencontre-philippines`,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: 'Rencontre Premium active ! Profitez de vos avantages',
    html,
    category: 'transactional',
  });
}

/** Vendor application approved */
export async function sendVendorApproved(to: string, userName: string, vendorName: string) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Bonne nouvelle ! Votre boutique <strong>"${vendorName}"</strong> a ete approuvee !
    </p>

    ${emailHighlightBox("Vous pouvez maintenant ajouter vos produits et commencer a vendre sur la Marketplace Philippin'Easy.", 'success')}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Prochaines etapes :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Ajoutez vos premiers produits</li>
      <li>Configurez vos options de livraison</li>
      <li>Partagez votre boutique avec vos contacts</li>
    </ul>
  `;

  const html = buildEmailHtml({
    title: 'Boutique approuvee !',
    preheader: `${userName}, votre boutique "${vendorName}" est en ligne !`,
    userName,
    bodyHtml,
    ctaText: 'Gerer ma boutique',
    ctaUrl: `${BRAND.siteUrl}/marketplace-aux-philippines`,
  });

  return sendEmail({
    to,
    from: 'equipe',
    subject: `Votre boutique "${vendorName}" est approuvee !`,
    html,
    category: 'transactional',
  });
}

/** CRM admin message notification */
export async function sendAdminMessageNotification(
  userId: string,
  to: string,
  userName: string,
  messagePreview: string,
) {
  const unsubscribeUrl = await getUnsubscribeUrl(userId, 'service');
  const preview = messagePreview.slice(0, 200);

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      L'equipe Philippin'Easy vous a envoye un message :
    </p>

    ${emailHighlightBox(`"${preview}${messagePreview.length > 200 ? '...' : ''}"`, 'info')}

    ${emailMutedText('Connectez-vous a votre espace pour lire le message complet et repondre.')}
  `;

  const html = buildEmailHtml({
    title: 'Nouveau message de l\'equipe',
    preheader: `L'equipe Philippin'Easy vous a envoye un message.`,
    userName,
    bodyHtml,
    ctaText: 'Lire le message',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'equipe',
    subject: 'Nouveau message de l\'equipe Philippin\'Easy',
    html,
    category: 'service',
    userId,
  });
}
