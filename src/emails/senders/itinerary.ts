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
  /** Type d'offre achetee — conditionne l'inclusion du CTA PDF.
   * Express n'a PAS le PDF (cf. OFFER_LABELS dans itinerary-pricing.ts).
   * Default 'premium' pour retro-compat avec les anciens appels (avant offre Express). */
  offerType?: 'express' | 'premium' | 'conciergerie';
}

// Le PDF professionnel est une feature Premium+ (cf. OFFER_LABELS.premium).
// Express ne donne acces qu'a la version web de l'itineraire.
const HAS_PDF: Record<string, boolean> = {
  express: false,
  premium: true,
  conciergerie: true,
};

export async function sendItineraryReadyEmail(data: ItineraryEmailData) {
  const itineraryUrl = `${BRAND.siteUrl}/itineraire/${data.generationId}`;
  const pdfUrl = `${BRAND.siteUrl}/api/itinerary/pdf/${data.generationId}`;
  const offerType = data.offerType || 'premium';
  const includePdfCta = HAS_PDF[offerType] ?? true;

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
    ${includePdfCta ? '- Vous pouvez telecharger le PDF a tout moment<br>' : ''}
    - Pour toute question, repondez a cet email`)}
  `;

  const html = buildEmailHtml({
    title: 'Votre itineraire est pret !',
    preheader: `${data.userName || 'Votre'} itineraire ${data.destination} (${data.days}j) est disponible.`,
    userName: data.userName,
    bodyHtml,
    ctaText: 'Voir mon itineraire',
    ctaUrl: itineraryUrl,
    // PDF reserve aux offres Premium+ (cf. OFFER_LABELS dans itinerary-pricing.ts)
    secondaryCtaText: includePdfCta ? 'Telecharger en PDF' : undefined,
    secondaryCtaUrl: includePdfCta ? pdfUrl : undefined,
  });

  return sendEmail({
    to: data.to,
    from: 'itineraire',
    subject: `Votre itineraire ${data.destination} — ${data.days} jours`,
    html,
    category: 'transactional',
  });
}
