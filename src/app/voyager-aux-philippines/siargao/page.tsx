import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faWater, faMoneyBillWave, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Siargao : La Capitale du Surf aux Philippines',
  description: 'Découvrez Siargao, l\'île de rêve pour les surfeurs et les amoureux de la nature. Ce guide vous aidera à planifier votre voyage pendant la saison verte, avec des informations sur les meilleurs spots de surf, les lagons et les piscines naturelles.',
};

const SiargaoPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'siargao');

  if (error) {
    console.error(error);
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Siargao"
        titlePart2="Capitale du Surf"
        titlePart2Color="accent"
        subtitle="Explorez une île authentique, ses vagues de renommée mondiale et ses paysages à couper le souffle."
        imageUrl="/images/meteo/rizieres-philippines-nuageuses.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Siargao en un Clin d'Œil</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faWater} value="Surf & Lagons" label="Activités Principales" color="accent" />
            <KeyStatCard icon={faUmbrellaBeach} value="Mars - Juin" label="Meilleure Période" color="primary" />
            <KeyStatCard icon={faMoneyBillWave} value="Argent Liquide" label="Conseil Essentiel" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/siargao/surf-a-siargao.webp"
        imageAlt="Surfeur sur une vague à Siargao"
      >
        <h2>La Saison Verte : <span className="text-accent">Une Nature Luxuriante</span></h2>
        <p>La saison des pluies, de juin à octobre, transforme Siargao en un paradis verdoyant. Les averses sont souvent courtes et intenses, laissant place à de belles éclaircies. C'est une période idéale pour profiter de l'île avec moins de touristes et des prix plus bas.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Paysages :</b> Une végétation luxuriante et des cascades abondantes.</li>
          <li><b>Surf :</b> C'est la meilleure période pour le surf, avec les vagues les plus impressionnantes.</li>
          <li><b>Ambiance :</b> Une atmosphère plus calme et authentique.</li>
        </ul>
        <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">En savoir plus sur le climat →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/siargao/piscines-naturelles-magpupungko.webp"
          imageAlt="Piscines naturelles de Magpupungko"
          reverse
        >
          <h2>Les Trésors de <span className="text-accent">Siargao</span></h2>
          <p>Au-delà du surf, Siargao offre une multitude de merveilles naturelles à explorer :</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Island Hopping :</b> Découvrez les îles de Naked Island, Daku et Guyam.</li>
            <li><b>Sugba Lagoon :</b> Nagez et faites du paddle dans un lagon aux eaux turquoise.</li>
            <li><b>Magpupungko Rock Pools :</b> Baignez-vous dans des piscines naturelles creusées dans la roche.</li>
        </ul>
          <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment se déplacer à Siargao →</Link>
        </AlternatingContent>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur Siargao</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default SiargaoPage;
