// ---------------------------------------------------------------------------
// Forum notification emails
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '../templates/base';
import { emailHighlightBox, emailMutedText } from '../templates/components';
import { sendEmail, getUserEmail } from '../send';
import { BRAND } from '../config';
import { getUnsubscribeUrl } from '../unsubscribe';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

/** Notify the topic creator and participants when a new reply is posted */
export async function sendForumReplyNotifications(
  topicId: number,
  posterId: string,
  postContent: string,
) {
  const supabase = createServiceRoleClient();

  // Get topic info
  const { data: topic } = await supabase
    .from('forum_topics')
    .select('title, slug, user_id')
    .eq('id', topicId)
    .single();

  if (!topic) return;

  // Get all unique participants (topic creator + people who posted), excluding the poster
  const { data: participants } = await supabase
    .from('forum_posts')
    .select('user_id')
    .eq('topic_id', topicId)
    .neq('user_id', posterId);

  const userIds = new Set<string>();
  if (topic.user_id && topic.user_id !== posterId) userIds.add(topic.user_id);
  participants?.forEach((p) => userIds.add(p.user_id));

  // Get poster name
  const poster = await getUserEmail(posterId);
  const posterName = poster?.name || 'Un membre';

  const preview = postContent.replace(/<[^>]+>/g, '').slice(0, 150);
  const topicUrl = `${BRAND.siteUrl}/forum-sur-les-philippines/sujet/${topic.slug}`;

  for (const userId of userIds) {
    const user = await getUserEmail(userId);
    if (!user) continue;

    const unsubscribeUrl = await getUnsubscribeUrl(userId, 'community');

    const bodyHtml = `
      <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
        <strong>${posterName}</strong> a repondu dans le sujet <strong>"${topic.title}"</strong> :
      </p>

      ${emailHighlightBox(`"${preview}${postContent.length > 150 ? '...' : ''}"`, 'info')}

      ${emailMutedText('Vous recevez cet email car vous participez a cette discussion.')}
    `;

    const html = buildEmailHtml({
      title: 'Nouvelle reponse sur le forum',
      preheader: `${posterName} a repondu dans "${topic.title}"`,
      userName: user.name,
      bodyHtml,
      ctaText: 'Voir la discussion',
      ctaUrl: topicUrl,
      unsubscribeUrl,
    });

    sendEmail({
      to: user.email,
      from: 'communaute',
      subject: `Nouvelle reponse : ${topic.title}`,
      html,
      category: 'community',
      userId,
    }).catch((err) => console.error(`Forum reply email to ${userId} failed:`, err));
  }
}
