'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { searchAll } from '@/services/searchService';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface SearchResult {
  type: 'article' | 'forum_topic';
  main_category: string;
  category_slug: string;
  slug: string;
  title: string;
  description: string;
}

const RecherchePage = () => {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      const performSearch = async () => {
        setLoading(true);
        const { data, error } = await searchAll(supabase, q);
        if (error) {
          toast.error("Erreur lors de la recherche.");
          console.error(error);
          setResults([]);
        } else {
          setResults(data || []);
        }
        setLoading(false);
      };
      performSearch();
    }
  }, [searchParams, supabase]);

  const getResultLink = (result: SearchResult) => {
    if (result.type === 'article') {
      return `/${result.main_category}/${result.category_slug}/${result.slug}`;
    } else if (result.type === 'forum_topic') {
      return `/forum-sur-les-philippines/sujet/${result.slug}`;
    }
    return '/';
  };

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Recherche</h1>
      <form className="mb-8">
        <div className="relative">
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans les articles et le forum..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-lg focus:ring-2 focus:ring-ring focus:border-primary"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </form>

      <div>
        {loading && (
          <div className="text-center p-6">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin text-primary text-2xl" />
            <p className="mt-2 text-muted-foreground">Recherche en cours...</p>
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="text-center p-6 bg-card rounded-lg shadow">
            <p className="text-muted-foreground">Aucun résultat trouvé pour votre recherche.</p>
          </div>
        )}
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={`${result.type}-${result.slug}-${index}`} className="bg-card p-6 rounded-lg shadow transition-shadow duration-300 hover:shadow-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-2">
                  <Link href={getResultLink(result)} className="text-primary hover:underline">
                    {result.title}
                  </Link>
                </h2>
                <span className="text-xs font-semibold uppercase text-card-foreground bg-blue-500 px-2 py-1 rounded-full">
                  {result.type === 'article' ? 'Article' : 'Forum'}
                </span>
              </div>
              <p className="text-muted-foreground">{result.description}...</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default RecherchePage;
