import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faHeart, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Conseils Pratiques pour votre Voyage aux Philippines',
  description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques. De la préparation de votre voyage à la sécurité sur place, ce guide est votre allié.',
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/conseils-voyage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Conseils Pratiques pour votre Voyage aux Philippines',
    description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques.',
    url: 'https://philippineasy.com/voyager-aux-philippines/conseils-voyage',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conseils Pratiques pour votre Voyage aux Philippines',
    description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques.',
    site: '@philippineasy',
  },
};

const ConseilsPratiquesPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'conseils-voyage');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Conseils Pratiques"
        titleAccent="pour les Philippines"
        subtitle="Toutes les clés pour un voyage réussi, de la planification à la vie sur place."
        imageUrl="/images/sante/controle-police-philippines.webp"
        imageAlt="Conseils Pratiques pour les Philippines"
      />

      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">L'Essentiel pour Voyager Serein</h2>
          <StatRow
            tone="default"
            stats={[
              {
                icon: <FontAwesomeIcon icon={faPlane} className="text-[18px]" />,
                value: 'Bien se Préparer',
                label: 'Avant de Partir',
              },
              {
                icon: <FontAwesomeIcon icon={faShieldHalved} className="text-[18px]" />,
                value: "Sécurité d'Abord",
                label: 'Rester en Confiance',
              },
              {
                icon: <FontAwesomeIcon icon={faHeart} className="text-[18px]" />,
                value: 'Culture & Respect',
                label: "S'immerger Localement",
              },
            ]}
          />
        </div>
      </div>

      <SplitSection
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Préparation de vaccins pour un voyage"
        title="Préparation au Voyage :"
        titleAccent="Ne Rien Oublier"
      >
        <p>Une bonne préparation est la clé d'un voyage sans stress. Pensez aux aspects administratifs, sanitaires et logistiques avant de boucler vos valises.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Visas :</b> Vérifiez les exigences de visa pour votre nationalité.</li>
          <li><b>Santé :</b> Consultez votre médecin pour les vaccins et une trousse de premiers secours.</li>
          <li><b>Argent :</b> Prévoyez un mélange de liquide et de cartes de crédit.</li>
        </ul>
        <Link href="/voyager-aux-philippines/sante-securite" className="text-accent font-bold hover:underline mt-4 inline-block">Plus de détails sur la santé et sécurité →</Link>
      </SplitSection>

      <SplitSection
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Dialogue entre deux personnes de cultures différentes"
        reverse
        tone="muted"
        title="Sur Place :"
        titleAccent="Vivre l'Expérience Philippine"
      >
        <p>Une fois sur place, quelques astuces vous aideront à naviguer la culture locale et à profiter pleinement de votre séjour.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Communication :</b> Apprenez quelques mots de tagalog ou de bisaya.</li>
          <li><b>Transport :</b> Maîtrisez l'art de voyager en jeepney ou en tricycle.</li>
          <li><b>Négociation :</b> Le marchandage est courant sur les marchés, mais restez respectueux.</li>
        </ul>
        <Link href="/voyager-aux-philippines/communication" className="text-accent font-bold hover:underline mt-4 inline-block">Communiquer facilement aux Philippines →</Link>
      </SplitSection>

      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold tracking-[-0.01em] text-foreground">Nos Articles de Conseils Pratiques</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default ConseilsPratiquesPage;
