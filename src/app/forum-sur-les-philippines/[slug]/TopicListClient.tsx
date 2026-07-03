'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getTopicsByCategorySlug, deleteForumTopic, lockForumTopic, pinForumTopic } from '@/services/forumService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faThumbtack, faLock, faUnlock, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { GradientAvatar } from '@/components/forum/GradientAvatar';

interface Topic {
  id: number;
  title: string;
  slug: string;
  topic_author_username: string;
  topic_author_avatar_url: string;
  reply_count: number;
  view_count: number;
  last_activity_at: string;
  last_post_author_username: string;
  last_post_author_avatar_url: string;
  is_pinned: boolean;
  is_locked: boolean;
  preview_posts: { content: string, author: string }[];
}

interface TopicListClientProps {
  slug: string;
  initialTopics: Topic[];
}

// Strip tags + collapse whitespace so a preview never leaks raw HTML.
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

// Turn an EditorJS post (JSON string) into a clean one-line excerpt. Walks to the
// first meaningful block (paragraph / header / quote / list) and returns its text;
// non-text leading blocks get an elegant label instead of a raw JSON dump.
const getPostExcerpt = (raw: string): string => {
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    const blocks = Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    for (const block of blocks) {
      switch (block?.type) {
        case 'paragraph':
        case 'header':
        case 'quote': {
          const text = stripHtml(block.data?.text || '');
          if (text) return text.slice(0, 180);
          break;
        }
        case 'list': {
          const items = Array.isArray(block.data?.items) ? block.data.items : [];
          const text = items
            .map((it: unknown) =>
              stripHtml(
                typeof it === 'object' && it !== null
                  ? ((it as { content?: string }).content || '')
                  : String(it ?? '')
              )
            )
            .filter(Boolean)
            .join(' · ');
          if (text) return text.slice(0, 180);
          break;
        }
        case 'image':
          return 'Photo partagée';
        case 'table':
          return 'Tableau partagé';
        default:
          break;
      }
    }
    return '';
  } catch {
    const text = stripHtml(raw);
    // Guard: if it still looks like serialized EditorJS, show nothing rather than braces.
    if (!text || /"(?:blocks|type|data)"\s*:/.test(raw)) return '';
    return text.slice(0, 180);
  }
};

const TopicPreview = ({ previewPosts }: { previewPosts: { content: string, author: string }[] }) => {
    const items = (previewPosts || [])
      .map((post) => ({ author: post.author, excerpt: getPostExcerpt(post.content) }))
      .filter((post) => post.excerpt)
      .slice(0, 2);

    if (items.length === 0) {
      return <p className="text-[13px] italic text-muted-foreground/80">Aucun aperçu pour le moment.</p>;
    }

    return (
      <div className="space-y-1.5">
        {items.map((post, index) => (
          <p key={index} className="line-clamp-2 text-[13px] leading-[1.5] text-muted-foreground">
            <strong className="font-semibold text-foreground">{post.author} :</strong> {post.excerpt}
          </p>
        ))}
      </div>
    );
  };

const SORT_OPTIONS: SelectOption[] = [
    { value: 'last_activity_at', label: 'Dernière activité' },
    { value: 'created_at', label: 'Date de création' },
];

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

