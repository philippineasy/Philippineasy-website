import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { BRAND } from '@/emails/config';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const category = request.nextUrl.searchParams.get('category');

  if (!token || !category) {
    return new NextResponse(renderPage('Lien invalide', 'Le lien de desinscription est invalide ou expire.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const columnMap: Record<string, string> = {
    community: 'community_emails',
    marketing: 'marketing_emails',
    service: 'service_emails',
  };

  const column = columnMap[category];
  if (!column) {
    return new NextResponse(renderPage('Categorie invalide', 'Cette categorie d\'email n\'existe pas.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('email_preferences')
    .update({ [column]: false, updated_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('id')
    .single();

  if (error || !data) {
    return new NextResponse(renderPage('Lien expire', 'Ce lien de desinscription n\'est plus valide.', false), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const categoryLabels: Record<string, string> = {
    community: 'communaute (forum, rencontre)',
    marketing: 'newsletter et promotions',
    service: 'services et rappels',
  };

  return new NextResponse(
    renderPage(
      'Desinscription confirmee',
      `Vous ne recevrez plus les emails de type <strong>${categoryLabels[category]}</strong>. Vous pouvez modifier vos preferences a tout moment.`,
      true
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

function renderPage(title: string, message: string, success: boolean): string {
  const icon = success ? '&#10003;' : '&#10007;';
  const iconColor = success ? BRAND.success : BRAND.error;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Philippin'Easy</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.background};font-family:'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;">
  <div style="max-width:480px;width:100%;margin:40px 16px;background:${BRAND.cardBg};border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);text-align:center;">
    <div style="background-color:${BRAND.primaryBlue};padding:24px;">
      <img src="${BRAND.logoUrl}" alt="Philippin'Easy" width="100" style="display:block;margin:0 auto;">
    </div>
    <div style="background-color:${BRAND.accentOrange};height:4px;"></div>
    <div style="padding:40px 32px;">
      <div style="width:56px;height:56px;border-radius:50%;background-color:${iconColor}20;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;color:${iconColor};">${icon}</span>
      </div>
      <h1 style="color:${BRAND.text};font-size:22px;margin:0 0 12px;">${title}</h1>
      <p style="color:${BRAND.muted};font-size:14px;line-height:1.6;margin:0 0 24px;">${message}</p>
      <a href="${BRAND.siteUrl}" style="display:inline-block;background-color:${BRAND.primaryBlue};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">Retour au site</a>
    </div>
  </div>
</body>
</html>`;
}
