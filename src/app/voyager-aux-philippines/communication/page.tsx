import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faSimCard, faLanguage, faWifi } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/communication';
  const description = page.subtitle || 'Guide pour communiquer aux Philippines : carte SIM, internet et expressions utiles en Tagalog.';

  return {
    title: page.title,
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
      title: page.title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
      site: '@philippineasy',
    },
  };
}

const CommunicationPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Communiquer aux"
        titlePart2="Philippines"
        titlePart2Color="accent"
        subtitle={page.subtitle || "De la carte SIM locale aux bases du Tagalog, tous nos conseils pour échanger et rester connecté."}
        imageUrl={page.hero_image_url || "/imagesHero/antennes-reseaux-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">La Communication en Bref</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faSimCard} value="Globe & Smart" label="Principaux opérateurs mobiles" color="accent" />
            <KeyStatCard icon={faLanguage} value="Anglais" label="Langue officielle et très répandue" color="primary" />
            <KeyStatCard icon={faWifi} value="Variable" label="Qualité du WiFi selon les zones" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Personne tenant un smartphone avec une carte SIM"
      >
        <h2>Acheter une Carte <span className="text-accent">SIM Locale</span></h2>
        <p>C'est la première chose à faire en arrivant. Vous trouverez des stands des opérateurs Globe et Smart directement à l'aéroport. Acheter une carte SIM prépayée avec un forfait data est très simple et économique.</p>
        <Link href="/voyager-aux-philippines/communication/carte-sim" className="text-accent font-bold hover:underline mt-4 inline-block">Guide pour choisir son opérateur →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/communication/dialogue-interculturel.webp"
          imageAlt="Personnes de différentes cultures discutant"
          reverse
        >
          <h2>Langues et <span className="text-accent">Expressions Utiles</span></h2>
          <p>L'anglais est parlé par la grande majorité de la population, ce qui facilite grandement la communication. Apprendre quelques mots de Tagalog (ou de la langue locale de la région que vous visitez) sera cependant très apprécié.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Salamat :</b> Merci</li>
            <li><b>Magkano :</b> Combien ça coûte ?</li>
            <li><b>Paalam :</b> Au revoir</li>
        </ul>
          <Link href="/voyager-aux-philippines/communication/expressions" className="text-accent font-bold hover:underline mt-4 inline-block">Apprendre les bases du Tagalog →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default CommunicationPage;
