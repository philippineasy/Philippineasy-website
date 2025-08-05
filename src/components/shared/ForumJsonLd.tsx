import { ForumTopic, ForumPost } from '@/types';

interface ForumJsonLdProps {
  topic: ForumTopic;
  posts: ForumPost[];
}

const ForumJsonLd = ({ topic, posts }: ForumJsonLdProps) => {
  if (!topic || !posts || posts.length === 0) {
    return null;
  }

  const siteUrl = 'https://philippineasy.com';
  const topicUrl = `${siteUrl}/forum-sur-les-philippines/sujet/${topic.slug}`;

  const extractTextFromContent = (content: any): string => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.blocks.map((block: any) => block.data.text).join(' ').replace(/<[^>]+>/g, '');
    } catch {
      return String(content).replace(/<[^>]+>/g, '');
    }
  };

  const firstPost = posts[0];
  const lastPost = posts[posts.length - 1];

  const discussionForumPosting = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    mainEntityOfPage: topicUrl,
    headline: topic.title,
    author: {
      '@type': 'Person',
      name: firstPost.author?.username || 'Utilisateur anonyme',
    },
    datePublished: firstPost.created_at,
    dateModified: lastPost.updated_at || lastPost.created_at,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      userInteractionCount: posts.length,
    },
    articleBody: extractTextFromContent(firstPost.content),
    comment: posts.slice(1).map(post => ({
      '@type': 'Comment',
      author: {
        '@type': 'Person',
        name: post.author?.username || 'Utilisateur anonyme',
      },
      dateCreated: post.created_at,
      text: extractTextFromContent(post.content),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(discussionForumPosting) }}
    />
  );
};

export default ForumJsonLd;
