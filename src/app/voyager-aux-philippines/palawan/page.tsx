import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faUmbrellaBeach, faShip, faMountainSun } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Palawan : Le Joyau des Philippines',
  description: 'Découvrez Palawan, un paradis tropical aux Philippines. Ce guide complet vous aidera à planifier votre voyage pendant la saison sèche, avec des informations sur les meilleures plages, les activités incontournables et des conseils pratiques.',
};

const PalawanPage = async () => {
  const supabase = createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'palawan');

  if (error) {
    console.error(error);
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
  }
  
  return (
    <div>
      <HeroThematic
        titlePart1="Palawan"
        titlePart2="Le Joyau des Philippines"
        titlePart2Color="accent"
        subtitle="Le guide ultime pour découvrir un paradis tropical, ses plages de rêve et ses eaux cristallines."
        imageUrl="/images/meteo/plage-tropicale-philippines.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Palawan en Quelques Mots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faUmbrellaBeach} value="Saison Sèche" label="Meilleure période (Déc-Fév)" color="accent" />
            <KeyStatCard icon={faShip} value="El Nido & Coron" label="Spots d'Island Hopping" color="primary" />
            <KeyStatCard icon={faMountainSun} value="Paysages Épiques" label="Falaises de calcaire et lagons" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/palawan/bateau-bangka-el-nido.webp"
        imageAlt="Bateau traditionnel Bangka dans un lagon d'El Nido"
      >
        <h2>La Saison Sèche : <span className="text-accent">Le Moment Parfait</span></h2>
        <p>Visiter Palawan pendant la saison sèche, de novembre à mai, est la garantie d'un temps ensoleillé, idéal pour les activités en plein air. C'est le moment parfait pour explorer les îles, vous détendre sur des plages de sable blanc et nager dans des eaux turquoise.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Météo :</b> Ciel dégagé et températures agréables.</li>
          <li><b>Activités :</b> Island hopping, plongée, kayak, et exploration des grottes.</li>
          <li><b>Festivals :</b> Profitez des festivals locaux qui animent les villes et les villages.</li>
        </ul>
        <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">En savoir plus sur le climat →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/palawan/vue-aerienne-coron.webp"
          imageAlt="Vue aérienne de Coron, Palawan"
          reverse
        >
          <h2>Les Incontournables de <span className="text-accent">Palawan</span></h2>
          <p>Palawan regorge de sites naturels spectaculaires. Ne manquez pas les destinations phares :</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>El Nido :</b> Célèbre pour ses falaises de calcaire, ses lagons cachés et ses plages idylliques comme Nacpan Beach.</li>
            <li><b>Coron :</b> Un paradis pour les plongeurs avec ses épaves de navires japonais de la Seconde Guerre mondiale et ses lacs cristallins comme le lac Kayangan.</li>
            <li><b>Puerto Princesa :</b> Explorez la rivière souterraine, l'une des sept nouvelles merveilles de la nature.</li>
        </ul>
          <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment se déplacer à Palawan →</Link>
        </AlternatingContent>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur Palawan</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default PalawanPage;
