import { Metadata } from 'next';
import WebPageJsonLd from '@/components/shared/WebPageJsonLd';

export const metadata: Metadata = {
  title: "Mentions Légales - Philippin'Easy",
  description: "Consultez les mentions légales de Philippin'Easy.",
};

const MentionsLegalesPage = () => {
  return (
    <div className="bg-white">
      <WebPageJsonLd
        title={metadata.title as string}
        description={metadata.description as string}
        path="/mentions-legales"
      />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Mentions Légales</h1>
          
          <div className="article-content space-y-8">
            <p className="text-center italic text-gray-600">Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site Philippin'Easy les présentes mentions légales.</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 1 - L'éditeur</h2>
              <p>
                L’édition du site Philippin'Easy est assurée par :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Nom de l'entreprise/personne :</strong> Duarte Fontes Vitor Hugo</li>
                <li><strong>Adresse :</strong> Tandag City</li>
                <li><strong>Adresse e-mail :</strong> contact@philippineasy.com</li>
                <li><strong>Directeur de la publication :</strong> Duarte Fontes Vitor Hugo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 2 - L'hébergeur</h2>
              <p>
                L'hébergement du site Philippin'Easy est assuré par :
              </p>
               <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Nom de l'hébergeur :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 3 - Accès au site</h2>
              <p>
                Le site est accessible par tout endroit, 7j/7, 24h/24 sauf cas de force majeure, interruption programmée ou non et pouvant découler d’une nécessité de maintenance.
              </p>
              <p>
                En cas de modification, interruption ou suspension des services, le site Philippin'Easy ne saurait être tenu responsable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 4 - Propriété intellectuelle</h2>
              <p>
                Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du site Philippin'Easy, sans autorisation de l’Éditeur est prohibée et pourra entraîner des actions et poursuites judiciaires telles que notamment prévues par le Code de la propriété intellectuelle et le Code civil.
              </p>
               <p>
                Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son…) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
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

export default MentionsLegalesPage;
