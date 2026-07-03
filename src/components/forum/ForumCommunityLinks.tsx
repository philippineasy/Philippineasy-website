import { CardGrid, LinkCard } from '@/components/sections';

/**
 * ForumCommunityLinks — end-of-page internal-linking block for the forum. The
 * forum used to be a dead end (it linked nowhere useful); this hands crawl juice
 * and readers back to the pillar guides and the AI itinerary generator. Shared
 * across the hub, category and topic pages so the mesh is consistent.
 */

export const ForumCommunityLinks = () => (
  <section className="bg-background pb-16 md:pb-20">
    <div className="container mx-auto px-4">
      <div className="border-t border-border pt-14">
        <CardGrid
          eyebrow="Pour aller plus loin"
          title="Préparez votre"
          titleAccent="aventure"
          columns={3}
        >
          <LinkCard
            title="Guides pour voyager"
            href="/voyager-aux-philippines"
            desc="Transport, budget, météo, île par île — tout pour bâtir votre séjour."
            cta="Explorer les guides"
          />
          <LinkCard
            title="S'installer aux Philippines"
            href="/vivre-aux-philippines"
            desc="Visas, logement, banque, santé : le B.A.-BA de l'expatriation francophone."
            cta="Découvrir"
          />
          <LinkCard
            title="Créer son itinéraire sur mesure"
            href="/itineraire-personnalise-pour-les-philippines"
            desc="Notre assistant IA compose un programme jour par jour selon vos envies."
            cta="Lancer l'assistant"
          />
        </CardGrid>
      </div>
    </div>
  </section>
);

export default ForumCommunityLinks;
