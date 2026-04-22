import { createClient } from '@/utils/supabase/server';
import { getHomepageArticles } from '@/services/articleService';
import dynamic from 'next/dynamic';
import HomepageJsonLd from '@/components/shared/HomepageJsonLd';
import FAQSchema from '@/components/shared/FAQSchema';
import { HeroSection } from '@/components/homepage/HeroSection';
import { RegionCards } from '@/components/homepage/RegionCards';
import { InstallerCards } from '@/components/homepage/InstallerCards';
import { ItineraireIABlock } from '@/components/homepage/ItineraireIABlock';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { FinalCtaSection } from '@/components/homepage/FinalCtaSection';

const homepageFAQs = [
  {
    question: "Quel budget prévoir pour un voyage aux Philippines ?",
    answer: "Pour un voyage de 2-3 semaines aux Philippines, comptez entre 1500€ et 3000€ tout compris (vols, hébergement, activités, repas). Le coût de la vie sur place est très abordable : environ 30-50€/jour pour un voyageur mid-range."
  },
  {
    question: "Quel visa pour voyager aux Philippines en 2026 ?",
    answer: "Les ressortissants français, belges, suisses et canadiens bénéficient d'un visa gratuit de 30 jours à l'arrivée. Il est possible de l'étendre jusqu'à 36 mois via des extensions successives auprès du Bureau of Immigration."
  },
  {
    question: "Quelle est la meilleure période pour visiter les Philippines ?",
    answer: "La meilleure période est la saison sèche de novembre à mai. Évitez juin à octobre (mousson). Pour Palawan et les Visayas, privilégiez janvier-avril. Pour le surf à Siargao, septembre-novembre offre les meilleures vagues."
  },
  {
    question: "Comment s'expatrier aux Philippines ?",
    answer: "Pour s'expatrier aux Philippines, plusieurs options de visa existent : le visa SRRV pour les retraités (dès 35 ans avec dépôt bancaire), le visa investisseur, ou le visa 13(a) par mariage avec un(e) Philippin(e). Notre guide complet détaille toutes les démarches."
  },
  {
    question: "Quel est le coût de la vie aux Philippines pour un expatrié ?",
    answer: "Un expatrié peut vivre confortablement aux Philippines avec 1000-1500€/mois à Cebu ou en province, et 1500-2500€/mois à Manille. Cela inclut le logement, la nourriture, les transports et les loisirs."
  }
];

const BestDealsSection = dynamic(() => import('@/components/homepage/BestDealsSection').then(mod => mod.BestDealsSection));
const BlogSection = dynamic(() => import('@/components/homepage/BlogSection').then(mod => mod.BlogSection));
const LeadMagnetSection = dynamic(() => import('@/components/homepage/LeadMagnetSection').then(mod => mod.LeadMagnetSection));

// Enable ISR (Incremental Static Regeneration) for better performance
export const revalidate = 300; // Revalidate every 5 minutes (300 seconds)

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { bestDeals } = await getHomepageArticles(supabase);

  return (
    <div>
      <HomepageJsonLd />
      <FAQSchema faqs={homepageFAQs} />
      {/* Hero Section */}
      <HeroSection />

      {/* S'installer aux Philippines (4 cartes Vivre) */}
      <InstallerCards />

      {/* Un archipel aux mille visages — 4 régions grid 2×2 */}
      <RegionCards />

      {/* Bloc Itinéraire IA (section signature) */}
      <ItineraireIABlock />

      {/* Témoignages */}
      <TestimonialsSection />

      {/* Bons Plans Klook — 3 hero deals + carousel */}
      <BestDealsSection initialDeals={bestDeals} />

      {/* Magazine — derniers articles du blog */}
      <BlogSection />

      {/* Lead Magnet — Guides Gratuits (kept after blog per editorial order) */}
      <LeadMagnetSection />

      {/* CTA final */}
      <FinalCtaSection isAuthenticated={!!user} />
    </div>
  );
}
