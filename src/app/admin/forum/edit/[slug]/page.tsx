'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTopicBySlug, getPostsByTopicId } from '@/services/forumService';
import { updateTopicAction } from '@/app/actions/forumActions';
import { createClient } from '@/utils/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface Topic {
  id: number;
  title: string;
}

const EditTopicPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const supabase = createClient();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<number | null>(null);

  const fetchTopic = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    
    const { data: topicData, error: topicError } = await getTopicBySlug(supabase, slug);
    if (topicError || !topicData) {
      toast.error("Impossible de charger le sujet.");
      setLoading(false);
      return;
    }
    
    setTopic(topicData);
    setTitle(topicData.title);
    
    const { data: postsData, error: postsError } = await getPostsByTopicId(supabase, topicData.id);
    if (postsError || !postsData || postsData.length === 0) {
      toast.error("Impossible de charger le contenu du sujet.");
    } else {
      setPostId(postsData[0].id);
      try {
        const contentAsObject = JSON.parse(postsData[0].content);
        setContent(contentAsObject);
      } catch (e) {
        toast.error("Le format du contenu est invalide.");
        console.error("Failed to parse topic content:", e);
      }
    }
    
    setLoading(false);
  }, [slug, supabase]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !postId) {
      toast.error("Les données du sujet ne sont pas chargées.");
      return;
    }
    
    const result = await updateTopicAction(topic.id, postId, title, JSON.stringify(content));

    if (result.success) {
      toast.success("Sujet mis à jour avec succès !");
      router.push('/admin/forum');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <FontAwesomeIcon icon={faSpinner} className="fa-spin text-3xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">Titre</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-ring focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-foreground">Contenu</label>
        <div className="mt-1 border border-border rounded-md">
          <Editor holder="editor-edit-topic" data={content} onChange={setContent} />
        </div>
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Mettre à jour
      </button>
    </form>
  );
};

export default EditTopicPage;
