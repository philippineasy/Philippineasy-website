import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faChartLine, faBuilding, faStore } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'investir');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/vivre-aux-philippines/investir';
  const description = page.subtitle || 'Guide pour investir aux Philippines : immobilier, bourse et création d\'entreprise.';
  const title = `${page.title} | Immobilier, Bourse & Business`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
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
      title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@philippineasy',
    },
  };
}

const InvestirPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'investir');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Investir aux"
        titlePart2="Philippines"
        subtitle={page.subtitle || "Un marché en pleine croissance offrant des opportunités uniques pour les investisseurs avisés."}
        imageUrl={page.hero_image_url || "/imagesHero/comment-investir-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">L'Investissement en Chiffres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faChartLine} value="+6%" label="Croissance annuelle du PIB (moyenne)" color="primary" />
            <KeyStatCard icon={faBuilding} value="40%" label="Part étrangère max. dans un condo" color="accent" />
            <KeyStatCard icon={faStore} value="100%" label="Détention étrangère possible (retail)" color="primary" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/investir/vue-condominium-philippines.webp"
        imageAlt="Intérieur d'un condominium moderne"
      >
        <h2>L'Immobilier : un <span className="text-primary">Secteur Porteur</span></h2>
        <p>Le marché immobilier, en particulier celui des condominiums (condos) dans les grands centres urbains comme Manille, Cebu et Davao, est très attractif. Les étrangers peuvent posséder un condo à leur nom, ce qui en fait un investissement relativement simple et rentable.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Rendement locatif :</b> Entre 5% et 8% brut en moyenne dans les grandes villes.</li>
          <li><b>Plus-value :</b> Forte appréciation du capital ces dernières années.</li>
          <li><b>Fiscalité :</b> Relativement avantageuse pour les investisseurs étrangers.</li>
        </ul>
        <Link href="/vivre-aux-philippines/investir/immobilier" className="text-primary font-bold hover:underline mt-4 inline-block">Guide de l'investissement immobilier →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop"
          imageAlt="Graphique boursier sur un écran"
          reverse
        >
          <h2>La Bourse et les <span className="text-primary">Entreprises</span></h2>
          <p>Le Philippine Stock Exchange (PSE) offre des opportunités pour ceux qui souhaitent investir en bourse. Par ailleurs, créer ou investir dans une entreprise locale est une autre voie prometteuse, surtout dans les secteurs de la technologie, de l'agritech et du tourisme durable.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Indice PSEi :</b> Le principal indice de la bourse philippine.</li>
            <li><b>Secteurs porteurs :</b> Services financiers, immobilier, consommation.</li>
            <li><b>Dividendes :</b> De nombreuses entreprises versent des dividendes attractifs.</li>
          </ul>
          <Link href="/vivre-aux-philippines/investir/bourse-et-entreprises" className="text-primary font-bold hover:underline mt-4 inline-block">Investir dans les entreprises locales →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default InvestirPage;
