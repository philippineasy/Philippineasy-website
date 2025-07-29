import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faGraduationCap, faSchool, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'etudier');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  return {
    title: `${page.title} | Universités & Écoles Internationales`,
    description: page.subtitle,
  };
}

const EtudierPage = async () => {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'etudier');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Étudier aux"
        titlePart2="Philippines"
        subtitle={page.subtitle || "Un cadre d'études internationalement reconnu et une expérience culturelle unique pour les étudiants du monde entier."}
        imageUrl="/imagesHero/ou et comment étudier aux philippines.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Le Système Éducatif en Chiffres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faGraduationCap} value="Top 4" label="Universités de renommée mondiale" color="primary" />
            <KeyStatCard icon={faSchool} value="20+" label="Grandes écoles internationales" color="accent" />
            <KeyStatCard icon={faGlobe} value="Anglais" label="Langue principale d'enseignement" color="primary" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Campus de l'Université des Philippines"
      >
        <h2>Les <span className="text-primary">Universités</span> de Prestige</h2>
        <p>Les Philippines comptent plusieurs universités de premier plan, comme l'Université des Philippines (UP), Ateneo de Manila (ADMU) ou De La Salle University (DLSU). Elles offrent un large éventail de programmes en anglais et attirent des étudiants de toute l'Asie.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Top universités :</b> UP, Ateneo, La Salle, UST.</li>
          <li><b>Domaines d'excellence :</b> Commerce, Ingénierie, Médecine.</li>
          <li><b>Frais de scolarité :</b> Très abordables comparés à l'Europe ou l'Amérique du Nord.</li>
        </ul>
        <Link href="/vivre-aux-philippines/etudier/universites" className="text-primary font-bold hover:underline mt-4 inline-block">Classement des universités →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
          imageAlt="Salle de classe dans une école internationale"
          reverse
        >
          <h2><span className="text-primary">Écoles</span> Internationales</h2>
          <p>Pour les familles d'expatriés, de nombreuses écoles internationales proposent des cursus américain, britannique, ou international (IB). Ces écoles offrent un enseignement de haute qualité et préparent les élèves aux meilleures universités du monde.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Exemples :</b> International School Manila (ISM), British School Manila.</li>
            <li><b>Coûts :</b> Élevés, similaires aux standards internationaux.</li>
            <li><b>Localisation :</b> Principalement à Manille et Cebu.</li>
          </ul>
          <Link href="/vivre-aux-philippines/etudier/ecoles-internationales" className="text-primary font-bold hover:underline mt-4 inline-block">Trouver une école internationale →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default EtudierPage;
