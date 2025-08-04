'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { getAllCategories } from '@/services/categoryService';
import { createArticleAction } from '@/app/actions/articleActions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';

const DynamicEditor = dynamic(() => import('@/components/shared/DynamicEditor'), {
  ssr: false,
  loading: () => <p>Chargement de l'éditeur...</p>
});

interface Category {
  id: number;
  name: string;
}

const NewArticlePage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('https://via.placeholder.com/300x200');
  const [status, setStatus] = useState('draft');
  const [content, setContent] = useState<OutputData>({ blocks: [] });

  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getAllCategories(supabase);
      if (error) {
        toast.error("Impossible de charger les catégories.");
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };
    fetchCategories();
  }, [supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    formData.set('content', JSON.stringify(content));
    formData.set('status', status);

    const result = await createArticleAction(formData);

    if (result.success) {
      toast.success('Article créé avec succès !');
      router.push('/admin/articles');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-4xl font-bold">Créer un nouvel article</h1>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <label htmlFor="title" className="block text-lg font-medium text-foreground">Titre</label>
          <input type="text" id="title" name="title" className="mt-1 block w-full text-2xl px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary" />
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <label htmlFor="editorjs" className="block text-lg font-medium text-foreground">Contenu</label>
          <div className="mt-2 border border-border rounded-md p-4 min-h-[400px]">
            <DynamicEditor
              holder="editorjs-new"
              data={content}
              onChange={setContent}
            />
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Publication</h2>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground">Statut</label>
            <CustomSelect
              name="status"
              options={statusOptions}
              value={status}
              onChange={(value) => setStatus(value as string)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:bg-gray-400">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Détails</h2>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground">Slug</label>
            <input type="text" id="slug" name="slug" className="mt-1 block w-full px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary" />
          </div>
          <div className="mt-4">
            <label htmlFor="category" className="block text-sm font-medium text-foreground">Catégorie</label>
            <select id="category" name="category" className="mt-1 block w-full px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Image à la une</h2>
          <div className="relative w-full h-48 mb-4">
            <Image src={previewImage} alt="Aperçu" fill className="object-cover rounded-md" />
          </div>
          <input type="file" id="image-upload" name="image-upload" onChange={handleImageChange} required className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary/90 hover:file:bg-primary/10" />
        </div>
      </div>
    </form>
  );
};

export default NewArticlePage;
