// ---------------------------------------------------------------------------
// Marketplace emails — order confirmation, vendor notifications
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailInfoBox, emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail, getUserEmail } from '../send';
import { BRAND } from '../config';

/** Order confirmation to buyer */
export async function sendOrderConfirmation(
  to: string,
  userName: string,
  orderId: string,
  items: { name: string; qty: number; price: number }[],
  totalAmount: number,
) {
  const itemsHtml = items
    .map((item) => `<tr>
      <td style="padding:8px 14px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${item.name}</td>
      <td style="padding:8px 14px;font-size:14px;color:${BRAND.muted};border-bottom:1px solid ${BRAND.border};text-align:center;">${item.qty}</td>
      <td style="padding:8px 14px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};text-align:right;">${item.price.toFixed(2)} EUR</td>
    </tr>`)
    .join('');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre commande a ete confirmee ! Voici le recapitulatif :
    </p>

    ${emailInfoBox([{ label: 'Commande', value: `#${orderId}` }])}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
      <tr style="background-color:${BRAND.footerBg};">
        <td style="padding:8px 14px;font-size:12px;color:${BRAND.muted};font-weight:600;">Produit</td>
        <td style="padding:8px 14px;font-size:12px;color:${BRAND.muted};font-weight:600;text-align:center;">Qte</td>
        <td style="padding:8px 14px;font-size:12px;color:${BRAND.muted};font-weight:600;text-align:right;">Prix</td>
      </tr>
      ${itemsHtml}
      <tr>
        <td colspan="2" style="padding:10px 14px;font-size:14px;font-weight:700;color:${BRAND.text};">Total</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:700;color:${BRAND.primaryBlue};text-align:right;">${totalAmount.toFixed(2)} EUR</td>
      </tr>
    </table>

    ${emailMutedText('Le vendeur sera notifie de votre commande. Pour toute question, contactez-nous.')}
  `;

  const html = buildEmailHtml({
    title: 'Commande confirmee !',
    preheader: `${userName}, votre commande #${orderId} a ete confirmee.`,
    userName,
    bodyHtml,
    ctaText: 'Voir ma commande',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: `Commande confirmee #${orderId}`,
    html,
    category: 'transactional',
  });
}

/** Notify vendor of a new order */
export async function sendVendorNewOrder(
  vendorUserId: string,
  orderId: string,
  items: { name: string; qty: number; price: number }[],
  buyerName: string,
) {
  const vendor = await getUserEmail(vendorUserId);
  if (!vendor) return;

  const itemsList = items
    .map((item) => `<li>${item.name} x${item.qty} — ${item.price.toFixed(2)} EUR</li>`)
    .join('');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Vous avez recu une nouvelle commande de <strong>${buyerName}</strong> !
    </p>

    ${emailInfoBox([{ label: 'Commande', value: `#${orderId}` }])}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Articles commandes :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      ${itemsList}
    </ul>

    ${emailHighlightBox("Connectez-vous pour traiter cette commande.", 'warning')}
  `;

  const html = buildEmailHtml({
    title: 'Nouvelle commande !',
    preheader: `Nouvelle commande #${orderId} de ${buyerName}`,
    userName: vendor.name,
    bodyHtml,
    ctaText: 'Gerer mes commandes',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
  });

  return sendEmail({
    to: vendor.email,
    from: 'equipe',
    subject: `Nouvelle commande #${orderId}`,
    html,
    category: 'transactional',
  });
}

/** Vendor application confirmation */
export async function sendVendorApplicationConfirmation(to: string, userName: string, vendorName: string) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre candidature pour ouvrir la boutique <strong>"${vendorName}"</strong> sur la Marketplace Philippin'Easy a bien ete recue !
    </p>

    ${emailHighlightBox("Notre equipe examinera votre candidature sous 48h. Vous recevrez un email de confirmation des que votre boutique sera approuvee.", 'info')}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">En attendant :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
      <li>Preparez vos photos de produits</li>
      <li>Redigez vos descriptions</li>
      <li>Definissez vos prix et conditions de livraison</li>
    </ul>

    ${emailMutedText('Pour toute question, repondez a cet email.')}
  `;

  const html = buildEmailHtml({
    title: 'Candidature recue !',
    preheader: `Votre candidature vendeur "${vendorName}" a ete recue.`,
    userName,
    bodyHtml,
    ctaText: 'Visiter la Marketplace',
    ctaUrl: `${BRAND.siteUrl}/marketplace-aux-philippines`,
  });

  return sendEmail({
    to,
    from: 'equipe',
    subject: `Candidature vendeur recue — ${vendorName}`,
    html,
    category: 'transactional',
    replyTo: 'contact@philippineasy.com',
  });
}
