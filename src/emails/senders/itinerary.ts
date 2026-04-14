// ---------------------------------------------------------------------------
// Itinerary delivery email — refactored from src/services/emailService.ts
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailDivider, emailMutedText } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';

interface ItineraryEmailData {
  to: string;
  userName?: string;
  itineraryTitle: string;
  destination: string;
  days: number;
  variant: string;
  generationId: string;
}

export async function sendItineraryReadyEmail(data: ItineraryEmailData) {
  const itineraryUrl = `${BRAND.siteUrl}/itineraire/${data.generationId}`;
  const pdfUrl = `${BRAND.siteUrl}/api/itinerary/pdf/${data.generationId}`;

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Votre itineraire <strong>${data.itineraryTitle}</strong> est disponible.
      ${data.days} jours d'aventure vous attendent aux Philippines !
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
      <tr>
        <td style="background-color:${BRAND.footerBg};padding:10px 14px;width:130px;font-size:13px;color:${BRAND.muted};font-weight:600;border-bottom:1px solid ${BRAND.border};">Destination</td>
        <td style="padding:10px 14px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${data.destination}</td>
      </tr>
      <tr>
        <td style="background-color:${BRAND.footerBg};padding:10px 14px;font-size:13px;color:${BRAND.muted};font-weight:600;border-bottom:1px solid ${BRAND.border};">Duree</td>
        <td style="padding:10px 14px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${data.days} jours</td>
      </tr>
      <tr>
        <td style="background-color:${BRAND.footerBg};padding:10px 14px;font-size:13px;color:${BRAND.muted};font-weight:600;">Formule</td>
        <td style="padding:10px 14px;font-size:14px;color:${BRAND.text};">${data.variant}</td>
      </tr>
    </table>

    ${emailDivider()}

    ${emailMutedText(`<strong>Conseils :</strong><br>
    - Votre itineraire est aussi accessible dans votre profil sur philippineasy.com<br>
    - Vous pouvez telecharger le PDF a tout moment<br>
    - Pour toute question, repondez a cet email`)}
  `;

  const html = buildEmailHtml({
    title: 'Votre itineraire est pret !',
    preheader: `${data.userName || 'Votre'} itineraire ${data.destination} (${data.days}j) est disponible.`,
    userName: data.userName,
    bodyHtml,
    ctaText: 'Voir mon itineraire',
    ctaUrl: itineraryUrl,
    secondaryCtaText: 'Telecharger en PDF',
    secondaryCtaUrl: pdfUrl,
  });

  return sendEmail({
    to: data.to,
    from: 'itineraire',
    subject: `Votre itineraire ${data.destination} — ${data.days} jours`,
    html,
    category: 'transactional',
  });
}
