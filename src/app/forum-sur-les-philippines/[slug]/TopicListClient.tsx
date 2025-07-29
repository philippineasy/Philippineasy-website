'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTopicsByCategorySlug, deleteForumTopic, lockForumTopic, pinForumTopic } from '@/services/forumService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faThumbtack, faLock, faUnlock, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase/client';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';

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

const TopicPreview = ({ previewPosts }: { previewPosts: { content: string, author: string }[] }) => {
    if (!previewPosts || previewPosts.length === 0) {
      return <p className="preview-text italic text-muted-foreground">Pas de messages récents à afficher en aperçu.</p>;
    }
  
    return (
      <>
        {previewPosts.map((post, index) => {
          let content = null;
          try {
            const parsedContent = JSON.parse(post.content);
            const firstBlock = parsedContent.blocks[0];
            if (firstBlock.type === 'header') {
              content = <h4 className="preview-header-blue"><strong className="text-foreground">{post.author}:</strong> {firstBlock.data.text}</h4>;
            } else if (firstBlock.type === 'quote') {
              content = <blockquote className="preview-quote-orange"><strong className="text-foreground">{post.author}:</strong> {firstBlock.data.text}</blockquote>;
            } else {
              content = <p className="preview-text"><strong className="text-foreground">{post.author}:</strong> {firstBlock.data.text.substring(0, 150)}...</p>;
            }
          } catch (e) {
            const cleanContent = post.content ? post.content.replace(/<[^>]*>?/gm, ' ') : '';
            content = <p className="preview-text"><strong className="text-foreground">{post.author}:</strong> {cleanContent.substring(0, 150)}...</p>;
          }
          return <div key={index} className="single-post-preview mb-1">{content}</div>;
        })}
      </>
    );
  };

const SORT_OPTIONS: SelectOption[] = [
    { value: 'last_activity_at', label: 'Dernière activité' },
    { value: 'created_at', label: 'Date de création' },
];

export const TopicListClient = ({ slug, initialTopics }: TopicListClientProps) => {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTopics.length > 0);
  const [sortBy, setSortBy] = useState<string | number>('last_activity_at');
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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-card rounded-lg shadow">
        <div>
          <Link href={`/forum-sur-les-philippines/nouveau-sujet?category_slug=${slug}`} className="px-5 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/90 transition duration-300 font-semibold">
            <FontAwesomeIcon icon={faPlus} className="mr-1" /> Nouveau Sujet
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="relative">
            <input type="search" placeholder="Rechercher..." className="pl-8 pr-2 py-1.5 border rounded-lg text-sm focus:ring-ring focus:border-primary" />
            <FontAwesomeIcon icon={faSearch} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <CustomSelect
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-lg">
        <div className="hidden md:flex bg-muted px-4 py-3 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="flex-grow pr-4">Sujet / Auteur</div>
          <div className="w-24 text-center">Réponses</div>
          <div className="w-24 text-center">Vues</div>
          <div className="w-48 text-right">Dernière Activité</div>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedTopics.map(topic => (
            <div key={topic.id} className={`p-4 flex flex-col ${topic.is_pinned ? 'topic-pinned' : 'hover:bg-muted'}`}>
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-shrink-0 relative w-12 h-12">
                  <Image src={topic.topic_author_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.topic_author_username || '?').charAt(0)}&background=random&size=48&font-size=0.5`} alt={`Avatar de ${topic.topic_author_username}`} fill className="rounded-full border-2 border-border" />
                </div>
                <div className="flex-grow min-w-0">
                  <Link href={`/forum-sur-les-philippines/sujet/${topic.slug}`} className="text-lg font-semibold text-primary hover:underline">
                    {topic.is_pinned && <FontAwesomeIcon icon={faThumbtack} className="text-primary mr-2" />}
                    {topic.title}
                    {topic.is_locked && <FontAwesomeIcon icon={faLock} className="text-accent ml-2" />}
                  </Link>
                  {profile?.role === 'super_admin' && (
                    <span className="ml-4 inline-flex gap-3">
                      <button onClick={() => handleModerationAction(pinForumTopic(supabase, topic.id, !topic.is_pinned))} className="text-xs text-primary hover:text-primary/90" title={topic.is_pinned ? 'Désépingler' : 'Épingler'}><FontAwesomeIcon icon={faThumbtack} /></button>
                      <button onClick={() => handleModerationAction(lockForumTopic(supabase, topic.id, !topic.is_locked))} className="text-xs text-accent hover:text-yellow-700" title={topic.is_locked ? 'Déverrouiller' : 'Verrouiller'}><FontAwesomeIcon icon={topic.is_locked ? faUnlock : faLock} /></button>
                      <button onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          message: 'Êtes-vous sûr de vouloir supprimer ce sujet et tous ses messages ?',
                          onConfirm: () => {
                            handleModerationAction(deleteForumTopic(supabase, topic.id));
                            toast.success('Sujet supprimé.');
                            setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
                          }
                        });
                      }} className="text-xs text-destructive hover:text-destructive/90" title="Supprimer"><FontAwesomeIcon icon={faTrash} /></button>
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">par <span className="font-medium text-foreground">{topic.topic_author_username}</span>, {formatRelativeTime(topic.last_activity_at)}</p>
                </div>
                <div className="w-24 text-center flex-shrink-0 hidden md:block">
                  <p className="text-lg font-bold">{topic.reply_count}</p>
                  <p className="text-sm text-muted-foreground">Réponses</p>
                </div>
                <div className="w-24 text-center flex-shrink-0 hidden md:block">
                  <p className="text-lg font-bold">{topic.view_count}</p>
                  <p className="text-sm text-muted-foreground">Vues</p>
                </div>
                <div className="w-48 text-sm text-muted-foreground flex items-center flex-shrink-0 hidden md:flex">
                  <div className="relative w-8 h-8 rounded-full mr-2">
                    <Image src={topic.last_post_author_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.last_post_author_username || '?').charAt(0)}&background=random&size=32&font-size=0.5`} alt={`Avatar de ${topic.last_post_author_username}`} fill className="rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium truncate" title={topic.last_post_author_username}>{topic.last_post_author_username}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(topic.last_activity_at)}</p>
                  </div>
                </div>
              </div>
              <div className="topic-preview-container pt-2 mt-2 pl-16 pr-4 text-sm text-foreground">
                <TopicPreview previewPosts={topic.preview_posts} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        {hasMore && (
          <button onClick={handleLoadMore} disabled={loading} className="px-6 py-2 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50">
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
