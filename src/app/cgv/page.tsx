import { Metadata } from 'next';
import Link from 'next/link';
import WebPageJsonLd from '@/components/shared/WebPageJsonLd';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description:
    "Conditions générales de vente (CGV) de Philippin'Easy : itinéraires personnalisés, guides, services d'accompagnement, abonnements et marketplace.",
  alternates: { canonical: 'https://philippineasy.com/cgv' },
  robots: { index: true, follow: true },
};

const CGVPage = () => {
  return (
    <div className="bg-background">
      <WebPageJsonLd
        title={metadata.title as string}
        description={metadata.description as string}
        path="/cgv"
      />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Conditions Générales de Vente (CGV)</h1>

          <div className="article-content space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 1 &ndash; Objet et champ d&rsquo;application</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent l&rsquo;ensemble des ventes de produits
                et services conclues sur le site Philippin&rsquo;Easy (philippineasy.com) entre l&rsquo;éditeur du site
                (le « Vendeur ») et toute personne physique majeure agissant en qualité de consommateur
                (le « Client »).
              </p>
              <p>
                Toute commande passée sur le site implique l&rsquo;acceptation préalable, expresse et sans réserve des
                présentes CGV, qui prévalent sur tout autre document. Elles complètent les{' '}
                <Link href="/cgu">Conditions Générales d&rsquo;Utilisation</Link> du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 2 &ndash; Identité du Vendeur</h2>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Vendeur :</strong> Hugo Duarte Fontes, personne physique, éditeur du site Philippin&rsquo;Easy</li>
                <li><strong>Statut juridique / n° d&rsquo;immatriculation :</strong> [Statut juridique / n° d&rsquo;immatriculation — à compléter]</li>
                <li><strong>Adresse :</strong> Tandag City, Philippines</li>
                <li><strong>Contact :</strong> <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 3 &ndash; Produits et services proposés</h2>
              <p>Le site propose les catégories de produits et services suivantes :</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Itinéraires de voyage personnalisés :</strong> contenu numérique généré à partir des critères du Client et livré immédiatement après paiement (par e-mail et dans l&rsquo;espace client).</li>
                <li><strong>Guides numériques (PDF) :</strong> contenu numérique téléchargeable immédiatement après paiement.</li>
                <li><strong>Services d&rsquo;accompagnement :</strong> prestations d&rsquo;accompagnement et de coaching (appels visio, suivi WhatsApp) fournies selon les modalités décrites sur la page de chaque service.</li>
                <li><strong>Abonnements :</strong> « Rencontre Premium » et « Easy+ », donnant accès à des fonctionnalités supplémentaires du site pendant la durée souscrite (voir article 9).</li>
                <li><strong>Marketplace :</strong> produits physiques vendus par des vendeurs tiers (voir article 10).</li>
              </ul>
              <p>
                Philippin&rsquo;Easy est un <strong>guide d&rsquo;accompagnement, et non une agence de voyage</strong> :
                les itinéraires et services ne comprennent aucune réservation de vols, d&rsquo;hébergements ou
                d&rsquo;activités effectuée au nom du Client, qui reste libre de réserver auprès des prestataires de
                son choix.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 4 &ndash; Prix</h2>
              <p>
                Les prix sont indiqués en <strong>euros, toutes taxes comprises (TTC)</strong>, sur chaque page
                produit et récapitulés avant la validation de la commande. Le Vendeur se réserve le droit de
                modifier ses prix à tout moment ; les produits et services sont facturés sur la base des tarifs en
                vigueur au moment de la validation de la commande.
              </p>
              <p>
                Les produits numériques et services vendus par le site ne donnent lieu à aucuns frais de livraison.
                Pour les produits physiques de la marketplace, les éventuels frais de livraison sont indiqués avant
                la validation de la commande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 5 &ndash; Commande</h2>
              <p>Le processus de commande comprend les étapes suivantes :</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>sélection du produit, du service ou de l&rsquo;offre ;</li>
                <li>affichage d&rsquo;un récapitulatif détaillant le contenu de l&rsquo;offre, ce qu&rsquo;elle inclut et n&rsquo;inclut pas, et son prix total ;</li>
                <li>pour les itinéraires personnalisés, confirmation expresse du Client (case à cocher) attestant qu&rsquo;il a pris connaissance du contenu de l&rsquo;offre et du positionnement de Philippin&rsquo;Easy (guide d&rsquo;accompagnement, non agence de voyage) ;</li>
                <li>paiement sécurisé via la page de paiement Stripe.</li>
              </ul>
              <p>
                La vente est réputée conclue à la validation du paiement. Un e-mail de confirmation récapitulant
                la commande est adressé au Client. Le Vendeur se réserve le droit de refuser ou d&rsquo;annuler toute
                commande en cas de litige de paiement ou de suspicion légitime de fraude.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 6 &ndash; Paiement</h2>
              <p>
                Le paiement s&rsquo;effectue en ligne, par carte bancaire ou tout autre moyen proposé, via notre
                prestataire de paiement sécurisé <strong>Stripe</strong>. Les données bancaires sont traitées
                exclusivement par Stripe (certifié PCI-DSS) et <strong>ne sont jamais stockées sur nos serveurs</strong>.
                Le débit intervient au moment de la validation de la commande ou, pour les abonnements, à chaque
                échéance de la période souscrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 7 &ndash; Livraison et fourniture</h2>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Contenus numériques (itinéraires, guides PDF) :</strong> fourniture immédiate après validation du paiement, par e-mail et/ou mise à disposition dans l&rsquo;espace client.</li>
                <li><strong>Services d&rsquo;accompagnement :</strong> fourniture selon les modalités et délais précisés sur la page du service (activation dans l&rsquo;espace client, prise de rendez-vous pour les appels).</li>
                <li><strong>Abonnements :</strong> accès aux fonctionnalités activé immédiatement après le paiement.</li>
                <li><strong>Produits physiques de la marketplace :</strong> expédiés par le <strong>vendeur tiers</strong> concerné, selon les délais indiqués sur la fiche produit. Le vendeur tiers est seul responsable de l&rsquo;expédition et de la conformité du produit (voir article 10).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 8 &ndash; Droit de rétractation</h2>
              <p>
                Conformément aux articles L221-18 et suivants du Code de la consommation, le Client consommateur
                dispose en principe d&rsquo;un délai de <strong>quatorze (14) jours</strong> à compter de la conclusion
                du contrat (services et contenus numériques) ou de la réception du bien (produits physiques) pour
                exercer son droit de rétractation, sans avoir à motiver sa décision.
              </p>
              <p>
                Pour l&rsquo;exercer, le Client notifie sa décision avant l&rsquo;expiration du délai, par e-mail à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a>, au moyen du formulaire
                type ci-dessous ou de toute autre déclaration dénuée d&rsquo;ambiguïté. Le remboursement intervient
                dans les quatorze (14) jours suivant la notification, via le même moyen de paiement.
              </p>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">Exception : contenus numériques fournis immédiatement</h3>
              <p>
                Conformément à l&rsquo;article <strong>L221-28, 13° du Code de la consommation</strong>, le droit de
                rétractation ne peut pas être exercé pour les contenus numériques fournis sur un support immatériel
                dont l&rsquo;exécution a commencé avant la fin du délai de rétractation, avec l&rsquo;accord préalable
                exprès du consommateur et son renoncement exprès à ce droit.
              </p>
              <p>
                C&rsquo;est le cas des <strong>itinéraires personnalisés et des guides numériques</strong> : lors de la
                commande, le Client confirme expressément sa demande (case à cocher dans la fenêtre récapitulative
                de commande) et demande la fourniture immédiate du contenu. En validant sa commande, le Client{' '}
                <strong>consent expressément à l&rsquo;exécution immédiate et renonce à son droit de rétractation</strong>{' '}
                dès la livraison du contenu numérique.
              </p>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">Services et abonnements commencés avant la fin du délai</h3>
              <p>
                Si le Client demande que l&rsquo;exécution d&rsquo;un service ou l&rsquo;accès à un abonnement commence
                avant la fin du délai de rétractation, il peut encore se rétracter dans le délai de quatorze (14)
                jours, mais devra régler le montant correspondant au service déjà fourni jusqu&rsquo;à la communication
                de sa décision (article L221-25 du Code de la consommation). Le droit de rétractation ne peut plus
                être exercé pour un service pleinement exécuté avant la fin du délai avec son accord exprès
                (article L221-28, 1°).
              </p>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">Formulaire type de rétractation</h3>
              <p className="italic">
                À l&rsquo;attention de Philippin&rsquo;Easy — contact@philippineasy.com : Je vous notifie par la
                présente ma rétractation du contrat portant sur la vente du bien / la prestation de services
                ci-dessous : [désignation] — Commandé le : [date] — Nom et adresse du consommateur : […] —
                Date : […] — Signature (uniquement en cas de notification sur papier).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 9 &ndash; Abonnements : durée, reconduction, résiliation</h2>
              <p>Les abonnements proposés sont les suivants :</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Rencontre Premium :</strong> 19,99 € par mois, 44,97 € par période de 3 mois ou 59,94 € par période de 6 mois ;</li>
                <li><strong>Easy+ :</strong> 29,99 € par mois.</li>
              </ul>
              <p>
                Sauf résiliation, chaque abonnement est <strong>reconduit tacitement</strong> pour une durée
                identique à la période souscrite, et le moyen de paiement est débité à chaque échéance via Stripe.
                Le prix et la périodicité sont rappelés avant la souscription.
              </p>
              <p>
                Le Client peut <strong>résilier à tout moment</strong>, sans frais ni motif : depuis son espace
                client (portail de gestion Stripe) ou par e-mail à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a>. La résiliation prend
                effet à la fin de la période en cours ; l&rsquo;accès aux fonctionnalités est maintenu jusqu&rsquo;à
                cette date et aucun prélèvement ultérieur n&rsquo;est effectué.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 10 &ndash; Marketplace : rôle de plateforme</h2>
              <p>
                Pour les produits physiques référencés sur la marketplace, Philippin&rsquo;Easy agit en qualité de{' '}
                <strong>plateforme de mise en relation</strong> entre le Client et des vendeurs tiers. Le contrat
                de vente du produit est conclu directement entre le Client et le vendeur tiers, dont l&rsquo;identité
                est indiquée sur la fiche produit.
              </p>
              <p>
                Le vendeur tiers est seul responsable de la description, de la conformité, de l&rsquo;expédition et
                des garanties légales attachées à ses produits. Philippin&rsquo;Easy encaisse le paiement pour le
                compte du vendeur via Stripe et relaie les réclamations du Client auprès du vendeur concerné.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 11 &ndash; Garanties légales</h2>
              <p>
                Le Client bénéficie, dans les conditions prévues par la loi :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>de la <strong>garantie légale de conformité</strong> pour les biens (articles L217-3 et suivants du Code de la consommation) et pour les contenus et services numériques (articles L224-25-12 et suivants du même code) ;</li>
                <li>de la <strong>garantie contre les vices cachés</strong> (articles 1641 à 1648 du Code civil).</li>
              </ul>
              <p>
                Au titre de la garantie légale de conformité, le Client peut notamment obtenir la mise en
                conformité du bien ou du contenu numérique, ou, à défaut, une réduction du prix ou la résolution
                du contrat. Ces garanties s&rsquo;exercent sans frais pour le Client, auprès du Vendeur pour les
                produits et services vendus par le site, et auprès du vendeur tiers pour les produits de la
                marketplace. Toute demande peut être adressée à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 12 &ndash; Responsabilité</h2>
              <p>
                Les itinéraires, guides et conseils fournis constituent des <strong>recommandations à caractère
                informatif</strong>, élaborées avec sérieux à partir des critères communiqués par le Client.
                Philippin&rsquo;Easy n&rsquo;étant pas une agence de voyage, le Vendeur n&rsquo;est pas partie aux
                contrats que le Client conclut avec les compagnies aériennes, hébergeurs, assureurs ou prestataires
                d&rsquo;activités, et ne saurait être tenu responsable de leur exécution.
              </p>
              <p>
                Il appartient au Client de vérifier avant son départ les conditions d&rsquo;entrée sur le territoire,
                les formalités de visa, les recommandations sanitaires et de sécurité officielles, ainsi que la
                disponibilité et les horaires des prestataires mentionnés. La responsabilité du Vendeur ne saurait
                être engagée en cas de force majeure ou de fait imputable au Client ou à un tiers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 13 &ndash; Données personnelles</h2>
              <p>
                Les données personnelles collectées dans le cadre des commandes sont traitées conformément à
                notre <Link href="/confidentialite">politique de confidentialité</Link>, qui détaille les
                finalités, bases légales, durées de conservation et droits des personnes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 14 &ndash; Réclamations, médiation et litiges</h2>
              <p>
                Toute réclamation peut être adressée à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a>. Le Vendeur s&rsquo;efforce
                de répondre dans les meilleurs délais.
              </p>
              <p>
                Conformément aux articles L611-1 et suivants du Code de la consommation, en cas de litige non
                résolu par une réclamation écrite préalable, le Client consommateur peut recourir gratuitement à
                un médiateur de la consommation :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Médiateur de la consommation désigné :</strong> [Médiateur de la consommation — à désigner]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 15 &ndash; Droit applicable</h2>
              <p>
                Les présentes CGV et les ventes qu&rsquo;elles régissent sont soumises au <strong>droit français</strong>,
                sans préjudice des dispositions impératives plus protectrices applicables dans le pays de résidence
                habituelle du consommateur. À défaut de résolution amiable, le litige sera porté devant les
                juridictions compétentes dans les conditions de droit commun.
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-10">
              Dernière mise à jour : 3 juillet 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGVPage;
