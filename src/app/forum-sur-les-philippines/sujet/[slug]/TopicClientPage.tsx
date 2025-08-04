'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getTopicBySlug, getPostsByTopicId, addForumPost, deleteForumPost, updateForumPost, lockForumTopic, pinForumTopic, deleteForumTopic } from '@/services/forumService';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faQuoteRight, faEdit, faTrash, faLock, faThumbtack, faLink, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faXTwitter, faWhatsapp, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import dynamic from 'next/dynamic';
import { OutputData, BlockToolData } from '@editorjs/editorjs';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';

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

const renderPostContent = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.blocks.map((block: BlockToolData, index: number) => {
        switch (block.type) {
          case 'header':
            switch (block.data.level) {
              case 1: return <h1 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case 2: return <h2 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case 3: return <h3 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case 4: return <h4 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case 5: return <h5 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case 6: return <h6 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              default: return null;
            }
          case 'paragraph':
            return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'list':
            if (block.data.style === 'ordered') {
              return (
                <ol key={index} className="list-decimal list-inside">
                  {block.data.items.map((item: string, i: number) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              );
            }
            return (
              <ul key={index} className="list-disc list-inside">
                {block.data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={index}>
                {block.data.caption && <p className="font-bold text-orange-700">{block.data.caption}</p>}
                <div dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </blockquote>
            );
          case 'image':
            return (
              <div key={index} className="relative w-full h-auto my-4" style={{ aspectRatio: '16/9' }}>
                <Image src={block.data.file.url} alt={block.data.caption || 'Image du post'} fill className="max-w-full h-auto rounded-lg shadow-md object-contain" sizes="(max-width: 768px) 100vw, 700px" />
              </div>
            );
          case 'table':
            return (
              <table key={index} className="w-full border-collapse border border-border my-4">
                <tbody>
                  {block.data.content.map((row: string[], i: number) => (
                    <tr key={i} className="border-b border-border">
                      {row.map((cell: string, j: number) => (
                        <td key={j} className="p-2 border border-border" dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case 'delimiter':
            return <hr key={index} className="my-4" />;
          default:
            return null;
        }
      });
    } catch {
      return <p>{content}</p>;
    }
  };
  
  const PostComponent = ({ post, postNumber, onQuote, user, profile, onPostUpdate }: { post: Post, postNumber: number, onQuote: (postId: number, author: string, content: string) => void, user: User | null, profile: Profile | null, onPostUpdate: () => void }) => {
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
        alert("Erreur lors de la sauvegarde.");
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
  
    return (
      <>
        <div id={`post-${post.id}`} className="forum-post bg-card rounded-lg shadow-md flex flex-col md:flex-row">
          <div className="w-full md:w-1/5 p-4 border-b md:border-b-0 md:border-r text-center md:text-left flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full mx-auto md:mx-0 mb-2 border">
              <Image src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${post.author.username}`} alt={`Avatar de ${post.author.username}`} fill className="rounded-full" sizes="64px" />
            </div>
          <p className="font-semibold text-primary break-words">{post.author.username}</p>
          <p className="text-xs text-muted-foreground mt-1">Membre: {new Date(post.author.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          <p className="text-xs text-muted-foreground">Messages: {post.author.forum_post_count}</p>
        </div>
        <div className="w-full md:w-4/5 p-4 flex-grow">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-3 pb-2 border-b">
            <span suppressHydrationWarning>Posté le: {new Date(post.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            <div>
              <a href={`#post-${post.id}`} className="hover:underline mr-3 text-muted-foreground">#{postNumber}</a>
              <button onClick={() => onQuote(post.id, post.author.username, post.content)} className="hover:text-primary text-muted-foreground" title="Citer"><FontAwesomeIcon icon={faQuoteRight} /></button>
              {user && (user.id === post.user_id || profile?.role === 'super_admin') && (
                <>
                  <button onClick={handleEdit} className="hover:text-yellow-600 ml-2 text-muted-foreground" title="Modifier"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={handleDelete} className="hover:text-destructive ml-2 text-muted-foreground" title="Supprimer"><FontAwesomeIcon icon={faTrash} /></button>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="edit-editor-container">
              <Editor holder={`editor-edit-${post.id}`} data={editContent} onChange={setEditContent} />
              <div className="mt-4 flex space-x-2">
                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-card-foreground rounded hover:bg-green-600">Enregistrer</button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-foreground rounded hover:bg-gray-400">Annuler</button>
              </div>
            </div>
          ) : (
            <>
              <div className="post-content prose prose-sm max-w-none text-foreground">{renderPostContent(post.content)}</div>
              {post.updated_at && new Date(post.updated_at) > new Date(post.created_at) && (
                <p className="text-xs italic text-muted-foreground mt-4 pt-2 border-t">Modifié le: {new Date(post.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
              )}
            </>
          )}
        </div>
      </div>
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
    if (!user || !topic) return;
    const { error } = await addForumPost(supabase, topic.id, user.id, JSON.stringify(replyContent));
    if (!error) {
      fetchTopicAndPosts(); // Re-fetch all posts to include the new one
      if (editorReplyRef.current?.clear) {
        editorReplyRef.current.clear();
      }
    } else {
      console.error(error);
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

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{topic.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-accent font-medium pulse-animation">Partager sur :</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" title="Partager sur Facebook" className="text-muted-foreground hover:text-primary">
            <FontAwesomeIcon icon={faFacebookF} size="lg" />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(topic.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur Twitter" className="text-muted-foreground hover:text-foreground">
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(topic.title + ' ' + currentUrl)}`} target="_blank" rel="noopener noreferrer" title="Partager sur WhatsApp" className="text-muted-foreground hover:text-green-500">
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodeURIComponent(topic.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur LinkedIn" className="text-muted-foreground hover:text-primary/90">
            <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
          </a>
          <button onClick={() => navigator.clipboard.writeText(currentUrl)} title="Copier le lien" className="text-muted-foreground hover:text-primary">
            <FontAwesomeIcon icon={faLink} size="lg" />
          </button>
        </div>
      </div>
      
      {profile?.role === 'super_admin' && (
        <div className="mb-6 flex justify-end gap-2">
          <button onClick={handleLockTopic} className={`px-3 py-1 text-sm rounded-md ${topic.is_locked ? 'bg-gray-500 text-card-foreground' : 'bg-accent text-card-foreground hover:bg-accent/90'}`}>
            <FontAwesomeIcon icon={topic.is_locked ? faUnlock : faLock} className="mr-1" /> {topic.is_locked ? 'Déverrouiller' : 'Verrouiller'}
          </button>
          <button onClick={handlePinTopic} className={`px-3 py-1 text-sm rounded-md ${topic.is_pinned ? 'bg-gray-500 text-card-foreground' : 'bg-blue-500 text-card-foreground hover:bg-primary'}`}>
            <FontAwesomeIcon icon={faThumbtack} className="mr-1" /> {topic.is_pinned ? 'Désépingler' : 'Épingler'}
          </button>
          <button onClick={handleDeleteTopic} className="px-3 py-1 text-sm rounded-md bg-destructive text-card-foreground hover:bg-destructive/90">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Supprimer le Sujet
          </button>
        </div>
      )}

      <div className="space-y-6 mb-10">
        {posts.map((post, index) => (
          <PostComponent key={post.id} post={post} postNumber={index + 1} onQuote={handleQuote} user={user} profile={profile} onPostUpdate={fetchTopicAndPosts} />
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

      <div className="mt-8 text-center">
        <button className="px-6 py-2 bg-muted/80 text-foreground rounded-lg hover:bg-gray-300 transition duration-300">
          Voir les messages suivants
        </button>
      </div>

      <div id="reply-form-container" className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Répondre au sujet</h2>
        <form onSubmit={handleReplySubmit} className="bg-card p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label htmlFor="editorjs-reply" className="sr-only">Votre réponse</label>
            <div className="mt-2 border border-border rounded-md p-4 min-h-[200px]">
              <Editor holder="editorjs-reply" onChange={setReplyContent} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold"
            >
              <FontAwesomeIcon icon={faReply} className="mr-2" /> Répondre
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
