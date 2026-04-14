// ---------------------------------------------------------------------------
// Base email HTML template — Philippineasy branded
// ---------------------------------------------------------------------------
import { BRAND } from '../config';
import type { BaseEmailOptions } from '../types';

export function buildEmailHtml(options: BaseEmailOptions): string {
  const {
    title,
    preheader,
    userName,
    bodyHtml,
    ctaText,
    ctaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    footerText,
    unsubscribeUrl,
  } = options;

  const greeting = userName
    ? `<p style="color:${BRAND.text};font-size:16px;margin:0 0 16px;font-weight:600;">Bonjour ${userName},</p>`
    : '';

  const ctaBlock = ctaText && ctaUrl
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 16px;">
        <tr><td align="center">
          <a href="${ctaUrl}" style="display:inline-block;background-color:${BRAND.primaryBlue};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">${ctaText}</a>
        </td></tr>
      </table>`
    : '';

  const secondaryCtaBlock = secondaryCtaText && secondaryCtaUrl
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
        <tr><td align="center">
          <a href="${secondaryCtaUrl}" style="display:inline-block;background-color:${BRAND.footerBg};color:${BRAND.primaryBlue};text-decoration:none;padding:10px 28px;border-radius:8px;font-size:14px;border:1px solid ${BRAND.border};">${secondaryCtaText}</a>
        </td></tr>
      </table>`
    : '';

  const unsubscribeBlock = unsubscribeUrl
    ? `<p style="color:${BRAND.mutedLight};font-size:11px;margin:8px 0 0;">
        <a href="${unsubscribeUrl}" style="color:${BRAND.mutedLight};text-decoration:underline;">Se desinscrire</a>
        &nbsp;|&nbsp;
        <a href="${BRAND.siteUrl}/api/email/preferences${unsubscribeUrl.includes('token=') ? '?token=' + unsubscribeUrl.split('token=')[1].split('&')[0] : ''}" style="color:${BRAND.mutedLight};text-decoration:underline;">Gerer mes preferences</a>
      </p>`
    : '';

  const preheaderBlock = preheader
    ? `<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.background};font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheaderBlock}
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${BRAND.background};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:${BRAND.cardBg};border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.primaryBlue};padding:28px 40px 24px;text-align:center;">
              <img src="${BRAND.logoUrl}" alt="Philippin'Easy" width="120" style="display:block;margin:0 auto 14px;max-width:120px;">
              <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;line-height:1.3;">${title}</h1>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="background-color:${BRAND.accentOrange};height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              ${greeting}
              <div style="color:${BRAND.text};font-size:14px;line-height:1.7;">
                ${bodyHtml}
              </div>
              ${ctaBlock}
              ${secondaryCtaBlock}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.footerBg};padding:20px 40px;text-align:center;border-top:1px solid ${BRAND.border};">
              <p style="color:${BRAND.mutedLight};font-size:12px;margin:0;">
                ${footerText || `${BRAND.siteName} — <a href="${BRAND.siteUrl}" style="color:${BRAND.mutedLight};text-decoration:none;">philippineasy.com</a>`}
              </p>
              ${unsubscribeBlock}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
