import { ForumTopic, ForumPost } from '@/types'; // Assuming you have these types

interface ForumJsonLdProps {
  topic: ForumTopic;
  posts: ForumPost[];
}

const ForumJsonLd = ({ topic, posts }: ForumJsonLdProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: topic.title,
    author: {
      '@type': 'Person',
      name: topic.author?.username || 'Utilisateur anonyme',
    },
    datePublished: topic.created_at,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: posts.length,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: topic.views || 0,
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://philippineasy.com/forum-sur-les-philippines/sujet/${topic.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ForumJsonLd;
