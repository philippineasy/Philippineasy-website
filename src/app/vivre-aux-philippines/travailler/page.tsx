import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faBriefcase, faBuilding, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'travailler');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  return {
    title: `${page.title} | Opportunités & Marché de l'Emploi`,
    description: page.subtitle,
  };
}

const TravaillerPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'travailler');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Travailler aux"
        titlePart2="Philippines"
        subtitle={page.subtitle || "Du salariat à l'entrepreneuriat, découvrez les opportunités professionnelles qui vous attendent dans l'archipel."}
        imageUrl={page.hero_image_url || "/imagesHero/travailleur-etranger-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Le Marché du Travail en Chiffres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faBriefcase} value="BPO" label="Secteur qui recrute le plus" color="primary" />
            <KeyStatCard icon={faBuilding} value="PEZA" label="Zones économiques spéciales pour entreprises" color="accent" />
            <KeyStatCard icon={faLightbulb} value="Top 50" label="Classement mondial 'Ease of Doing Business'" color="primary" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
        imageAlt="Réunion de travail dans un bureau moderne"
      >
        <h2>Trouver un <span className="text-primary">Emploi Salarié</span></h2>
        <p>Le secteur des BPO (Business Process Outsourcing) est le plus grand pourvoyeur d'emplois pour les profils internationaux, notamment dans le service client, l'informatique et la finance. Des plateformes comme JobStreet et LinkedIn sont incontournables pour votre recherche.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Postes recherchés :</b> Développeurs, spécialistes support, analystes financiers.</li>
          <li><b>Salaires :</b> Compétitifs pour le marché local, ils varient grandement selon l'expérience.</li>
          <li><b>Contrats :</b> Souvent locaux, il est important de bien comprendre les conditions.</li>
        </ul>
        <Link href="/vivre-aux-philippines/travailler/emploi-salarie" className="text-primary font-bold hover:underline mt-4 inline-block">Explorer les offres d'emploi →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
          imageAlt="Personne présentant un projet sur un tableau blanc"
          reverse
        >
          <h2>Créer son <span className="text-primary">Entreprise</span></h2>
          <p>Les Philippines encouragent l'entrepreneuriat, notamment dans les secteurs de la tech, du tourisme et de l'export. Il est possible pour un étranger de détenir 100% d'une entreprise dans de nombreux domaines. Se faire accompagner par un avocat local est fortement recommandé pour naviguer dans les démarches administratives.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Structures juridiques :</b> Corporation, Sole Proprietorship...</li>
            <li><b>Avantages PEZA :</b> Incitations fiscales et non fiscales importantes.</li>
            <li><b>Capital requis :</b> Varie selon le type d'activité et la part d'actionnariat étranger.</li>
          </ul>
          <Link href="/vivre-aux-philippines/travailler/creer-entreprise" className="text-primary font-bold hover:underline mt-4 inline-block">Le guide de l'entrepreneur →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default TravaillerPage;
