'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTopicBySlug, getPostsByTopicId, addForumPost, deleteForumPost, updateForumPost, lockForumTopic, pinForumTopic, deleteForumTopic } from '@/services/forumService';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight, faEdit, faTrash, faLock, faThumbtack, faLink, faUnlock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faXTwitter, faWhatsapp, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import dynamic from 'next/dynamic';
import { OutputData, BlockToolData } from '@editorjs/editorjs';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';
import sanitizeHtml from 'sanitize-html';
import { GradientAvatar } from '@/components/forum/GradientAvatar';

// Contenu redige par les membres (EditorJS jsonb) : meme politique de
// sanitization que les articles (src/components/articles/EditorialRenderer.tsx)
// pour neutraliser tout XSS stocke (ex: <img src=x onerror=...>) avant tout
// dangerouslySetInnerHTML.
const sanitize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'iframe', 'mark', 'del', 'ins', 'sup', 'sub',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'frameborder', 'allow', 'allowfullscreen', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface PostAuthor {
  username: string;
  avatar_url: string;
  created_at: string;
  forum_post_count: number;
}

interface Post {
  id: number;
  author: PostAuthor;
  created_at: string;
  updated_at: string;
  content: string;
  user_id: string;
}

interface Topic {
  id: number;
  title: string;
  slug: string;
  is_locked: boolean;
  is_pinned: boolean;
  view_count?: number;
  reply_count?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface TopicClientPageProps {
    initialTopic: Topic;
    initialPosts: Post[];
}

interface Profile {
  role: string;
}

// EditorJS lists can be nested and their items can be objects ({ content, items })
// rather than plain strings — render the text (and any nested list) instead of
// leaking "[object Object]". sanitize() is applied to every item exactly like the
// other blocks, so the XSS policy stays untouched.
const renderForumList = (items: unknown[], style: string, keyPrefix: string) => {
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  return (
    <Tag key={keyPrefix}>
      {(items || []).map((item, i) => {
        const isObj = typeof item === 'object' && item !== null;
        const text = isObj ? ((item as { content?: string }).content ?? '') : String(item ?? '');
        const nestedRaw = isObj ? (item as { items?: unknown[] }).items : undefined;
        const nested = Array.isArray(nestedRaw) && nestedRaw.length > 0 ? nestedRaw : null;
        return (
          <li key={`${keyPrefix}-${i}`}>
            <span dangerouslySetInnerHTML={{ __html: sanitize(text) }} />
            {nested && renderForumList(nested, style, `${keyPrefix}-${i}`)}
          </li>
        );
      })}
    </Tag>
  );
};

const renderPostContent = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.blocks.map((block: BlockToolData, index: number) => {
        switch (block.type) {
          case 'header': {
            // Clamp H1 to H2: the only <h1> on the page is the topic title, so a
            // member-entered H1 must not become a second page <h1> (SEO).
            const level = block.data.level;
            if (level === 3) return <h3 key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
            if (level === 4) return <h4 key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
            if (level === 5) return <h5 key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
            if (level === 6) return <h6 key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
            return <h2 key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
          }
          case 'paragraph':
            return <p key={index} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
          case 'list':
            return renderForumList(block.data.items, block.data.style, `list-${index}`);
          case 'quote':
            return (
              <blockquote key={index}>
                <div dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />
                {block.data.caption && (
                  <cite className="mt-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    — {block.data.caption}
                  </cite>
                )}
              </blockquote>
            );
          case 'image':
            return (
              <div key={index} className="relative my-5 w-full overflow-hidden rounded-xl shadow-card-rest" style={{ aspectRatio: '16/9' }}>
                <Image src={block.data.file.url} alt={block.data.caption || 'Image du post'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
              </div>
            );
          case 'table':
            return (
              <table key={index}>
                <tbody>
                  {block.data.content.map((row: string[], i: number) => (
                    <tr key={i}>
                      {row.map((cell: string, j: number) => (
                        <td key={j} dangerouslySetInnerHTML={{ __html: sanitize(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case 'delimiter':
            return <hr key={index} />;
          default:
            return null;
        }
      });
    } catch {
      return <p>{content}</p>;
    }
  };

  const PostComponent = ({ post, postNumber, isOp, onQuote, user, profile, onPostUpdate }: { post: Post, postNumber: number, isOp: boolean, onQuote: (postId: number, author: string, content: string) => void, user: User | null, profile: Profile | null, onPostUpdate: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editContent, setEditContent] = useState<OutputData | undefined>(undefined);

    const handleEdit = () => {
      try {
        const contentAsObject = JSON.parse(post.content);
        setEditContent(contentAsObject);
        setIsEditing(true);
      } catch {
        console.error("Failed to parse post content for editing:");
      }
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditContent(undefined);
    };

    const handleSave = async () => {
      if (!editContent) return;
      const { error } = await updateForumPost(supabase, post.id, JSON.stringify(editContent));
      if (!error) {
        setIsEditing(false);
        onPostUpdate(); // Refresh posts from parent
      } else {
        console.error("Failed to save post:", error);
        toast.error("Erreur lors de la sauvegarde.");
      }
    };

    const handleDelete = async () => {
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      const { error } = await deleteForumPost(supabase, post.id);
      if (!error) {
        toast.success("Message supprimé avec succès.");
        onPostUpdate(); // Refresh posts from parent
      } else {
        toast.error("Erreur lors de la suppression du message.");
        console.error("Delete failed:", error);
      }
      setIsDeleteModalOpen(false);
    };

    const joinedLabel = post.author?.created_at
      ? new Date(post.author.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : null;

    return (
      <>
        <article id={`post-${post.id}`} className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest md:flex-row">
          <h2 className="sr-only">
            {isOp ? `Message original de ${post.author?.username || 'Utilisateur'}` : `Réponse de ${post.author?.username || 'Utilisateur'}`}
          </h2>
          <div className="flex flex-shrink-0 flex-row items-center gap-3 border-b-[0.5px] border-border p-5 text-left md:w-[180px] md:flex-col md:items-start md:border-b-0 md:border-r-[0.5px]">
            <GradientAvatar
              src={post.author?.avatar_url}
              name={post.author?.username}
              className="h-14 w-14 rounded-full ring-1 ring-border"
              imgSizes="56px"
              textClassName="text-[20px]"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate font-semibold text-foreground">{post.author?.username || 'Utilisateur'}</p>
                {isOp && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-primary">
                    Auteur
                  </span>
                )}
              </div>
              {joinedLabel && <p className="mt-1 text-xs text-muted-foreground">Membre depuis {joinedLabel}</p>}
              <p className="text-xs text-muted-foreground">{post.author?.forum_post_count ?? 0} message{(post.author?.forum_post_count ?? 0) !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="min-w-0 flex-grow p-5">
            <div className="mb-3 flex items-center justify-between gap-3 border-b-[0.5px] border-border pb-3 text-xs text-muted-foreground">
              <span suppressHydrationWarning>Posté le {new Date(post.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <div className="flex items-center gap-3">
                <a href={`#post-${post.id}`} className="text-muted-foreground hover:text-primary hover:underline">#{postNumber}</a>
                <button onClick={() => onQuote(post.id, post.author?.username || 'Utilisateur', post.content)} className="text-muted-foreground hover:text-primary" title="Citer">
                  <FontAwesomeIcon icon={faQuoteRight} /> <span className="hidden sm:inline">Citer</span>
                </button>
                {user && (user.id === post.user_id || profile?.role === 'super_admin') && (
                  <>
                    <button onClick={handleEdit} className="text-muted-foreground hover:text-accent-strong" title="Modifier">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive" title="Supprimer">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="edit-editor-container">
                <div className="rounded-lg border border-border p-4">
                  <Editor holder={`editor-edit-${post.id}`} data={editContent} onChange={setEditContent} />
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Enregistrer</button>
                  <button onClick={handleCancel} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80">Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="forum-prose">{renderPostContent(post.content)}</div>
                {post.updated_at && new Date(post.updated_at) > new Date(post.created_at) && (
                  <p className="mt-4 border-t-[0.5px] border-border pt-2 text-xs italic text-muted-foreground">Modifié le {new Date(post.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                )}
              </>
            )}
          </div>
        </article>
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmer la suppression">
            <p className="text-muted-foreground mb-6">Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">
                    Annuler
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-card-foreground bg-destructive hover:bg-destructive/90 rounded-md">
                    Supprimer
                </button>
            </div>
        </Modal>
      </>
    );
  };

export const TopicClientPage = ({ initialTopic, initialPosts }: TopicClientPageProps) => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [replyContent, setReplyContent] = useState<OutputData>({ blocks: [] });
  const editorReplyRef = useRef<{ clear: () => void, blocks: { insert: (type: string, data: Record<string, unknown>, config: Record<string, unknown>, index: number, needsRender: boolean) => void, getBlocksCount: () => number } } | null>(null);
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const fetchTopicAndPosts = useCallback(async () => {
    const { data: topicData, error: topicError } = await getTopicBySlug(supabase, initialTopic.slug);
    if (topicData && !topicError) {
      setTopic(topicData);
      const { data: postsData, error: postsError } = await getPostsByTopicId(supabase, topicData.id);
      if(postsData && !postsError) {
        setPosts(postsData);
      }
    }
  }, [initialTopic.slug, supabase]);


  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !topic || topic.is_locked) return;
    const { error } = await addForumPost(supabase, topic.id, user.id, JSON.stringify(replyContent));
    if (!error) {
      fetchTopicAndPosts(); // Re-fetch all posts to include the new one
      if (editorReplyRef.current?.clear) {
        editorReplyRef.current.clear();
      }
    } else {
      console.error(error);
      toast.error("Erreur lors de la publication de la réponse.");
    }
  };

  const handleQuote = (postId: number, author: string, content: string) => {
    if (!editorReplyRef.current) return;
    try {
      const parsedContent = JSON.parse(content);
      const textToQuote = parsedContent.blocks.map((b: BlockToolData) => b.data.text).join('\n');
      const quoteData = { text: textToQuote, caption: author };
      editorReplyRef.current.blocks.insert('quote', quoteData, {}, editorReplyRef.current.blocks.getBlocksCount(), true);
      document.getElementById('reply-form-container')?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      console.error("Could not parse content to quote:");
    }
  };

  const handleLockTopic = async () => {
    if (!topic) return;
    setModalContent({
      title: topic.is_locked ? 'Déverrouiller le sujet' : 'Verrouiller le sujet',
      message: `Êtes-vous sûr de vouloir ${topic.is_locked ? 'déverrouiller' : 'verrouiller'} ce sujet ?`
    });
    setModalAction(() => async () => {
      const { error } = await lockForumTopic(supabase, topic.id, !topic.is_locked);
      if (!error) toast.success(`Sujet ${topic.is_locked ? 'déverrouillé' : 'verrouillé'}.`);
      else toast.error("Erreur lors de l'opération.");
      fetchTopicAndPosts();
      setModalAction(null);
    });
  };

  const handlePinTopic = async () => {
    if (!topic) return;
    setModalContent({
      title: topic.is_pinned ? 'Désépingler le sujet' : 'Épingler le sujet',
      message: `Êtes-vous sûr de vouloir ${topic.is_pinned ? 'désépingler' : 'épingler'} ce sujet ?`
    });
    setModalAction(() => async () => {
      const { error } = await pinForumTopic(supabase, topic.id, !topic.is_pinned);
      if (!error) toast.success(`Sujet ${topic.is_pinned ? 'désépinglé' : 'épinglé'}.`);
      else toast.error("Erreur lors de l'opération.");
      fetchTopicAndPosts();
      setModalAction(null);
    });
  };

  const handleDeleteTopic = async () => {
    if (!topic) return;
    setModalContent({
      title: 'Supprimer le Sujet',
      message: `Êtes-vous sûr de vouloir supprimer ce sujet et tous ses messages ? Cette action est définitive.`
    });
    setModalAction(() => async () => {
      const { error } = await deleteForumTopic(supabase, topic.id);
      if (!error) {
        toast.success("Sujet supprimé avec succès.");
        router.push('/forum-sur-les-philippines');
      } else {
        toast.error("Erreur lors de la suppression du sujet.");
      }
      setModalAction(null);
    });
  };

  const confirmModalAction = () => {
    if (modalAction) {
      modalAction();
    }
  };

  const firstPost = posts[0];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {topic.is_pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent-strong">
            <FontAwesomeIcon icon={faThumbtack} className="h-2.5 w-2.5" /> Épinglé
          </span>
        )}
        {topic.is_locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5" /> Verrouillé
          </span>
        )}
      </div>

      <h1
        className="font-bold text-foreground"
        style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
      >
        {topic.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b-[0.5px] border-border pb-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {firstPost && (
            <>
              <span>par <strong className="font-medium text-foreground">{firstPost.author?.username || 'Utilisateur'}</strong></span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{topic.reply_count ?? posts.length} réponses</span>
          {typeof topic.view_count === 'number' && (
            <>
              <span aria-hidden="true">·</span>
              <span>{topic.view_count.toLocaleString('fr-FR')} vues</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!topic.is_locked && (
            <a
              href="#reply-form-container"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Répondre
            </a>
          )}
          <span className="text-sm text-muted-foreground">Partager :</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" title="Partager sur Facebook" className="text-muted-foreground hover:text-primary">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(topic.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur X" className="text-muted-foreground hover:text-foreground">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(topic.title + ' ' + currentUrl)}`} target="_blank" rel="noopener noreferrer" title="Partager sur WhatsApp" className="text-muted-foreground hover:text-[hsl(var(--success))]">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodeURIComponent(topic.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur LinkedIn" className="text-muted-foreground hover:text-primary">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <button onClick={() => { navigator.clipboard.writeText(currentUrl); toast.success('Lien copié.'); }} title="Copier le lien" className="text-muted-foreground hover:text-primary">
            <FontAwesomeIcon icon={faLink} />
          </button>
        </div>
      </div>

      {profile?.role === 'super_admin' && (
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleLockTopic} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${topic.is_locked ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-accent/10 text-accent-strong hover:bg-accent/20'}`}>
            <FontAwesomeIcon icon={topic.is_locked ? faUnlock : faLock} /> {topic.is_locked ? 'Déverrouiller' : 'Verrouiller'}
          </button>
          <button onClick={handlePinTopic} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${topic.is_pinned ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <FontAwesomeIcon icon={faThumbtack} /> {topic.is_pinned ? 'Désépingler' : 'Épingler'}
          </button>
          <button onClick={handleDeleteTopic} className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20">
            <FontAwesomeIcon icon={faTrash} /> Supprimer le sujet
          </button>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {posts.map((post, index) => (
          <PostComponent key={post.id} post={post} postNumber={index + 1} isOp={index === 0} onQuote={handleQuote} user={user} profile={profile} onPostUpdate={fetchTopicAndPosts} />
        ))}
      </div>

      <Modal isOpen={!!modalAction} onClose={() => setModalAction(null)} title={modalContent.title}>
        <p className="text-muted-foreground mb-6">{modalContent.message}</p>
        <div className="flex justify-end space-x-4">
            <button onClick={() => setModalAction(null)} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">
                Annuler
            </button>
            <button onClick={confirmModalAction} className="px-4 py-2 text-sm font-medium text-card-foreground bg-primary hover:bg-primary/90 rounded-md">
                Confirmer
            </button>
        </div>
      </Modal>

      <div id="reply-form-container" className="mt-10 scroll-mt-32">
        {topic.is_locked ? (
          <div className="flex items-center gap-3 rounded-2xl border-[0.5px] border-border bg-muted/60 p-6 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faLockOpen} className="h-4 w-4 flex-shrink-0" />
            Ce sujet est verrouillé — les nouvelles réponses ne sont plus acceptées.
          </div>
        ) : user ? (
          <form onSubmit={handleReplySubmit} aria-label="Votre réponse" className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
            <div className="mb-4 flex items-center gap-3">
              <GradientAvatar
                src={profile?.avatar_url}
                name={profile?.username || user.email}
                className="h-10 w-10 rounded-full ring-1 ring-border"
                imgSizes="40px"
                textClassName="text-[15px]"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Vous répondez à ce sujet</p>
                <p className="text-xs text-muted-foreground">Membre connecté</p>
              </div>
            </div>
            <label htmlFor="editorjs-reply" className="sr-only">Votre réponse</label>
            <div className="min-h-[200px] rounded-lg border border-border p-4">
              <Editor holder="editorjs-reply" onChange={setReplyContent} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Formatage riche disponible (titres, listes, citations, images).</span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.99] motion-reduce:transition-none"
              >
                Publier la réponse
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 text-center shadow-card-rest">
            <p className="mb-4 text-sm text-muted-foreground">Connectez-vous pour répondre à ce sujet.</p>
            <Link href="/connexion" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
