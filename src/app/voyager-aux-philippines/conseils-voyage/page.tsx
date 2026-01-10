import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faPlane, faHeart, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Conseils Pratiques pour votre Voyage aux Philippines',
  description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques. De la préparation de votre voyage à la sécurité sur place, ce guide est votre allié.',
};

const ConseilsPratiquesPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'conseils-voyage');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Conseils Pratiques"
        titlePart2="pour les Philippines"
        titlePart2Color="accent"
        subtitle="Toutes les clés pour un voyage réussi, de la planification à la vie sur place."
        imageUrl="/images/sante/controle-police-philippines.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">L'Essentiel pour Voyager Serein</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faPlane} value="Bien se Préparer" label="Avant de Partir" color="accent" />
            <KeyStatCard icon={faShieldHalved} value="Sécurité d'Abord" label="Rester en Confiance" color="primary" />
            <KeyStatCard icon={faHeart} value="Culture & Respect" label="S'immerger Localement" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Préparation de vaccins pour un voyage"
      >
        <h2>Préparation au Voyage : <span className="text-accent">Ne Rien Oublier</span></h2>
        <p>Une bonne préparation est la clé d'un voyage sans stress. Pensez aux aspects administratifs, sanitaires et logistiques avant de boucler vos valises.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Visas :</b> Vérifiez les exigences de visa pour votre nationalité.</li>
          <li><b>Santé :</b> Consultez votre médecin pour les vaccins et une trousse de premiers secours.</li>
          <li><b>Argent :</b> Prévoyez un mélange de liquide et de cartes de crédit.</li>
        </ul>
        <Link href="/voyager-aux-philippines/sante-securite" className="text-accent font-bold hover:underline mt-4 inline-block">Plus de détails sur la santé et sécurité →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/communication/dialogue-interculturel.webp"
          imageAlt="Dialogue entre deux personnes de cultures différentes"
          reverse
        >
          <h2>Sur Place : <span className="text-accent">Vivre l'Expérience Philippine</span></h2>
          <p>Une fois sur place, quelques astuces vous aideront à naviguer la culture locale et à profiter pleinement de votre séjour.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Communication :</b> Apprenez quelques mots de tagalog ou de bisaya.</li>
            <li><b>Transport :</b> Maîtrisez l'art de voyager en jeepney ou en tricycle.</li>
            <li><b>Négociation :</b> Le marchandage est courant sur les marchés, mais restez respectueux.</li>
        </ul>
          <Link href="/voyager-aux-philippines/communication" className="text-accent font-bold hover:underline mt-4 inline-block">Communiquer facilement aux Philippines →</Link>
        </AlternatingContent>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Articles de Conseils Pratiques</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default ConseilsPratiquesPage;
