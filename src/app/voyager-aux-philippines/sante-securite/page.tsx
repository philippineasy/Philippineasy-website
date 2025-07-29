import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faSyringe, faFirstAid, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'sante-securite');

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

const SanteSecuritePage = async () => {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'sante-securite');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Santé &"
        titlePart2="Sécurité"
        titlePart2Color="accent"
        subtitle={page.subtitle || "Nos conseils pour voyager l'esprit tranquille et faire face à tous les imprévus."}
        imageUrl="/imagesHero/securite-et-sante-aux-Philippines.webp"
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Essentiels à ne pas Oublier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faSyringe} value="Vaccins" label="Hépatites A/B, Tétanos recommandés" color="accent" />
            <KeyStatCard icon={faFirstAid} value="Trousse" label="Anti-moustiques et pansements indispensables" color="primary" />
            <KeyStatCard icon={faShieldAlt} value="Assurance" label="Indispensable pour couvrir les frais médicaux" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Flacons de vaccins"
      >
        <h2>Préparer sa <span className="text-accent">Santé</span></h2>
        <p>Avant de partir, consultez votre médecin pour vérifier que vos vaccins sont à jour. Les vaccins contre l'hépatite A, l'hépatite B et le tétanos sont fortement recommandés. La protection contre les moustiques est également cruciale pour éviter la dengue et le chikungunya.</p>
        <Link href="/voyager-aux-philippines/sante-securite/vaccins" className="text-accent font-bold hover:underline mt-4 inline-block">Liste des vaccins recommandés →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/sante/controle-police-philippines.webp"
          imageAlt="Cadenas sur un sac à dos"
          reverse
        >
          <h2>Rester en <span className="text-accent">Sécurité</span></h2>
          <p>Les Philippines sont un pays globalement sûr pour les touristes. Cependant, comme partout, il convient de prendre des précautions de base : ne pas exposer ses objets de valeur, être vigilant dans les zones très fréquentées et se renseigner sur les zones déconseillées par les autorités.</p>
          <Link href="/voyager-aux-philippines/sante-securite/conseils" className="text-accent font-bold hover:underline mt-4 inline-block">Nos conseils de sécurité →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default SanteSecuritePage;
