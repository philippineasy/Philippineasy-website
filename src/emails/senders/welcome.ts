// ---------------------------------------------------------------------------
// Welcome email — sent after first login
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailFeatureCard, emailRulesList, emailDivider, emailHighlightBox } from '../templates/components';
import { sendEmail } from '../send';
import { BRAND } from '../config';
import { getUnsubscribeUrl } from '../unsubscribe';

export async function sendWelcomeEmail(userId: string, to: string, userName: string) {
  const unsubscribeUrl = await getUnsubscribeUrl(userId, 'marketing');

  const features = [
    emailFeatureCard('&#127758;', 'Itineraire IA personnalise', 'Genere un itineraire sur mesure pour les Philippines en quelques minutes.', `${BRAND.siteUrl}/itineraire-personnalise-pour-les-philippines`),
    emailFeatureCard('&#128172;', 'Forum communautaire', 'Pose tes questions, partage tes experiences avec des francophones aux Philippines.', `${BRAND.siteUrl}/forum-sur-les-philippines`),
    emailFeatureCard('&#10084;', 'Rencontre Philippines', 'Connecte-toi avec des personnes qui partagent ton interet pour les Philippines.', `${BRAND.siteUrl}/rencontre-philippines`),
    emailFeatureCard('&#128722;', 'Marketplace', 'Achete et vends des produits et services entre membres de la communaute.', `${BRAND.siteUrl}/marketplace-aux-philippines`),
    emailFeatureCard('&#127942;', 'Bons Plans', 'Hotels, vols, activites — les meilleures offres selectionnees pour toi.', `${BRAND.siteUrl}/meilleurs-plans-aux-philippines`),
    emailFeatureCard('&#128240;', 'Actualites', 'Reste informe sur les Philippines : visas, lois, evenements, lifestyle.', `${BRAND.siteUrl}/actualites-sur-les-philippines`),
  ].join('');

  const rules = emailRulesList([
    '<strong>Respect mutuel</strong> — Chaque membre merite courtoisie et bienveillance.',
    '<strong>Contenu authentique</strong> — Partagez vos vraies experiences, pas de faux profils.',
    '<strong>Pas de spam</strong> — Aucune publicite ou sollicitation non souhaitee.',
    '<strong>Signaler les abus</strong> — Aidez-nous a garder un espace sur en signalant les comportements inappropries.',
  ]);

  const bodyHtml = `
    <p style="font-size:15px;line-height:1.7;color:${BRAND.text};margin:0 0 20px;">
      Bienvenue dans la communaute <strong>Philippin'Easy</strong> ! Tu as maintenant acces a tout ce qu'il faut pour preparer ton voyage ou ton installation aux Philippines.
    </p>

    ${emailHighlightBox("Ton compte est actif et pret a utiliser. Commence par completer ton profil pour une experience personnalisee !", 'success')}

    <h2 style="color:${BRAND.text};font-size:17px;margin:28px 0 12px;font-weight:700;">Ce que tu peux faire</h2>
    ${features}

    ${emailDivider()}

    <h2 style="color:${BRAND.text};font-size:17px;margin:0 0 8px;font-weight:700;">Nos regles de bon sens</h2>
    <p style="color:${BRAND.muted};font-size:13px;margin:0 0 4px;">Pour que la communaute reste agreable pour tous :</p>
    ${rules}
  `;

  const html = buildEmailHtml({
    title: 'Bienvenue aux Philippines !',
    preheader: `${userName}, ton compte Philippin'Easy est pret. Decouvre tout ce qui t'attend !`,
    userName,
    bodyHtml,
    ctaText: 'Completer mon profil',
    ctaUrl: `${BRAND.siteUrl}/profil`,
    secondaryCtaText: 'Explorer le forum',
    secondaryCtaUrl: `${BRAND.siteUrl}/forum-sur-les-philippines`,
    unsubscribeUrl,
  });

  return sendEmail({
    to,
    from: 'bienvenue',
    subject: `Bienvenue ${userName} ! Ton aventure philippine commence ici`,
    html,
    category: 'marketing',
    userId,
  });
}
