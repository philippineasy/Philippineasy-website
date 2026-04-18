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

const ForumDecor = () => (
  <svg
    viewBox="0 0 400 140"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="forumBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B5BDB" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <rect width="400" height="140" fill="url(#forumBg)" />
    {/* speech bubbles */}
    <g fill="#ffffff" opacity="0.9">
      <path d="M60 50 Q 60 40, 70 40 L 150 40 Q 160 40, 160 50 L 160 78 Q 160 88, 150 88 L 98 88 L 88 100 L 88 88 L 70 88 Q 60 88, 60 78 Z" />
    </g>
    <g fill="#ffffff" opacity="0.55">
      <path d="M230 62 Q 230 54, 238 54 L 330 54 Q 338 54, 338 62 L 338 90 Q 338 98, 330 98 L 298 98 L 310 110 L 286 98 L 238 98 Q 230 98, 230 90 Z" />
    </g>
    {/* dots inside bubbles */}
    <g fill="#3B5BDB">
      <circle cx="90" cy="64" r="3" />
      <circle cx="110" cy="64" r="3" />
      <circle cx="130" cy="64" r="3" />
    </g>
    <g fill="#3B5BDB" opacity="0.55">
      <circle cx="260" cy="76" r="3" />
      <circle cx="280" cy="76" r="3" />
      <circle cx="300" cy="76" r="3" />
    </g>
  </svg>
);

export const FeaturedNewsSection = ({ initialFeaturedItems }: FeaturedNewsSectionProps) => {
  const [featuredItems, setFeaturedItems] = useState(initialFeaturedItems);

  const handleItemUpdate = (updatedItem: any) => {
    setFeaturedItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
    );
  };

  const handleItemReplace = (newItem: any) => {
    setFeaturedItems((prev) => {
      const index = prev.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        const next = [...prev];
        next[index] = newItem;
        return next;
      }
      return prev;
    });
  };

  const renderItem = (item: HomepageItem) => {
    if (item.type === 'article') {
      const article = item as Article;
      return (
        <EditableWrapper
          key={article.id}
          item={article}
          type="article"
          onUpdate={handleItemUpdate}
          onReplace={handleItemReplace}
        >
          <Link
            href={generateArticleUrl(article)}
            className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              border: '0.5px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div className="relative h-[160px] overflow-hidden">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                  quality={70}
                />
              ) : (
                <div className="w-full h-full bg-soft-blue" />
              )}
            </div>
            <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
              <span
                className="inline-flex items-center self-start mb-2.5 px-2 py-0.5 rounded"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#3B5BDB',
                  backgroundColor: '#F4F7FE',
                }}
              >
                {article.category?.name || 'Actualité'}
              </span>
              <h3
                className="text-foreground mb-3 flex-1"
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.35,
                }}
              >
                {article.title}
              </h3>
              <span
                className="inline-flex items-center gap-1 text-primary text-sm font-medium"
                aria-hidden="true"
              >
                Lire l&apos;article
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        </EditableWrapper>
      );
    }

    if (item.type === 'topic') {
      const topic = item as ForumTopic;
      return (
        <Link
          key={topic.id}
          href={generateForumTopicUrl(topic)}
          className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          style={{
            border: '0.5px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div className="relative h-[160px] overflow-hidden">
            <ForumDecor />
          </div>
          <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
            <span
              className="inline-flex items-center self-start mb-2.5 px-2 py-0.5 rounded"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#F59E0B',
                backgroundColor: '#FEF3C7',
              }}
            >
              Forum · {topic.category?.name || 'Discussions'}
            </span>
            <h3
              className="text-foreground mb-2 flex-1"
              style={{
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: 1.35,
              }}
            >
              {topic.title}
            </h3>
            <p
              className="mb-3"
              style={{ fontSize: '12px', color: '#94a3b8' }}
            >
              Par {topic.author?.username || 'Anonyme'} ·{' '}
              {formatDistanceToNow(new Date(topic.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
            <span
              className="inline-flex items-center gap-1 text-primary text-sm font-medium"
              aria-hidden="true"
            >
              Voir la discussion
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </Link>
      );
    }

    return null;
  };

  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            À la Une sur{' '}
            <span className="text-accent">Philippin&apos;Easy</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Actualités du moment et discussions actives de la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {featuredItems.map((item) => renderItem(item))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12">
          <Link
            href="/actualites-sur-les-philippines"
            className="group flex items-center gap-4 bg-card rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              border: '0.5px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#F4F7FE',
                color: '#3B5BDB',
              }}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
                <path d="M18 8h2a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2" />
                <path d="M8 8h6M8 12h6M8 16h4" />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="block text-foreground"
                style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Toutes les actualités
              </span>
              <span
                className="block mt-0.5"
                style={{ fontSize: '12px', color: '#64748b' }}
              >
                L&apos;info Philippines au quotidien.
              </span>
            </span>
            <span
              className="flex-shrink-0 text-primary text-sm transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>

          <Link
            href="/forum-sur-les-philippines"
            className="group flex items-center gap-4 bg-card rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              border: '0.5px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FEF3C7',
                color: '#F59E0B',
              }}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h8M8 13h5" />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="block text-foreground"
                style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Explorer le forum
              </span>
              <span
                className="block mt-0.5"
                style={{ fontSize: '12px', color: '#64748b' }}
              >
                Discussions, conseils &amp; partages entre voyageurs.
              </span>
            </span>
            <span
              className="flex-shrink-0 text-primary text-sm transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
