'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  topic_count: number;
  last_topic_title: string;
  last_post_timestamp: string;
  last_post_author_username: string;
  last_post_author_avatar_url: string;
  last_topic_slug: string;
}

interface ForumListClientProps {
  initialCategories: ForumCategory[];
}

export const ForumListClient = ({ initialCategories }: ForumListClientProps) => {
  const { user } = useAuth();

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `Il y a quelques sec`;
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    if (days === 1) return `Hier`;
    if (days < 7) return `Il y a ${days} j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getBadgeColors = (name: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('expat')) return { bg: '#F4F7FE', color: '#3B5BDB' };
    if (n.includes('voyage')) return { bg: '#FEF3C7', color: '#B45309' };
    if (n.includes('culture')) return { bg: '#DCFCE7', color: '#15803D' };
    if (n.includes('travail')) return { bg: '#F3E8FF', color: '#7E22CE' };
    if (n.includes('gastro')) return { bg: '#FEE2E2', color: '#B91C1C' };
    if (n.includes('rencontre')) return { bg: '#E0E7FF', color: '#4338CA' };
    return { bg: '#f1f5f9', color: '#334155' };
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCategories.map((category) => {
          const badge = getBadgeColors(category.name);
          return (
            <Link
              key={category.id}
              href={`/forum-sur-les-philippines/${category.slug}`}
              className="group bg-card rounded-2xl p-5 flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                border: '0.5px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex-grow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3
                    className="text-foreground"
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}
                  >
                    {category.name}
                  </h3>
                  <span
                    className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      backgroundColor: badge.bg,
                      color: badge.color,
                    }}
                  >
                    {category.topic_count} sujet{category.topic_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.55,
                    minHeight: '3em',
                  }}
                >
                  {category.description}
                </p>
              </div>
              <div
                className="pt-3 mt-auto"
                style={{ borderTop: '0.5px solid #f1f5f9' }}
              >
                {category.last_topic_title ? (
                  <>
                    <p
                      className="truncate mb-1.5"
                      style={{ fontSize: '12px', color: '#475569' }}
                      title={category.last_topic_title}
                    >
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginRight: '6px' }}>
                        Dernier
                      </span>
                      <span className="font-medium text-foreground">
                        {category.last_topic_title}
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#94a3b8' }}>
                      <span className="relative flex-shrink-0" style={{ width: '16px', height: '16px' }}>
                        <Image
                          src={category.last_post_author_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(category.last_post_author_username)}&background=random&size=24&font-size=0.5&length=1&color=fff`}
                          alt=""
                          fill
                          className="rounded-full object-cover"
                          sizes="16px"
                        />
                      </span>
                      <span className="font-medium" style={{ color: '#64748b' }}>
                        {category.last_post_author_username}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelativeTime(category.last_post_timestamp)}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Aucune activité récente.
                  </p>
                )}
              </div>
              <span
                className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium self-start"
                aria-hidden="true"
              >
                Voir le forum
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {!user && (
        <div className="mt-16 max-w-md mx-auto">
          <div
            className="bg-card rounded-2xl p-6 text-center"
            style={{
              border: '0.5px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="inline-flex items-center justify-center rounded-xl mb-3"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#F4F7FE',
                color: '#3B5BDB',
              }}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faRightToBracket} style={{ fontSize: '20px' }} />
            </span>
            <h3 className="text-foreground mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
              Rejoignez la discussion
            </h3>
            <p className="mb-4" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}>
              Créez un compte gratuit pour répondre et démarrer vos propres sujets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                href="/connexion"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02]"
              >
                Se connecter
              </Link>
              <Link
                href="/connexion#register"
                className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80"
              >
                Créer un compte
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