export const TopicListClient = ({ slug, initialTopics }: TopicListClientProps) => {
  const { user, profile } = useAuth();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTopics.length > 0);
  const [sortBy, setSortBy] = useState<string | number>('last_activity_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: string, onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (sortBy === 'created_at') {
        // Assuming 'id' can be a proxy for creation time if 'created_at' is not available
        return b.id - a.id;
      }
      // Default sort by last activity
      return new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime();
    });
  }, [topics, sortBy]);

  const visibleTopics = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedTopics;
    return sortedTopics.filter((topic) =>
      topic.title.toLowerCase().includes(term) || (topic.topic_author_username || '').toLowerCase().includes(term)
    );
  }, [sortedTopics, searchTerm]);

  const fetchTopics = useCallback(async (pageNum = 1) => {
    if (!slug) return;
    setLoading(true);
    const { data: topicsData, error } = await getTopicsByCategorySlug(supabase, slug, pageNum);
    if (topicsData) {
      setTopics(prevTopics => [...prevTopics, ...topicsData]);
      setHasMore(topicsData.length > 0);
    }
    setLoading(false);
  }, [slug, supabase]);


  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTopics(nextPage);
  };

  const handleModerationAction = async (action: Promise<any>) => {
    await action;
    const { data: topicsData, error } = await getTopicsByCategorySlug(supabase, slug, 1);
    if (topicsData) {
      setTopics(topicsData);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col items-stretch gap-4 rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest md:flex-row md:items-center md:justify-between">
        <Link
          href={`/forum-sur-les-philippines/nouveau-sujet?category_slug=${slug}`}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.99] motion-reduce:transition-none"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Nouveau sujet
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher dans les sujets…"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
            />
          </div>
          <CustomSelect
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </div>
      </div>

      {searchTerm.trim() && (
        <p className="mb-3 text-[13px] text-muted-foreground">
          {visibleTopics.length} résultat{visibleTopics.length !== 1 ? 's' : ''} parmi les sujets chargés pour « {searchTerm.trim()} »
        </p>
      )}

      <div className="space-y-3">
        {visibleTopics.map(topic => (
          <article
            key={topic.id}
            className={`flex flex-col gap-3 rounded-2xl border-[0.5px] px-4 py-4 transition-colors duration-200 sm:px-5 ${
              topic.is_pinned
                ? 'border-accent/30 border-l-4 border-l-accent bg-accent/5'
                : 'border-border bg-card hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-4 sm:items-center">
              <Link
                href={`/forum-sur-les-philippines/sujet/${topic.slug}`}
                className="group flex min-w-0 flex-1 items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <GradientAvatar
                  src={topic.topic_author_avatar_url}
                  name={topic.topic_author_username}
                  className="h-11 w-11 rounded-full ring-1 ring-border"
                  imgSizes="44px"
                  textClassName="text-[16px]"
                />
                <span className="min-w-0 flex-1">
                  {(topic.is_pinned || topic.is_locked) && (
                    <span className="mb-1 flex flex-wrap items-center gap-1.5">
                      {topic.is_pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent-strong">
                          <FontAwesomeIcon icon={faThumbtack} className="h-2.5 w-2.5" /> Épinglé
                        </span>
                      )}
                      {topic.is_locked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5" /> Verrouillé
                        </span>
                      )}
                    </span>
                  )}
                  <span className="block truncate text-[16px] font-semibold text-foreground group-hover:text-primary">
                    {topic.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    par <strong className="font-medium text-foreground">{topic.topic_author_username}</strong> · dernière activité {formatRelativeTime(topic.last_activity_at)}
                  </span>
                </span>
              </Link>

              {profile?.role === 'super_admin' && (
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleModerationAction(pinForumTopic(supabase, topic.id, !topic.is_pinned))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                    title={topic.is_pinned ? 'Désépingler' : 'Épingler'}
                  >
                    <FontAwesomeIcon icon={faThumbtack} className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleModerationAction(lockForumTopic(supabase, topic.id, !topic.is_locked))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-accent-strong transition-colors hover:bg-accent/10"
                    title={topic.is_locked ? 'Déverrouiller' : 'Verrouiller'}
                  >
                    <FontAwesomeIcon icon={topic.is_locked ? faUnlock : faLock} className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        message: 'Êtes-vous sûr de vouloir supprimer ce sujet et tous ses messages ?',
                        onConfirm: () => {
                          handleModerationAction(deleteForumTopic(supabase, topic.id));
                          toast.success('Sujet supprimé.');
                          setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
                        }
                      });
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                    title="Supprimer"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="hidden flex-shrink-0 items-center gap-6 sm:flex">
                <div className="text-center">
                  <p className="text-[17px] font-bold leading-none text-foreground">{topic.reply_count}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground">Réponses</p>
                </div>
                <div className="text-center">
                  <p className="text-[17px] font-bold leading-none text-foreground">{topic.view_count}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground">Vues</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pl-[60px] text-sm text-foreground sm:hidden">
              <span className="text-[13px] font-semibold text-foreground">{topic.reply_count} réponses</span>
              <span className="text-[13px] text-muted-foreground">{topic.view_count} vues</span>
            </div>

            <div className="pl-[60px] pr-2">
              <TopicPreview previewPosts={topic.preview_posts} />
            </div>
          </article>
        ))}

        {visibleTopics.length === 0 && (
          <p className="rounded-2xl border-[0.5px] border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun sujet ne correspond à votre recherche.
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        {hasMore && !searchTerm.trim() && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Charger plus de sujets'}
          </button>
        )}
      </div>

      <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })} title="Confirmer la suppression">
        <p className="text-muted-foreground mb-6">{confirmModal.message}</p>
        <div className="flex justify-end space-x-4">
            <button onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">
                Annuler
            </button>
            <button onClick={confirmModal.onConfirm} className="px-4 py-2 text-sm font-medium text-card-foreground bg-destructive hover:bg-destructive/90 rounded-md">
                Confirmer la suppression
            </button>
        </div>
      </Modal>
    </>
  );
};
