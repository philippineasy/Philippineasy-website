'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faUsers, faComments } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const AdminDashboardPage = () => {
  const supabase = createClient();
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0, scheduled: 0 },
    users: { total: 0, online: 0 },
    forum: { topics: 0, posts: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: articleData, error: articleError } = await supabase.from('articles').select('status');
      const { count: userCount, error: userError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: onlineUsers, error: onlineUsersError } = await supabase.functions.invoke('online-users', {
        method: 'GET',
      });
      const { count: topicCount, error: topicError } = await supabase.from('forum_topics').select('*', { count: 'exact', head: true });
      const { count: postCount, error: postError } = await supabase.from('forum_posts').select('*', { count: 'exact', head: true });

      if (articleError || userError || onlineUsersError || topicError || postError) {
        console.error('Error fetching stats:', articleError, userError, onlineUsersError, topicError, postError);
        return;
      }

      const articleStats = {
        total: articleData?.length || 0,
        published: articleData?.filter(a => a.status === 'published').length || 0,
        draft: articleData?.filter(a => a.status === 'draft').length || 0,
        scheduled: articleData?.filter(a => a.status === 'scheduled').length || 0,
      };

      setStats({
        articles: articleStats,
        users: { total: userCount || 0, online: (onlineUsers as unknown[])?.length || 0 },
        forum: { topics: topicCount || 0, posts: postCount || 0 }
      });
    };

    fetchStats();
  }, [supabase]);

  const StatCard = ({ title, icon, data }: { title: string, icon: IconProp, data: { [key: string]: string | number } }) => {
    const frenchLabels: { [key: string]: string } = {
      total: 'Total',
      online: 'En ligne',
      published: 'Publiés',
      draft: 'Brouillons',
      scheduled: 'Planifiés',
      topics: 'Sujets',
      posts: 'Messages'
    };

    return (
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex items-center text-primary mb-4">
          <FontAwesomeIcon icon={icon} className="fa-2x mr-3" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
              <span className="text-muted-foreground">{frenchLabels[key.toLowerCase()] || key}:</span>
              <span className="font-bold text-foreground">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-12">Tableau de Bord Administrateur</h1>
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Articles" icon={faNewspaper} data={stats.articles} />
        <StatCard title="Utilisateurs" icon={faUsers} data={stats.users} />
        <StatCard title="Forum" icon={faComments} data={stats.forum} />
      </section>

      <h2 className="text-3xl font-semibold text-center mb-8">Accès Rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/admin/articles" className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-primary mb-2">Gérer les Articles</h2>
          <p className="text-muted-foreground">Créer, modifier et supprimer des articles.</p>
        </Link>
        <Link href="/admin/users" className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-primary mb-2">Gérer les Utilisateurs</h2>
          <p className="text-muted-foreground">Modifier les rôles des utilisateurs.</p>
        </Link>
        <Link href="/admin/forum" className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-primary mb-2">Gérer le Forum</h2>
          <p className="text-muted-foreground">Administrer les catégories et les paramètres du forum.</p>
        </Link>
      </div>
    </>
  );
};

export default AdminDashboardPage;
