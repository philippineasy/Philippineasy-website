import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { ForumListClient } from '@/app/forum-sur-les-philippines/ForumListClient';
import { ForumCommunityLinks } from '@/components/forum/ForumCommunityLinks';
import { ForumStatePanel } from '@/components/forum/ForumStatePanel';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { PageHero, CTABand } from '@/components/sections';
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum Philippines : Communauté & Entraide',
  description: 'Rejoignez la communauté francophone des Philippines : posez vos questions, partagez vos expériences, trouvez des conseils sur le voyage, l\'expatriation et la vie aux Philippines.',
  keywords: [
    'forum Philippines',
    'communauté Philippines',
    'expat Philippines',
    'questions Philippines',
    'conseils voyage Philippines',
    'entraide Philippines',
    'français Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/forum-sur-les-philippines',
  },
  openGraph: {
    title: 'Forum Philippines : Communauté & Entraide',
    description: 'Rejoignez la communauté francophone des Philippines : questions, conseils et partage d\'expériences.',
    url: 'https://philippineasy.com/forum-sur-les-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forum Philippines - Communauté',
    description: 'Communauté francophone des Philippines',
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

const HERO_IMAGE = '/imagesHero/hutte-philippines.webp';
const HERO_ALT = 'Maison traditionnelle philippine (bahay kubo) nichée dans la végétation tropicale';

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { label: 'Forum' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Forum', item: '/forum-sur-les-philippines' },
];

// This is a Server Component
const ForumsPage = async () => {
  const supabase = await createClient();
  const { data: forumCategories, error } = await getForumCategories(supabase);

  if (error) {
    return (
      <div className="bg-background">
        <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
        <PageHero
          eyebrow="Communauté francophone"
          title="Forum des"
          titleAccent="Philippines"
          subtitle="La communauté francophone des Philippines : voyage, expatriation et vie sur l'archipel."
          imageUrl={HERO_IMAGE}
          imageAlt={HERO_ALT}
        />
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ForumStatePanel
              icon={<AlertTriangle className="h-6 w-6" aria-hidden="true" />}
              title="Le forum est momentanément indisponible"
              description="Impossible de charger les catégories pour l'instant. Réessayez dans un moment ou revenez à l'accueil."
              actions={[{ label: "Retour à l'accueil", href: '/', variant: 'primary' }]}
            />
          </div>
        </section>
      </div>
    );
  }

  const categories = forumCategories || [];
  const totalTopics = categories.reduce((sum, category) => sum + (category.topic_count || 0), 0);

  const stats =
    totalTopics > 0
      ? [
          { value: totalTopics.toLocaleString('fr-FR'), label: 'sujets ouverts' },
          { value: String(categories.length), label: 'catégories' },
          { value: '100%', label: 'francophone' },
        ]
      : undefined;

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Communauté francophone"
        title="Forum des"
        titleAccent="Philippines"
        subtitle="Posez vos questions, partagez vos expériences et trouvez des conseils auprès de voyageurs et d'expatriés installés sur place."
        imageUrl={HERO_IMAGE}
        imageAlt={HERO_ALT}
        stats={stats}
      />

      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <ForumListClient initialCategories={categories} />
        </div>
      </section>

      <ForumCommunityLinks />

      <CTABand
        title="Une question sur"
        titleAccent="les Philippines ?"
        subtitle="Créez votre compte gratuit pour ouvrir un sujet, ou laissez notre assistant composer votre itinéraire sur mesure."
        primary={{ label: 'Rejoindre la communauté', href: '/connexion#register' }}
        secondary={{ label: 'Créer mon itinéraire IA', href: '/itineraire-personnalise-pour-les-philippines' }}
      />
    </div>
  );
};

export default ForumsPage;
