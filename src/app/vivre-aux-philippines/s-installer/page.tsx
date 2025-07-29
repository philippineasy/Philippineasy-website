import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faPassport, faHome, faCoins } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 's-installer');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  return {
    title: `${page.title} | Le Guide Complet`,
    description: page.subtitle,
  };
}

const InstallerPage = async () => {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 's-installer');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="S'installer aux"
        titlePart2="Philippines"
        subtitle={page.subtitle || "De la demande de visa à la recherche de votre nouveau chez-vous, toutes les clés pour une expatriation réussie."}
        imageUrl={page.hero_image_url || "/imagesHero/nouveau-depart-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Piliers de votre Installation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faPassport} value="3 ans" label="Validité du visa SRRV" color="primary" />
            <KeyStatCard icon={faHome} value="~450€/mois" label="Loyer moyen pour un studio à Cebu" color="accent" />
            <KeyStatCard icon={faCoins} value="-40%" label="Coût de la vie vs France" color="primary" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/imagesHero/visa-philippines-processus.webp"
        imageAlt="Dossier de demande de visa"
      >
        <h2>Les Visas : Votre <span className="text-primary">Porte d'Entrée</span></h2>
        <p>Le choix du visa est la première étape cruciale de votre projet. Le plus populaire pour les retraités est le SRRV (Special Resident Retiree's Visa), mais il existe aussi des visas de travail comme le 9G ou des visas d'investisseur.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Visa Touriste :</b> Pour les séjours courts, prolongeable jusqu'à 36 mois.</li>
          <li><b>Visa Retraité (SRRV) :</b> Dépôt requis, résidence permanente.</li>
          <li><b>Visa de Travail (9G) :</b> Nécessite un employeur local.</li>
        </ul>
        <Link href="/vivre-aux-philippines/s-installer/visas" className="text-primary font-bold hover:underline mt-4 inline-block">Comparer les types de visas →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1974&auto=format&fit=crop"
          imageAlt="Appartement moderne avec vue sur la ville"
          reverse
        >
          <h2>Trouver un <span className="text-primary">Logement</span></h2>
          <p>Que vous cherchiez un condo moderne à Makati, une maison avec jardin à Cebu ou une villa en bord de mer à Palawan, le marché immobilier philippin offre de nombreuses options. Les plateformes comme Lamudi ou les groupes Facebook d'expatriés sont d'excellentes ressources pour commencer votre recherche.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Condominiums :</b> Idéal pour la sécurité et les commodités.</li>
            <li><b>Maisons (House & Lot) :</b> Plus d'espace, souvent dans des "subdivisions".</li>
            <li><b>Location :</b> Recommandé pour les premiers mois pour explorer.</li>
          </ul>
          <Link href="/vivre-aux-philippines/s-installer/logement" className="text-primary font-bold hover:underline mt-4 inline-block">Nos conseils pour trouver un logement →</Link>
        </AlternatingContent>
      </div>

      <AlternatingContent
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Personne utilisant une carte de crédit"
      >
        <h2>Banque & <span className="text-primary">Santé</span></h2>
        <p>Ouvrir un compte en banque local peut grandement simplifier votre quotidien. Des banques comme BDO ou BPI sont populaires auprès des expatriés. Pensez également à une assurance santé internationale. Les soins de santé sont de bonne qualité dans les grandes villes, mais peuvent être coûteux.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Comptes bancaires :</b> Dépôt initial souvent requis.</li>
            <li><b>Assurance santé :</b> PhilHealth (local) ou options internationales (AXA, etc.).</li>
            <li><b>Hôpitaux :</b> St. Luke's, Makati Medical Center sont des références.</li>
        </ul>
        <Link href="/vivre-aux-philippines/s-installer/banque-assurance" className="text-primary font-bold hover:underline mt-4 inline-block">Plus d'infos sur les banques et assurances →</Link>
      </AlternatingContent>

      <div className="bg-primary/90 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à vous lancer ?</h2>
          <p className="max-w-2xl mx-auto mb-8">Explorez nos guides détaillés ou posez vos questions directement à notre communauté d'expatriés.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/vivre" className="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-200 transition duration-300 font-semibold">
              Voir tous les guides "Vivre"
            </Link>
            <Link href="/forum-sur-les-philippines" className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-300 font-semibold">
              Visiter le Forum
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InstallerPage;
