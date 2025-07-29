import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - Philippin'Easy",
  description: "Consultez les conditions générales d'utilisation (CGU) du site Philippin'Easy.",
};

const CGUPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Conditions Générales d'Utilisation (CGU)</h1>
          
          <div className="article-content space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 1 - Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site Philippin'Easy et leurs conditions d'utilisation par l'Utilisateur.
              </p>
              <p>
                Tout accès et/ou utilisation du site suppose l'acceptation et le respect de l'ensemble des termes des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 2 - Accès aux services</h2>
              <p>
                Le site permet à l'Utilisateur un accès gratuit aux services suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Consultation d'articles et de guides sur les Philippines.</li>
                <li>Participation aux forums de discussion.</li>
                <li>Création d'itinéraires personnalisés.</li>
                <li>Accès à une marketplace de produits et services.</li>
              </ul>
              <p>
                L'accès à certains services, comme la participation aux forums ou l'utilisation de la marketplace, nécessite la création d'un compte utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 3 - Propriété intellectuelle</h2>
              <p>
                Le contenu du site (textes, logos, images, etc.) est protégé par le droit d'auteur. Toute reproduction non autorisée est strictement interdite.
              </p>
              <p>
                L'Utilisateur est seul responsable du contenu qu'il publie sur le site (commentaires, messages de forum, etc.). Il s'engage à ce que ses publications ne portent pas atteinte aux droits de tiers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 4 - Responsabilité de l'Utilisateur</h2>
              <p>
                L'Utilisateur s'engage à tenir des propos respectueux des autres et de la loi. Sont interdits :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Les propos incitant à la haine, à la violence, au racisme.</li>
                <li>Les propos diffamatoires ou injurieux.</li>
                <li>Le spam ou la publicité non sollicitée.</li>
                <li>La publication de contenu illégal ou portant atteinte à la vie privée d'autrui.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 5 - Modération et Responsabilité de l'Éditeur</h2>
              <p>
                L'Éditeur du site se réserve le droit de modérer, de supprimer ou de ne pas diffuser toute contribution qui serait contraire à la ligne éditoriale du site ou à la loi.
              </p>
              <p>
                Les informations et/ou documents figurant sur ce site et/ou accessibles par ce site proviennent de sources considérées comme étant fiables. Toutefois, ces informations et/ou documents sont susceptibles de contenir des inexactitudes techniques et des erreurs typographiques. L'Éditeur se réserve le droit de les corriger, dès que ces erreurs sont portées à sa connaissance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 6 - Droit applicable</h2>
              <p>
                Tant le présent site que les modalités et conditions de son utilisation sont régis par le droit français, quel que soit le lieu d’utilisation.
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

export default CGUPage;
