import { Metadata } from 'next';
import WebPageJsonLd from '@/components/shared/WebPageJsonLd';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description:
    "Politique de confidentialité de Philippin'Easy : données collectées, finalités, bases légales, durées de conservation, sous-traitants et droits RGPD.",
  alternates: { canonical: 'https://philippineasy.com/confidentialite' },
  robots: { index: true, follow: true },
};

const ConfidentialitePage = () => {
  return (
    <div className="bg-background">
      <WebPageJsonLd
        title={metadata.title as string}
        description={metadata.description as string}
        path="/confidentialite"
      />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Politique de Confidentialité</h1>

          <div className="article-content space-y-8">
            <p className="text-center italic text-muted-foreground">
              La présente politique de confidentialité décrit la manière dont le site Philippin&rsquo;Easy
              (philippineasy.com) collecte, utilise et protège vos données personnelles, conformément au
              Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">1. Responsable de traitement</h2>
              <p>
                Le responsable du traitement des données personnelles collectées sur le site est :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Identité :</strong> Hugo Duarte Fontes, personne physique, éditeur du site Philippin&rsquo;Easy</li>
                <li><strong>Adresse :</strong> Tandag City, Philippines</li>
                <li><strong>Contact :</strong> <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a></li>
              </ul>
              <p>
                Pour toute question relative à vos données personnelles ou à l&rsquo;exercice de vos droits,
                vous pouvez écrire à cette adresse e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">2. Données collectées, finalités et bases légales</h2>
              <p>
                Nous ne collectons que les données nécessaires aux finalités décrites ci-dessous. Pour chaque
                traitement, la base légale au sens de l&rsquo;article 6 du RGPD est précisée.
              </p>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">a. Compte utilisateur</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> adresse e-mail, nom d&rsquo;utilisateur, mot de passe (chiffré), avatar éventuel.</li>
                <li><strong>Finalité :</strong> création et gestion de votre compte, accès aux services (forum, espace client, favoris).</li>
                <li><strong>Base légale :</strong> exécution du contrat (les Conditions Générales d&rsquo;Utilisation que vous acceptez à l&rsquo;inscription).</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">b. Profil de rencontre (espace « Rencontre »)</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> genre, orientation sexuelle, date de naissance, ville, photos, description, centres d&rsquo;intérêt et, si vous choisissez de la renseigner, votre religion.</li>
                <li><strong>Finalité :</strong> fonctionnement du service de rencontre (affichage du profil, suggestions, mise en relation).</li>
                <li><strong>Base légale :</strong> exécution du contrat pour les données de profil classiques ; <strong>consentement explicite</strong> (article 9.2.a du RGPD) pour les données dites « sensibles » (voir section 3).</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">c. Messages privés</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> contenu des messages échangés avec d&rsquo;autres membres, horodatage.</li>
                <li><strong>Finalité :</strong> fourniture de la messagerie privée ; traitement des signalements de messages abusifs.</li>
                <li><strong>Base légale :</strong> exécution du contrat ; intérêt légitime (sécurité des membres) pour la modération des messages signalés.</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">d. Commandes et paiements</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> historique des commandes, montants, statut, identifiants de transaction Stripe, adresse de facturation le cas échéant.</li>
                <li><strong>Finalité :</strong> traitement des commandes (itinéraires, guides, services, abonnements, marketplace), facturation, lutte contre la fraude.</li>
                <li><strong>Base légale :</strong> exécution du contrat ; obligation légale pour la conservation des pièces comptables.</li>
                <li><strong>Important :</strong> les paiements sont traités par notre prestataire Stripe. <strong>Aucun numéro de carte bancaire n&rsquo;est stocké sur nos serveurs.</strong></li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">e. Services d&rsquo;accompagnement</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> numéro WhatsApp (si vous souscrivez un service incluant un suivi WhatsApp), créneaux d&rsquo;appel réservés, échanges avec notre équipe.</li>
                <li><strong>Finalité :</strong> fourniture des services d&rsquo;accompagnement souscrits (appels visio, suivi WhatsApp, coaching).</li>
                <li><strong>Base légale :</strong> exécution du contrat.</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">f. Newsletter</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> adresse e-mail.</li>
                <li><strong>Finalité :</strong> envoi de notre newsletter (actualités, guides, offres).</li>
                <li><strong>Base légale :</strong> consentement, que vous pouvez retirer à tout moment via le lien de désinscription présent dans chaque e-mail.</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">g. Support et chat en ligne</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> contenu de vos demandes (formulaire de contact, e-mail, chat du site), adresse e-mail si vous la renseignez.</li>
                <li><strong>Finalité :</strong> répondre à vos demandes et assurer le suivi de la relation client. Les messages du chat sont hébergés sur notre propre base de données (Supabase, Union européenne) ; pour les questions générales, une réponse automatique peut être générée par un modèle d&rsquo;IA (OpenAI), le contenu de votre message étant alors transmis à ce prestataire pour traitement.</li>
                <li><strong>Base légale :</strong> intérêt légitime (répondre aux sollicitations) et exécution du contrat pour les clients.</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">h. Mesure d&rsquo;audience et publicité</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> données de navigation collectées via cookies et traceurs (pages visitées, appareil, interactions), sous réserve de votre choix dans le bandeau cookies.</li>
                <li><strong>Finalité :</strong> statistiques de fréquentation (Google Analytics 4) et mesure publicitaire (Meta Pixel, en mode consentement).</li>
                <li><strong>Base légale :</strong> consentement, recueilli via le bandeau cookies et modifiable à tout moment (voir section 8).</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary/80 mt-6 mb-3">i. Journaux techniques et sécurité</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Données :</strong> journaux de connexion et d&rsquo;erreurs techniques (adresse IP, horodatage, messages d&rsquo;erreur — via notre outil de supervision Sentry).</li>
                <li><strong>Finalité :</strong> sécurité du site, détection des abus, correction des dysfonctionnements.</li>
                <li><strong>Base légale :</strong> intérêt légitime (sécurité et bon fonctionnement du service).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">3. Données sensibles (espace Rencontre)</h2>
              <p>
                Certaines informations de votre profil de rencontre relèvent des « catégories particulières de
                données » au sens de l&rsquo;article 9 du RGPD : votre <strong>orientation sexuelle</strong> (déduite de vos
                préférences de rencontre) et, si vous choisissez de la renseigner, votre <strong>religion</strong>.
              </p>
              <p>
                Ces données ne sont traitées qu&rsquo;avec votre <strong>consentement explicite</strong>, recueilli lors de la
                création de votre profil de rencontre. Le champ « religion » est strictement facultatif. Vous pouvez
                à tout moment modifier ou supprimer ces informations depuis votre profil, ou supprimer l&rsquo;intégralité
                de votre profil de rencontre, ce qui vaut retrait de votre consentement pour l&rsquo;avenir.
              </p>
              <p>
                Ces données ne sont jamais utilisées à des fins publicitaires et ne sont visibles que dans le cadre
                du service de rencontre.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">4. Durées de conservation</h2>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Compte, profil et messages :</strong> pendant toute la durée de vie de votre compte, puis suppression ou anonymisation dans un délai de 30 jours après la suppression du compte (hors obligations légales de conservation).</li>
                <li><strong>Profil de rencontre et données sensibles associées :</strong> jusqu&rsquo;à suppression du profil ou du compte, ou retrait du consentement.</li>
                <li><strong>Données de commande et pièces comptables :</strong> 10 ans à compter de la clôture de l&rsquo;exercice, conformément aux obligations comptables.</li>
                <li><strong>Newsletter :</strong> jusqu&rsquo;à votre désinscription, et au plus tard 3 ans après votre dernier contact avec le site.</li>
                <li><strong>Demandes de support :</strong> 3 ans après le dernier échange.</li>
                <li><strong>Journaux techniques et données de supervision :</strong> 12 mois maximum.</li>
                <li><strong>Cookies et traceurs :</strong> 13 mois maximum ; votre choix (acceptation ou refus) est conservé 6 mois.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">5. Destinataires et sous-traitants</h2>
              <p>
                Vos données ne sont ni vendues ni louées. Elles sont accessibles au seul éditeur du site et
                transmises aux sous-traitants suivants, dans la stricte mesure nécessaire à leur mission :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Stripe</strong> (Stripe Payments Europe Ltd., Irlande / Stripe Inc., USA) — traitement des paiements.</li>
                <li><strong>Supabase</strong> — hébergement de la base de données et authentification ; données hébergées dans l&rsquo;Union européenne (région Paris).</li>
                <li><strong>Vercel Inc.</strong> (USA) — hébergement du site web.</li>
                <li><strong>Resend</strong> (USA) — envoi des e-mails transactionnels et de la newsletter.</li>
                <li><strong>Google</strong> (Google Ireland Ltd. / Google LLC, USA) — mesure d&rsquo;audience (Google Analytics 4) et gestion des e-mails (Gmail).</li>
                <li><strong>Meta Platforms</strong> (Meta Platforms Ireland Ltd. / Meta Platforms Inc., USA) — mesure publicitaire (Meta Pixel), uniquement si vous y consentez.</li>
                <li><strong>OpenAI</strong> (OpenAI Ireland Ltd. / OpenAI LLC, USA) — génération des réponses automatiques du chat de support et des itinéraires personnalisés.</li>
                <li><strong>Sentry</strong> (Functional Software Inc., USA) — supervision technique et suivi des erreurs.</li>
              </ul>
              <p>
                Les vendeurs tiers de la marketplace reçoivent les données strictement nécessaires au traitement
                et à l&rsquo;expédition de vos commandes (nom, adresse de livraison, contenu de la commande).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">6. Transferts hors Union européenne</h2>
              <p>
                Certains de nos sous-traitants (notamment Vercel, Stripe, Google, Meta, Resend, OpenAI et Sentry)
                sont établis aux États-Unis ou sont susceptibles d&rsquo;y transférer des données. Ces transferts sont
                encadrés par des garanties appropriées au sens des articles 44 et suivants du RGPD : clauses
                contractuelles types adoptées par la Commission européenne et, pour les prestataires certifiés,
                l&rsquo;adhésion au cadre de protection des données UE&ndash;États-Unis (EU&ndash;US Data Privacy Framework).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">7. Vos droits</h2>
              <p>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants sur
                vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Droit d&rsquo;accès :</strong> obtenir une copie des données que nous détenons sur vous.</li>
                <li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes.</li>
                <li><strong>Droit à l&rsquo;effacement :</strong> demander la suppression de vos données, dans les limites des obligations légales de conservation.</li>
                <li><strong>Droit à la portabilité :</strong> recevoir les données que vous nous avez fournies dans un format structuré et lisible par machine.</li>
                <li><strong>Droit d&rsquo;opposition :</strong> vous opposer à un traitement fondé sur notre intérêt légitime, ainsi qu&rsquo;à tout traitement à des fins de prospection.</li>
                <li><strong>Droit à la limitation :</strong> demander le gel temporaire de l&rsquo;utilisation de vos données.</li>
                <li><strong>Retrait du consentement :</strong> retirer à tout moment un consentement donné (newsletter, cookies, données sensibles), sans remettre en cause la licéité des traitements antérieurs.</li>
                <li><strong>Directives post-mortem :</strong> définir des directives relatives au sort de vos données après votre décès.</li>
              </ul>
              <p>
                Pour exercer ces droits, écrivez-nous à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a> en précisant votre demande.
                Nous vous répondrons dans un délai d&rsquo;un mois. En cas de doute raisonnable sur votre identité, un
                justificatif pourra vous être demandé.
              </p>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès
                de la CNIL (Commission Nationale de l&rsquo;Informatique et des Libertés) :{' '}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a> — 3 place de
                Fontenoy, TSA 80715, 75334 Paris Cedex 07.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">8. Cookies et traceurs</h2>
              <p>
                Lors de votre première visite, un bandeau vous permet d&rsquo;accepter, de refuser ou de personnaliser
                le dépôt des cookies non essentiels (mesure d&rsquo;audience, publicité). Aucun cookie non essentiel
                n&rsquo;est déposé sans votre consentement.
              </p>
              <p>
                Vous pouvez modifier votre choix à tout moment en cliquant sur le lien « Gestion des cookies »
                présent dans le pied de page du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">9. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos
                données : chiffrement des communications (HTTPS), mots de passe chiffrés, contrôle d&rsquo;accès aux
                données en base (politiques de sécurité au niveau des lignes), paiements délégués à un prestataire
                certifié PCI-DSS (Stripe). Aucun système n&rsquo;étant infaillible, nous vous invitons à utiliser un mot
                de passe robuste et unique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">10. Mineurs</h2>
              <p>
                L&rsquo;espace « Rencontre » et les services payants sont réservés aux personnes majeures. Nous ne
                collectons pas sciemment de données concernant des mineurs de moins de 15 ans sans l&rsquo;accord du
                titulaire de la responsabilité parentale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">11. Modifications de la présente politique</h2>
              <p>
                Cette politique peut être mise à jour pour refléter l&rsquo;évolution de nos services ou de la
                réglementation. La version en vigueur est celle publiée sur cette page, avec sa date de dernière
                mise à jour. En cas de modification substantielle, une information sera diffusée sur le site.
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

export default ConfidentialitePage;
