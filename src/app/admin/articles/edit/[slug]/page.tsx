'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { OutputData } from '@editorjs/editorjs';
import { getArticleBySlug } from '@/services/articleService';
import { getAllCategories } from '@/services/categoryService';
import { updateArticleAndRevalidate } from '@/app/actions/articleActions';
import toast from 'react-hot-toast';
import DynamicEditor from '@/components/shared/DynamicEditor';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';

interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  status: string;
  category_id: number;
  content: OutputData;
}

interface Category {
  id: number;
  name: string;
}

const EditArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const formRef = useRef<HTMLFormElement>(null);

  const [article, setArticle] = useState<Article | null>(null);
  const [initialArticle, setInitialArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  // const [status, setStatus] = useState(''); // No longer needed
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const catResult = await getAllCategories(supabase);
      if (catResult.error) {
        toast.error("Impossible de charger les catégories.");
      } else {
        setCategories(catResult.data || []);
      }

      if (slug) {
        const articleResult = await getArticleBySlug(supabase, slug);
        if (articleResult.error) {
          toast.error("Impossible de charger l'article.");
          setArticle(null);
        } else {
          const fetchedArticle = articleResult.data as Article;
          // Ensure content is a valid OutputData object
          if (typeof fetchedArticle.content === 'string') {
            try {
              fetchedArticle.content = JSON.parse(fetchedArticle.content);
            } catch (error) {
              console.error("Failed to parse article content, initializing as empty:", error);
              fetchedArticle.content = { blocks: [] };
            }
          } else if (!fetchedArticle.content || typeof fetchedArticle.content !== 'object' || !fetchedArticle.content.blocks) {
            fetchedArticle.content = { blocks: [] };
          }
          setArticle(fetchedArticle);
          setInitialArticle(JSON.parse(JSON.stringify(fetchedArticle))); // Deep copy
          // setStatus(fetchedArticle.status); // No longer needed
          setCategoryId(fetchedArticle.category_id);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [slug, supabase]);

  useEffect(() => {
    if (!article || !initialArticle) {
      setIsDirty(false);
      return;
    }
    // Simple JSON string comparison for deep equality check
    const hasChanged = JSON.stringify(article) !== JSON.stringify(initialArticle) || thumbnailFile !== null;
    setIsDirty(hasChanged);
  }, [article, initialArticle, thumbnailFile]);

  const handleContentChange = useCallback((newContent: OutputData) => {
    setArticle(prevArticle => {
      if (!prevArticle) return null;
      return { ...prevArticle, content: newContent };
    });
  }, []);

  const handleInputChange = (field: keyof Article, value: any) => {
    setArticle(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!article || !isDirty) {
      toast("Aucune modification à enregistrer.");
      return;
    }
    setIsSaving(true);

    try {
      const updates = {
        title: (formRef.current?.elements.namedItem('title') as HTMLInputElement)?.value,
        slug: (formRef.current?.elements.namedItem('slug') as HTMLInputElement)?.value,
        category_id: parseInt((formRef.current?.elements.namedItem('category') as HTMLSelectElement)?.value, 10),
        status: article.status,
        content: article.content,
        imageFile: thumbnailFile,
      };

      const result = await updateArticleAndRevalidate(article.id, updates);

      if (result.success) {
        toast.success('Article mis à jour avec succès !');
        router.push('/admin/articles');
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p>Chargement de l'éditeur...</p>;
  }
  
  if (!article) {
    return <p>Article non trouvé.</p>;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-4xl font-bold">Modifier l'article</h1>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <label htmlFor="title" className="block text-lg font-medium text-foreground">Titre</label>
          <input type="text" id="title" name="title" defaultValue={article.title} className="mt-1 block w-full text-2xl px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary" required />
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <label htmlFor="editorjs" className="block text-lg font-medium text-foreground">Contenu</label>
          <DynamicEditor
            key={article.id}
            holder="editorjs"
            data={article.content}
            onChange={handleContentChange}
          />
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card p-6 rounded-lg shadow-lg sticky top-8">
          <h2 className="text-xl font-semibold mb-4">Publication</h2>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground">Statut</label>
            <CustomSelect
              name="status"
              options={statusOptions}
              value={article.status}
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={isSaving || !isDirty} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:bg-muted disabled:text-muted-foreground">
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Détails</h2>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground">Slug</label>
            <input type="text" id="slug" name="slug" defaultValue={article.slug} className="mt-1 block w-full px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary" required />
          </div>
          <div className="mt-4">
            <label htmlFor="category" className="block text-sm font-medium text-foreground">Catégorie</label>
            <CustomSelect
              name="category"
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              value={article.category_id}
              onChange={(value) => handleInputChange('category_id', value)}
            />
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Image à la une</h2>
          {article.image && (
            <div className="relative w-full h-48 mb-4">
              <Image src={article.image} alt="Aperçu" fill className="object-cover rounded-md" />
            </div>
          )}
          <input 
            type="file" 
            id="image-upload" 
            name="image-upload" 
            onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
          />
        </div>
      </div>
    </form>
  );
};

export default EditArticlePage;
