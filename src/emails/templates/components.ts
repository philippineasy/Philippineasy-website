// ---------------------------------------------------------------------------
// Reusable email HTML components
// ---------------------------------------------------------------------------
import { BRAND } from '../config';

/** Horizontal divider */
export function emailDivider(): string {
  return `<hr style="border:none;border-top:1px solid ${BRAND.border};margin:24px 0;">`;
}

/** Info box — key/value table (like the contact form sender info) */
export function emailInfoBox(items: { label: string; value: string }[]): string {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="background-color:${BRAND.footerBg};padding:10px 14px;width:130px;font-size:13px;color:${BRAND.muted};font-weight:600;vertical-align:top;border-bottom:1px solid ${BRAND.border};">${item.label}</td>
          <td style="padding:10px 14px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${item.value}</td>
        </tr>`
    )
    .join('');

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
    ${rows}
  </table>`;
}

/** Feature card for welcome email */
export function emailFeatureCard(icon: string, title: string, description: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0;">
    <tr>
      <td style="padding:14px 16px;border:1px solid ${BRAND.border};border-radius:10px;border-left:4px solid ${BRAND.accentOrange};">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="36" style="vertical-align:top;padding-right:12px;font-size:20px;">${icon}</td>
            <td>
              <a href="${url}" style="color:${BRAND.primaryBlue};font-size:14px;font-weight:600;text-decoration:none;">${title}</a>
              <p style="color:${BRAND.muted};font-size:13px;margin:4px 0 0;line-height:1.4;">${description}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/** Rule item with checkmark for welcome email */
export function emailRuleItem(text: string): string {
  return `<tr>
    <td width="24" style="vertical-align:top;padding:4px 0;color:${BRAND.success};font-size:16px;">&#10003;</td>
    <td style="padding:4px 0;font-size:13px;color:${BRAND.text};line-height:1.5;">${text}</td>
  </tr>`;
}

/** Rules list wrapper */
export function emailRulesList(rules: string[]): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:12px 0 20px;">
    ${rules.map(emailRuleItem).join('')}
  </table>`;
}

/** Highlighted message box */
export function emailHighlightBox(content: string, variant: 'info' | 'warning' | 'success' = 'info'): string {
  const colors = {
    info: { bg: '#EFF6FF', border: BRAND.primaryBlue, text: '#1E40AF' },
    warning: { bg: '#FFF7ED', border: BRAND.accentOrange, text: '#9A3412' },
    success: { bg: '#F0FDF4', border: BRAND.success, text: '#166534' },
  };
  const c = colors[variant];
  return `<div style="background-color:${c.bg};border-left:4px solid ${c.border};padding:14px 18px;border-radius:0 8px 8px 0;margin:16px 0;font-size:13px;color:${c.text};line-height:1.5;">
    ${content}
  </div>`;
}

/** Small muted text block */
export function emailMutedText(text: string): string {
  return `<p style="color:${BRAND.muted};font-size:13px;line-height:1.5;margin:16px 0 0;">${text}</p>`;
}
