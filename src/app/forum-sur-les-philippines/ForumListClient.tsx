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

  const getBadgeColorClass = (name: string) => {
    const nameLower = (name || '').toLowerCase();
    if (nameLower.includes('expat')) return 'bg-primary/10 text-primary/90';
    if (nameLower.includes('voyage')) return 'bg-yellow-100 text-yellow-800';
    if (nameLower.includes('culture')) return 'bg-green-100 text-green-800';
    if (nameLower.includes('travail')) return 'bg-purple-100 text-purple-800';
    if (nameLower.includes('gastro')) return 'bg-red-100 text-red-800';
    if (nameLower.includes('rencontre')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-muted text-foreground';
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialCategories.map((category) => (
          <div key={category.id} className="forum-card bg-card rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold mr-2">{category.name}</h3>
                <span className={`${getBadgeColorClass(category.name)} text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap`}>
                  {category.topic_count} sujet{category.topic_count !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm min-h-[3em]">{category.description}</p>
            </div>
            <div className="border-t pt-3 mt-auto text-xs">
              {category.last_topic_title ? (
                <>
                  <p className="mb-1 text-sm truncate" title={category.last_topic_title}>
                    Dernier: <Link href={`/forum-sur-les-philippines/sujet/${category.last_topic_slug}`} className="text-primary hover:underline font-medium">{category.last_topic_title}</Link>
                  </p>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <div className="relative w-4 h-4 rounded-full inline-block mr-1.5 align-middle">
                      <Image src={category.last_post_author_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(category.last_post_author_username)}&background=random&size=24&font-size=0.5&length=1&color=fff`} alt={`Avatar de ${category.last_post_author_username}`} fill className="rounded-full" sizes="16px" />
                    </div>
                    <span className="font-medium">{category.last_post_author_username}</span> - {formatRelativeTime(category.last_post_timestamp)}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">Aucune activité récente.</p>
              )}
            </div>
            <Link href={`/forum-sur-les-philippines/${category.slug}`} className="mt-4 inline-block text-primary hover:text-primary/90 font-semibold text-sm self-start">
              Voir le forum →
            </Link>
          </div>
        ))}
      </div>

      {!user && (
        <div className="mt-16 text-center">
          <Link href="/connexion" className="inline-block px-8 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
            <FontAwesomeIcon icon={faRightToBracket} className="mr-2" /> Connectez-vous pour participer !
          </Link>
          <p className="mt-4 text-muted-foreground">
            Ou <Link href="/connexion#register" className="text-primary hover:underline">créez un compte gratuitement</Link>.
          </p>
        </div>
      )}
    </>
  );
};
