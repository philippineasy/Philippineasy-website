import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faWallet, faBed, faUtensils } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'budget');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  return {
    title: page.title,
    description: page.subtitle,
  };
}

const BudgetPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'budget');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Maîtriser son"
        titlePart2="Budget"
        titlePart2Color="accent"
        subtitle={page.subtitle || "Découvrez comment voyager-aux-philippines aux Philippines sans vous ruiner, que vous soyez backpacker ou en quête de confort."}
        imageUrl={page.hero_image_url || "/imagesHero/maitriser-son-budget-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Estimations par Type de Voyageur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faWallet} value="30-50€/j" label="Backpacker" color="accent" />
            <KeyStatCard icon={faBed} value="60-100€/j" label="Confort" color="primary" />
            <KeyStatCard icon={faUtensils} value="120€+/j" label="Luxe" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Marché local avec des fruits et légumes"
      >
        <h2>Manger & <span className="text-accent">Boire</span></h2>
        <p>La nourriture est très abordable. Vous pouvez manger un repas complet dans un "carinderia" (petit restaurant local) pour quelques euros. Les bières locales comme la San Miguel sont également très bon marché.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Repas local :</b> 2-4€</li>
          <li><b>Restaurant moyen :</b> 8-15€</li>
          <li><b>Bière locale :</b> ~1€</li>
        </ul>
        <Link href="/voyager-aux-philippines/budget/nourriture" className="text-accent font-bold hover:underline mt-4 inline-block">Guide de la street food →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/budget/chambre-vue-mer.webp"
          imageAlt="Chambre d'hôtel avec vue sur la mer"
          reverse
        >
          <h2><span className="text-accent">Hébergement</span> & Activités</h2>
          <p>L'hébergement représente une part importante du budget. Les auberges de jeunesse (dortoirs) sont l'option la plus économique, tandis que les resorts de luxe peuvent coûter plusieurs centaines d'euros par nuit. Les activités comme la plongée ou les tours en bateau sont à prévoir dans votre budget.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Dortoir :</b> 8-15€</li>
            <li><b>Chambre double simple :</b> 20-40€</li>
            <li><b>Tour en bateau (El Nido) :</b> ~20-25€</li>
        </ul>
          <Link href="/voyager-aux-philippines/budget/hebergement" className="text-accent font-bold hover:underline mt-4 inline-block">Comment trouver les meilleurs hôtels →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default BudgetPage;
