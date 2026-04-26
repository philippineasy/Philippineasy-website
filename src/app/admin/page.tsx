import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import {
  Newspaper, Users, MessagesSquare, Map, CreditCard,
  Heart, Phone, TrendingUp, ArrowUpRight,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminSection,
  AdminBadge,
} from '@/components/admin';

export const dynamic = 'force-dynamic';

async function fetchDashboardStats() {
  const supabase = await createClient();

  const [
    { data: articles },
    { count: usersCount },
    { count: topicsCount },
    { count: postsCount },
    { data: itineraryStats },
    { data: serviceStats },
    { count: datingProfilesCount },
  ] = await Promise.all([
    supabase.from('articles').select('status'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('forum_topics').select('*', { count: 'exact', head: true }),
    supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
    supabase.from('itinerary_generations').select('payment_status, amount_paid, created_at'),
    supabase.from('service_purchases').select('status, amount, created_at'),
    supabase.from('dating_profiles').select('*', { count: 'exact', head: true }),
  ]);

  const articlePub = articles?.filter((a: any) => a.status === 'published').length || 0;
  const articleDraft = articles?.filter((a: any) => a.status === 'draft').length || 0;

  const itinPaid = itineraryStats?.filter((g: any) => g.payment_status === 'completed').length || 0;
  const itinTotal = itineraryStats?.length || 0;
  const itinRev30d = (itineraryStats || [])
    .filter((g: any) => g.payment_status === 'completed' && new Date(g.created_at) >= new Date(Date.now() - 30 * 86400000))
    .reduce((s: number, g: any) => s + Number(g.amount_paid || 0), 0);

  const servicePaid = serviceStats?.filter((s: any) => s.status === 'paid' || s.status === 'active').length || 0;
  const serviceRev30d = (serviceStats || [])
    .filter((s: any) => (s.status === 'paid' || s.status === 'active') && new Date(s.created_at) >= new Date(Date.now() - 30 * 86400000))
    .reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0);

  return {
    articles: { total: articles?.length || 0, published: articlePub, draft: articleDraft },
    users: usersCount || 0,
    forum: { topics: topicsCount || 0, posts: postsCount || 0 },
    itineraries: { total: itinTotal, paid: itinPaid },
    services: { paid: servicePaid },
    dating: datingProfilesCount || 0,
    revenue30d: itinRev30d + serviceRev30d,
    revItineraires30d: itinRev30d,
    revServices30d: serviceRev30d,
  };
}

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  const conversionItin = stats.itineraries.total > 0
    ? Math.round((stats.itineraries.paid / stats.itineraries.total) * 100)
    : 0;

  return (
    <>
      <AdminPageHeader
        eyebrow="Tableau de bord"
        title={<>Vue d'<span className="text-accent">ensemble</span></>}
        description={<>Pulse de la plateforme Philippin'Easy — contenus, ventes, communauté et IA.</>}
      />

      <AdminSection eyebrow="Activité commerciale" title="Revenus & conversions (30 derniers jours)">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <AdminStatCard
            label="Revenu total 30 j"
            value={`${stats.revenue30d.toFixed(2)}€`}
            hint={<>Itinéraires {stats.revItineraires30d.toFixed(0)}€ · Services {stats.revServices30d.toFixed(0)}€</>}
            accent="accent"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Itinéraires payés"
            value={stats.itineraries.paid}
            hint={`${stats.itineraries.total} générations totales`}
            accent="primary"
            icon={<Map className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Conversion IA"
            value={`${conversionItin}%`}
            hint={`${stats.itineraries.paid} sur ${stats.itineraries.total}`}
            accent={conversionItin >= 15 ? 'emerald' : conversionItin >= 5 ? 'accent' : 'rose'}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Services actifs"
            value={stats.services.paid}
            hint="Buddy / Voyage Serein / Pack Ultime"
            accent="violet"
            icon={<Phone className="w-5 h-5" />}
          />
        </div>
      </AdminSection>

      <AdminSection eyebrow="Engagement" title="Contenus & communauté">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <AdminStatCard
            label="Articles publiés"
            value={stats.articles.published}
            hint={`${stats.articles.draft} brouillons`}
            accent="primary"
            icon={<Newspaper className="w-5 h-5" />}
          />
          <AdminStatCard label="Utilisateurs" value={stats.users} accent="sky" icon={<Users className="w-5 h-5" />} />
          <AdminStatCard
            label="Forum"
            value={stats.forum.topics}
            hint={`${stats.forum.posts} messages`}
            accent="emerald"
            icon={<MessagesSquare className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Profils Rencontre"
            value={stats.dating}
            accent="rose"
            icon={<Heart className="w-5 h-5" />}
          />
        </div>
      </AdminSection>

      <AdminSection eyebrow="Actions rapides" title="Tableaux de suivi">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink
            href="/admin/itinerary-sales"
            icon={<Map className="w-5 h-5" />}
            title="Itinéraires IA"
            description={`Suivi ventes, conversion, breakdown par offre. ${conversionItin}% conversion actuelle.`}
            badge={<AdminBadge tone="primary" dot>{stats.itineraries.paid} payés</AdminBadge>}
          />
          <QuickLink
            href="/admin/customers"
            icon={<Users className="w-5 h-5" />}
            title="Clients & CRM"
            description="Profils achat, conversations, notes admin, historique transactions."
          />
          <QuickLink
            href="/admin/calls"
            icon={<Phone className="w-5 h-5" />}
            title="Planning appels"
            description="Créneaux disponibles, réservations à venir, historique."
          />
          <QuickLink
            href="/admin/revenue"
            icon={<TrendingUp className="w-5 h-5" />}
            title="Revenus consolidés"
            description="Vue agrégée tous services + itinéraires, breakdown mensuel."
            badge={<AdminBadge tone="accent">30j: {stats.revenue30d.toFixed(0)}€</AdminBadge>}
          />
          <QuickLink
            href="/admin/articles"
            icon={<Newspaper className="w-5 h-5" />}
            title="Articles"
            description={`${stats.articles.total} articles. Création, édition, planification.`}
          />
          <QuickLink
            href="/admin/dating"
            icon={<Heart className="w-5 h-5" />}
            title="Modération Rencontre"
            description="Validation profils, photos, signalements."
          />
        </div>
      </AdminSection>
    </>
  );
}

function QuickLink({
  href, icon, title, description, badge,
}: {
  href: string; icon: React.ReactNode; title: string; description: string; badge?: React.ReactNode;
}) {
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl">
      <AdminCard hoverable>
        <div className="flex items-start gap-3 mb-2">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <strong className="text-[15px] font-semibold text-ink truncate">{title}</strong>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-snug">{description}</p>
          </div>
        </div>
        {badge && <div className="mt-3">{badge}</div>}
      </AdminCard>
    </Link>
  );
}
