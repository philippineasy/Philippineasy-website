import { Metadata } from 'next';
import { HeroThematic } from '../../../components/ui/HeroThematic';
import { AlternatingContent } from '../../../components/ui/AlternatingContent';
import { KeyStatCard } from '../../../components/ui/KeyStatCard';
import { faWater, faChurch, faHippo } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/server';
import { getArticlesByCategorySlug } from '../../../services/articleService';
import ArticleList from '../../../components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Cebu et les Visayas : Le Cœur des Philippines',
  description: 'Explorez Cebu et la région des Visayas, un archipel vibrant au cœur des Philippines. Découvrez des plages de sable blanc, une histoire riche et une culture unique.',
};

const CebuVisayasPage = async () => {
  const supabase = createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'cebu-visayas');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Cebu et les Visayas"
        titlePart2="Le Cœur de l'Archipel"
        titlePart2Color="accent"
        subtitle="Plongez au cœur de la culture philippine, entre plages paradisiaques et patrimoine historique."
        imageUrl="/images/voyager/iles-philippines-aeriennes.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Visayas en Bref</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faWater} value="Plages & Plongée" label="Trésors Aquatiques" color="accent" />
            <KeyStatCard icon={faChurch} value="Héritage Colonial" label="Histoire et Culture" color="primary" />
            <KeyStatCard icon={faHippo} value="Tarsiers & Chocolate Hills" label="Merveilles de Bohol" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/palawan/bateau-bangka-el-nido.webp"
        imageAlt="Bateau traditionnel Bangka"
      >
        <h2>Une Mosaïque d'Îles <span className="text-accent">Inoubliables</span></h2>
        <p>La région des Visayas est un ensemble d'îles offrant une diversité de paysages et d'expériences. De l'effervescence de Cebu City aux plages tranquilles de Siquijor, chaque île a sa propre identité.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Cebu :</b> Le carrefour économique et culturel de la région.</li>
          <li><b>Bohol :</b> Célèbre pour ses Chocolate Hills et ses minuscules tarsiers.</li>
          <li><b>Siquijor :</b> Une île mystique réputée pour ses guérisseurs et ses plages désertes.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment explorer les Visayas →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/palawan/vue-aerienne-coron.webp"
          imageAlt="Vue aérienne d'une île des Visayas'"
          reverse
        >
          <h2>Aventures et Découvertes <span className="text-accent">Garanties</span></h2>
          <p>Les Visayas sont un terrain de jeu idéal pour les aventuriers et les curieux :</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Plongée :</b> Explorez des sites de renommée mondiale comme Malapascua et Moalboal.</li>
            <li><b>Histoire :</b> Visitez la Croix de Magellan à Cebu, symbole de l'arrivée du christianisme.</li>
            <li><b>Nature :</b> Randonnez jusqu'aux chutes de Kawasan ou admirez les rizières en terrasses.</li>
        </ul>
          <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">Quelle est la meilleure saison ? →</Link>
        </AlternatingContent>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur Cebu et les Visayas</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default CebuVisayasPage;
