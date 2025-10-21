'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditableWrapper } from '@/components/shared/EditableWrapper';
import { generateArticleUrl, generateForumTopicUrl } from '@/lib/utils';
import type { HomepageItem, Article, ForumTopic } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FeaturedNewsSectionProps {
  initialFeaturedItems: HomepageItem[];
}

export const FeaturedNewsSection = ({ initialFeaturedItems }: FeaturedNewsSectionProps) => {
  const [featuredItems, setFeaturedItems] = useState(initialFeaturedItems);

  const handleItemUpdate = (updatedItem: any) => {
    setFeaturedItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
    );
  };

  const handleItemReplace = (newItem: any) => {
    setFeaturedItems(prevItems => {
      const index = prevItems.findIndex(item => item.id === newItem.id);
      if (index !== -1) {
        const newItems = [...prevItems];
        newItems[index] = newItem;
        return newItems;
      }
      return prevItems;
    });
  };

  const renderItem = (item: HomepageItem) => {
    if (item.type === 'article') {
      const article = item as Article;
      return (
        <EditableWrapper key={article.id} item={article} type="article" onUpdate={handleItemUpdate} onReplace={handleItemReplace}>
          <div className="news-card bg-card rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
            <div className="relative h-40">
              <Image
                src={article.image || 'https://via.placeholder.com/300x200'}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                quality={70}
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <span className="text-xs text-primary font-semibold">{article.category?.name || 'Actualités'}</span>
              <h4 className="font-bold text-md mt-1 mb-2 leading-tight flex-grow">{article.title}</h4>
              <Link href={generateArticleUrl(article)} className="text-sm text-primary hover:underline mt-auto">
                Lire →
              </Link>
            </div>
          </div>
        </EditableWrapper>
      );
    }

    if (item.type === 'topic') {
      const topic = item as ForumTopic;
      return (
        <div key={topic.id} className="forum-card bg-card rounded-lg shadow-lg p-4 h-full flex flex-col">
          <span className="text-xs text-yellow-600 font-semibold">Forum {topic.category?.name || ''}</span>
          <h4 className="font-bold text-md mt-1 mb-2 leading-tight flex-grow">{topic.title}</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Par {topic.author?.username || 'Anonyme'} - {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: fr })}
          </p>
          <Link href={generateForumTopicUrl(topic)} className="text-sm text-primary hover:underline mt-auto">
            Voir discussion →
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">À la Une sur Philippin'Easy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map(item => renderItem(item))}
        </div>
        <div className="text-center mt-12">
          <Link href="/actualites-sur-les-philippines" className="text-primary hover:underline mr-6">Voir toutes les actualités</Link>
          <Link href="/forum-sur-les-philippines" className="text-primary hover:underline">Explorer tous les forums</Link>
        </div>
      </div>
    </section>
  );
};
