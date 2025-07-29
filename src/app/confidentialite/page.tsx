import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Philippin'Easy",
  description: "Découvrez comment Philippin'Easy utilise les cookies et protège vos données personnelles.",
};

const ConfidentialitePage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Politique de Confidentialité</h1>
          
          <div className="article-content space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Introduction</h2>
              <p>
                Bienvenue sur Philippin'Easy. Votre vie privée est importante pour nous. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.
              </p>
              <p>
                En utilisant notre site, vous consentez à la collecte et à l'utilisation d'informations conformément à cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Collecte et Utilisation des Informations</h2>
              <p>
                Nous collectons plusieurs types d'informations à diverses fins pour fournir et améliorer notre service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-primary/80 mb-3">Les Cookies</h3>
              <p>
                Les cookies sont de petits fichiers stockés sur votre appareil (ordinateur ou appareil mobile). Nous utilisons des cookies et des technologies de suivi similaires pour suivre l'activité sur notre service et détenir certaines informations.
              </p>
              <p>
                Nous utilisons les cookies pour :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Améliorer votre expérience :</strong> Mémoriser vos préférences et vos visites répétées.</li>
                <li><strong>Mesurer l’audience (Cookies Statistiques) :</strong> Comprendre comment notre site est utilisé afin d'améliorer sa performance et son contenu. Nous utilisons des services comme Google Analytics pour analyser le trafic.</li>
                <li><strong>Afficher des publicités personnalisées (Cookies Publicitaires) :</strong> Travailler avec des partenaires publicitaires pour vous montrer des publicités qui pourraient vous intéresser sur notre site ou sur d'autres.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Votre Consentement</h2>
              <p>
                Lorsque vous visitez notre site pour la première fois, nous vous demandons votre consentement pour l'utilisation des cookies via une bannière. Vous avez le choix :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Tout accepter :</strong> Vous consentez à l'utilisation de tous les types de cookies.</li>
                <li><strong>Tout refuser :</strong> Aucun cookie non essentiel ne sera placé sur votre appareil.</li>
                <li><strong>Personnaliser :</strong> Vous pouvez choisir d'activer ou de désactiver les cookies statistiques et publicitaires selon vos préférences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Comment Gérer Vos Préférences de Cookies</h2>
              <p>
                Vous pouvez modifier vos préférences en matière de cookies à tout moment. Pour ce faire, cliquez sur le lien "Gestion des cookies" disponible dans le pied de page de notre site. Cela fera réapparaître le panneau de configuration où vous pourrez ajuster vos choix.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Sécurité des Données</h2>
              <p>
                La sécurité de vos données est importante pour nous, mais rappelez-vous qu'aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100 %. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos données personnelles, nous ne pouvons garantir leur sécurité absolue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Modifications de cette Politique de Confidentialité</h2>
              <p>
                Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous notifierons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
              </p>
              <p>
                Il est conseillé de consulter cette politique de confidentialité périodiquement pour tout changement.
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-10">
              Dernière mise à jour : 3 Juillet 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidentialitePage;
