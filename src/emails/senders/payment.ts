// ---------------------------------------------------------------------------
// Payment emails — purchase confirmation, failure, cancellation
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailInfoBox, emailDivider, emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';

/** Confirmation after a service purchase (Buddy, Pack Ultime, etc.) */
export async function sendServicePurchaseConfirmation(
  to: string,
  userName: string,
  serviceName: string,
  amount: string,
  entitlements: string[],
) {
  const entitlementsList = entitlements
    .map((e) => `<li style="padding:4px 0;">${e}</li>`)
    .join('');

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre achat a ete confirme avec succes ! Voici le recapitulatif :
    </p>

    ${emailInfoBox([
      { label: 'Service', value: `<strong>${serviceName}</strong>` },
      { label: 'Montant', value: amount },
    ])}

    <h3 style="color:${BRAND.text};font-size:15px;margin:20px 0 8px;">Ce qui est inclus :</h3>
    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      ${entitlementsList}
    </ul>

    ${emailHighlightBox("Votre service est actif immediatement. Retrouvez tout dans votre espace personnel.", 'success')}

    ${emailMutedText('Pour toute question, repondez a cet email ou utilisez le formulaire de contact.')}
  `;

  const html = buildEmailHtml({
    title: 'Achat confirme !',
    preheader: `${userName}, votre achat "${serviceName}" est confirme.`,
    userName,
    bodyHtml,
    ctaText: 'Acceder a mon espace',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: `Confirmation d'achat — ${serviceName}`,
    html,
    category: 'transactional',
  });
}

/** Confirmation after itinerary payment */
export async function sendItineraryPaymentConfirmation(
  to: string,
  userName: string,
  destination: string,
  days: number,
  amount: string,
) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre paiement a ete accepte ! Votre itineraire est en cours de generation.
    </p>

    ${emailInfoBox([
      { label: 'Destination', value: destination },
      { label: 'Duree', value: `${days} jours` },
      { label: 'Montant', value: amount },
    ])}

    ${emailHighlightBox("Votre itineraire personnalise sera pret dans quelques minutes. Vous recevrez un email des qu'il sera disponible.", 'info')}
  `;

  const html = buildEmailHtml({
    title: 'Paiement confirme !',
    preheader: `Votre itineraire ${destination} (${days}j) est en preparation.`,
    userName,
    bodyHtml,
    ctaText: 'Suivre ma commande',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
  });

  return sendEmail({
    to,
    from: 'itineraire',
    subject: `Paiement confirme — Itineraire ${destination} (${days}j)`,
    html,
    category: 'transactional',
  });
}

/** Payment failure notification */
export async function sendPaymentFailedEmail(to: string, userName: string) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Nous n'avons pas pu traiter votre dernier paiement. Cela peut etre du a :
    </p>

    <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Fonds insuffisants</li>
      <li>Carte expiree ou bloquee</li>
      <li>Probleme temporaire avec votre banque</li>
    </ul>

    ${emailHighlightBox("Mettez a jour vos informations de paiement pour continuer a profiter de vos services.", 'warning')}
  `;

  const html = buildEmailHtml({
    title: 'Echec de paiement',
    preheader: 'Un probleme est survenu avec votre paiement. Mettez a jour vos informations.',
    userName,
    bodyHtml,
    ctaText: 'Mettre a jour mon paiement',
    ctaUrl: `${BRAND.siteUrl}/mon-espace`,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: 'Echec de paiement — Action requise',
    html,
    category: 'transactional',
  });
}

/** Subscription cancelled notification */
export async function sendSubscriptionCancelledEmail(to: string, userName: string, serviceName: string) {
  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre abonnement <strong>${serviceName}</strong> a ete annule. Vos acces resteront actifs jusqu'a la fin de la periode en cours.
    </p>

    ${emailHighlightBox("Vous pouvez vous reabonner a tout moment depuis votre espace personnel.", 'info')}

    ${emailMutedText("Si cette annulation n'etait pas intentionnelle, contactez-nous rapidement.")}
  `;

  const html = buildEmailHtml({
    title: 'Abonnement annule',
    preheader: `Votre abonnement ${serviceName} a ete annule.`,
    userName,
    bodyHtml,
    ctaText: 'Se reabonner',
    ctaUrl: `${BRAND.siteUrl}/services`,
    secondaryCtaText: 'Nous contacter',
    secondaryCtaUrl: `${BRAND.siteUrl}/contact`,
  });

  return sendEmail({
    to,
    from: 'commandes',
    subject: `Abonnement annule — ${serviceName}`,
    html,
    category: 'transactional',
  });
}
