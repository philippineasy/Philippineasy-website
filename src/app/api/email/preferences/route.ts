import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { BRAND } from '@/emails/config';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse('Token manquant', { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('email_preferences')
    .select('community_emails, marketing_emails, service_emails')
    .eq('unsubscribe_token', token)
    .single();

  if (!data) {
    return new NextResponse('Token invalide', { status: 404 });
  }

  return new NextResponse(renderPreferencesPage(token, data), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function PUT(request: NextRequest) {
  const { token, community_emails, marketing_emails, service_emails } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('email_preferences')
    .update({
      community_emails: Boolean(community_emails),
      marketing_emails: Boolean(marketing_emails),
      service_emails: Boolean(service_emails),
      updated_at: new Date().toISOString(),
    })
    .eq('unsubscribe_token', token);

  if (error) {
    return NextResponse.json({ error: 'Mise a jour echouee' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

function renderPreferencesPage(
  token: string,
  prefs: { community_emails: boolean; marketing_emails: boolean; service_emails: boolean },
): string {
  const categories = [
    { key: 'community_emails', label: 'Communaute', description: 'Forum, rencontre, likes, messages', checked: prefs.community_emails },
    { key: 'marketing_emails', label: 'Newsletter & promotions', description: 'Nouveaux articles, bons plans, newsletter', checked: prefs.marketing_emails },
    { key: 'service_emails', label: 'Services & rappels', description: 'Rappels d\'appels, expirations d\'abonnements', checked: prefs.service_emails },
  ];

  const togglesHtml = categories.map((cat) => `
    <label style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border:1px solid ${BRAND.border};border-radius:10px;margin:8px 0;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='${BRAND.primaryBlue}'" onmouseout="this.style.borderColor='${BRAND.border}'">
      <div>
        <div style="font-size:15px;font-weight:600;color:${BRAND.text};">${cat.label}</div>
        <div style="font-size:13px;color:${BRAND.muted};margin-top:2px;">${cat.description}</div>
      </div>
      <input type="checkbox" name="${cat.key}" ${cat.checked ? 'checked' : ''} style="width:20px;height:20px;accent-color:${BRAND.primaryBlue};cursor:pointer;">
    </label>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preferences email — Philippin'Easy</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.background};font-family:'Segoe UI',Roboto,-apple-system,sans-serif;min-height:100vh;">
  <div style="max-width:480px;margin:40px auto;padding:0 16px;">
    <div style="background:${BRAND.cardBg};border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">

      <div style="background-color:${BRAND.primaryBlue};padding:24px;text-align:center;">
        <img src="${BRAND.logoUrl}" alt="Philippin'Easy" width="100" style="display:block;margin:0 auto;">
      </div>
      <div style="background-color:${BRAND.accentOrange};height:4px;"></div>

      <div style="padding:32px 24px;">
        <h1 style="color:${BRAND.text};font-size:20px;margin:0 0 8px;">Preferences email</h1>
        <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Choisissez les emails que vous souhaitez recevoir. Les emails transactionnels (paiements, confirmations) sont toujours envoyes.</p>

        <form id="prefsForm">
          ${togglesHtml}

          <div style="margin-top:24px;text-align:center;">
            <button type="submit" style="background-color:${BRAND.primaryBlue};color:#fff;border:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">
              Sauvegarder
            </button>
          </div>

          <div id="status" style="text-align:center;margin-top:16px;font-size:14px;"></div>
        </form>
      </div>
    </div>

    <p style="text-align:center;margin-top:16px;">
      <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};font-size:13px;text-decoration:none;">Retour au site</a>
    </p>
  </div>

  <script>
    document.getElementById('prefsForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const statusEl = document.getElementById('status');
      statusEl.textContent = 'Sauvegarde en cours...';
      statusEl.style.color = '${BRAND.muted}';

      const data = {
        token: '${token}',
        community_emails: this.querySelector('[name="community_emails"]').checked,
        marketing_emails: this.querySelector('[name="marketing_emails"]').checked,
        service_emails: this.querySelector('[name="service_emails"]').checked,
      };

      try {
        const res = await fetch('/api/email/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          statusEl.textContent = 'Preferences sauvegardees !';
          statusEl.style.color = '${BRAND.success}';
        } else {
          statusEl.textContent = 'Erreur lors de la sauvegarde.';
          statusEl.style.color = '${BRAND.error}';
        }
      } catch {
        statusEl.textContent = 'Erreur reseau.';
        statusEl.style.color = '${BRAND.error}';
      }
    });
  </script>
</body>
</html>`;
}
