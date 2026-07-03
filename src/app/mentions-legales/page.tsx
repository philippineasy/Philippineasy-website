import { Metadata } from 'next';
import Link from 'next/link';
import WebPageJsonLd from '@/components/shared/WebPageJsonLd';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description:
    "Mentions légales du site Philippin'Easy : éditeur, directeur de publication, hébergeur, propriété intellectuelle, liens d'affiliation et médiation.",
  alternates: { canonical: 'https://philippineasy.com/mentions-legales' },
  robots: { index: true, follow: true },
};

const MentionsLegalesPage = () => {
  return (
    <div className="bg-background">
      <WebPageJsonLd
        title={metadata.title as string}
        description={metadata.description as string}
        path="/mentions-legales"
      />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-primary">Mentions Légales</h1>

          <div className="article-content space-y-8">
            <p className="text-center italic text-muted-foreground">
              Conformément aux dispositions des articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004
              pour la Confiance dans l&rsquo;Économie Numérique (LCEN), il est porté à la connaissance des
              utilisateurs et visiteurs du site Philippin&rsquo;Easy les présentes mentions légales.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 1 &ndash; Éditeur du site</h2>
              <p>
                Le site Philippin&rsquo;Easy (philippineasy.com) est édité par :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Éditeur :</strong> Hugo Duarte Fontes, personne physique</li>
                <li><strong>Statut juridique / n° d&rsquo;immatriculation :</strong> [Statut juridique / n° d&rsquo;immatriculation — à compléter]</li>
                <li><strong>Adresse :</strong> Tandag City, Philippines</li>
                <li><strong>Adresse e-mail :</strong> <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 2 &ndash; Directeur de la publication</h2>
              <p>
                Le directeur de la publication est Hugo Duarte Fontes, en sa qualité d&rsquo;éditeur du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 3 &ndash; Hébergeur</h2>
              <p>
                L&rsquo;hébergement du site Philippin&rsquo;Easy est assuré par :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Nom de l&rsquo;hébergeur :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
                <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
              </ul>
              <p>
                Les données des utilisateurs sont stockées sur des serveurs situés dans l&rsquo;Union européenne
                (Supabase, région Paris). Pour en savoir plus, consultez notre{' '}
                <Link href="/confidentialite">politique de confidentialité</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 4 &ndash; Contact</h2>
              <p>
                Pour toute question, réclamation ou demande relative au site, vous pouvez nous contacter par
                e-mail à l&rsquo;adresse <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a> ou
                via la <Link href="/contact">page de contact</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 5 &ndash; Accès au site</h2>
              <p>
                Le site est accessible en tout lieu, 7j/7 et 24h/24, sauf cas de force majeure ou interruption,
                programmée ou non, pouvant découler d&rsquo;une nécessité de maintenance. En cas de modification,
                d&rsquo;interruption ou de suspension des services, l&rsquo;éditeur ne saurait être tenu responsable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 6 &ndash; Propriété intellectuelle</h2>
              <p>
                Les marques, logos, signes ainsi que l&rsquo;ensemble des contenus du site (textes, images, sons,
                itinéraires, guides&hellip;) font l&rsquo;objet d&rsquo;une protection par le Code de la propriété
                intellectuelle et plus particulièrement par le droit d&rsquo;auteur.
              </p>
              <p>
                Toute utilisation, reproduction, diffusion, commercialisation ou modification de tout ou partie
                du site Philippin&rsquo;Easy, sans autorisation expresse de l&rsquo;éditeur, est prohibée et pourra
                entraîner des actions et poursuites judiciaires, telles que prévues notamment par le Code de la
                propriété intellectuelle et le Code civil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 7 &ndash; Liens d&rsquo;affiliation</h2>
              <p>
                Dans un souci de transparence, nous vous informons que certains liens présents sur le site sont
                des <strong>liens d&rsquo;affiliation</strong>, notamment vers la plateforme Klook et d&rsquo;autres
                partenaires. Lorsque vous effectuez un achat ou une réservation via ces liens, l&rsquo;éditeur du
                site perçoit une commission, <strong>sans aucun surcoût pour vous</strong>. Ces partenariats ne
                modifient pas la ligne éditoriale du site : les recommandations reposent sur l&rsquo;expérience et
                l&rsquo;utilité pour le lecteur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 8 &ndash; Médiation de la consommation</h2>
              <p>
                Conformément aux articles L611-1 et suivants et L612-1 et suivants du Code de la consommation,
                tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de
                la résolution amiable d&rsquo;un litige l&rsquo;opposant à un professionnel.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Médiateur de la consommation désigné :</strong> [Médiateur de la consommation — à désigner]</li>
              </ul>
              <p>
                Avant toute saisine du médiateur, le consommateur doit avoir tenté de résoudre le litige
                directement auprès de nous, par réclamation écrite adressée à{' '}
                <a href="mailto:contact@philippineasy.com">contact@philippineasy.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary/90 mb-4">Article 9 &ndash; Données personnelles et cookies</h2>
              <p>
                Le traitement de vos données personnelles et l&rsquo;utilisation des cookies sont décrits dans notre{' '}
                <Link href="/confidentialite">politique de confidentialité</Link>. Les conditions d&rsquo;utilisation
                du site figurent dans nos <Link href="/cgu">CGU</Link> et les conditions de vente dans nos{' '}
                <Link href="/cgv">CGV</Link>.
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

export default MentionsLegalesPage;
