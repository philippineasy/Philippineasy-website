import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

const FROM_EMAIL = 'Philippineasy <itineraire@philippineasy.com>';

interface ItineraryEmailData {
  to: string;
  userName?: string;
  itineraryTitle: string;
  destination: string;
  days: number;
  variant: string;
  generationId: string;
  telegramMessage?: string; // Reuse the formatted message from n8n
}

export async function sendItineraryEmail(data: ItineraryEmailData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.philippineasy.com';
  const itineraryUrl = `${siteUrl}/itineraire/${data.generationId}`;
  const pdfUrl = `${siteUrl}/api/itinerary/pdf/${data.generationId}`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: `Votre itineraire ${data.destination} - ${data.days} jours`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background-color:#4A7FD6;padding:32px 40px;text-align:center;">
              <img src="${siteUrl}/logo-philippineasy.png" alt="Philippineasy" width="100" style="margin-bottom:16px;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Votre itineraire est pret !</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#0f172a;font-size:16px;margin:0 0 8px;">
                ${data.userName ? `Bonjour ${data.userName},` : 'Bonjour,'}
              </p>
              <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
                Votre itineraire <strong>${data.itineraryTitle}</strong> est disponible.
                ${data.days} jours d'aventure vous attendent aux Philippines !
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${itineraryUrl}" style="display:inline-block;background-color:#4A7FD6;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
                      Voir mon itineraire
                    </a>
                  </td>
                </tr>
              </table>

              <!-- PDF link -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${pdfUrl}" style="display:inline-block;background-color:#f1f5f9;color:#4A7FD6;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;border:1px solid #e2e8f0;">
                      Telecharger en PDF
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">

              <!-- Tips -->
              <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">
                <strong>Conseils :</strong><br>
                - Votre itineraire est aussi accessible dans votre profil sur philippineasy.com<br>
                - Vous pouvez telecharger le PDF a tout moment<br>
                - Pour toute question, repondez a cet email
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                Philippineasy — Votre voyage sur mesure aux Philippines
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error(`Email error: ${error.message}`);
  }

  return { success: true };
}
