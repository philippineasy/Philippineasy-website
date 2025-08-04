import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPassport, faMapMarkedAlt, faUniversity, faPlaneDeparture, faUmbrellaBeach, faShip, faWater, faMagic, faWandMagicSparkles, faStar, faMobileAlt, faUsers, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import { getHomepageArticles } from '@/services/articleService';
import dynamic from 'next/dynamic';

const BestDealsSection = dynamic(() => import('@/components/homepage/BestDealsSection').then(mod => mod.BestDealsSection));
const FeaturedNewsSection = dynamic(() => import('@/components/homepage/FeaturedNewsSection').then(mod => mod.FeaturedNewsSection));
const FeaturedProductsCarousel = dynamic(() => import('@/components/homepage/FeaturedProductsCarousel').then(mod => mod.FeaturedProductsCarousel));

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { bestDeals, featuredItems } = await getHomepageArticles(supabase);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero flex items-center justify-center text-center px-4 h-[90vh]">
        <Image
          src="/imagesHero/hero-home.jpg"
          alt="Vue aérienne d'une plage de sable blanc aux Philippines avec des bateaux traditionnels bangka"
          fill
          priority
          fetchPriority="high"
          className="object-cover z-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Découvrez les <span className="text-accent/90">Philippines</span> Autrement
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Votre guide complet pour voyager, vivre et vous épanouir dans l'archipel des 7 641 îles.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/vivre-aux-philippines" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 text-lg font-semibold">
              S'installer aux Philippines
            </Link>
            <Link href="/voyager-aux-philippines" className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-300 text-lg font-semibold">
              Explorer l'archipel
            </Link>
            <Link href="/itineraire-personnalise-pour-les-philippines" className="px-8 py-3 bg-card text-primary rounded-lg hover:bg-muted transition duration-300 text-lg font-semibold pulse-animation">
              Créer mon Itinéraire <span className="text-xs text-yellow-600">(IA)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mini-Guides Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Préparez votre Aventure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Mini-Guides Vivre */}
                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-primary flex items-center"><FontAwesomeIcon icon={faHome} className="mr-3" /> S'installer aux Philippines</h3>
                    <div className="space-y-6">
                        <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                            <FontAwesomeIcon icon={faPassport} className="text-primary text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Visa Retraité (SRRV)</h4>
                                <p className="text-sm text-muted-foreground">Conditions, avantages et démarches pour profiter de votre retraite au soleil.</p>
                                <Link href="/vivre-aux-philippines#visas" className="text-sm text-primary hover:underline mt-1 inline-block">En savoir plus →</Link>
                            </div>
                        </div>
                        <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-primary text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Coût de la Vie : Manille vs Cebu</h4>
                                <p className="text-sm text-muted-foreground">Comparatif détaillé des budgets nécessaires pour vivre dans les deux plus grandes villes.</p>
                                <Link href="/vivre-aux-philippines#cout-vie" className="text-sm text-primary hover:underline mt-1 inline-block">Comparer les coûts →</Link>
                            </div>
                        </div>
                         <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                             <FontAwesomeIcon icon={faUniversity} className="text-primary text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Ouvrir un Compte Bancaire</h4>
                                <p className="text-sm text-muted-foreground">Les étapes, les documents requis et les banques recommandées pour les expatriés.</p>
                                <Link href="/vivre-aux-philippines#banque" className="text-sm text-primary hover:underline mt-1 inline-block">Guide bancaire →</Link>
                            </div>
                        </div>
                    </div>
                    <Link href="/vivre-aux-philippines" className="mt-6 inline-block px-5 py-2 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold text-sm">Tout sur l'Expatriation</Link>
                </div>

                {/* Mini-Guides Voyager */}
                <div>
                     <h3 className="text-2xl font-semibold mb-6 text-accent flex items-center"><FontAwesomeIcon icon={faPlaneDeparture} className="mr-3" /> Explorer les Philippines</h3>
                     <div className="space-y-6">
                         <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                             <FontAwesomeIcon icon={faUmbrellaBeach} className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Quand Visiter Palawan ?</h4>
                                <p className="text-sm text-muted-foreground">Climat, affluence, événements... Choisissez la meilleure période pour El Nido et Coron.</p>
                                <Link href="/voyager-aux-philippines#palawan-quand" className="text-sm text-primary hover:underline mt-1 inline-block">Meilleure saison →</Link>
                            </div>
                        </div>
                        <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                             <FontAwesomeIcon icon={faShip} className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Transport Inter-Îles</h4>
                                <p className="text-sm text-muted-foreground">Avion vs Ferry : avantages, inconvénients, compagnies et conseils de réservation.</p>
                                <Link href="/voyager-aux-philippines#transport" className="text-sm text-primary hover:underline mt-1 inline-block">Se déplacer →</Link>
                            </div>
                        </div>
                         <div className="feature-card bg-muted p-4 rounded-lg shadow flex items-start space-x-4">
                             <FontAwesomeIcon icon={faWater} className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="font-bold">Top 3 Spots de Plongée</h4>
                                <p className="text-sm text-muted-foreground">Malapascua, Tubbataha, Coron... Découvrez les sites incontournables pour les plongeurs.</p>
                                <Link href="/voyager-aux-philippines#plongee" className="text-sm text-primary hover:underline mt-1 inline-block">Sites de plongée →</Link>
                            </div>
                        </div>
                    </div>
                     <Link href="/voyager-aux-philippines" className="mt-6 inline-block px-5 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/90 transition duration-300 font-semibold text-sm">Tous les Guides Voyage</Link>
                </div>
            </div>
        </div>
    </section>

    {/* Section "À la Une" - Now Dynamic */}
    <FeaturedNewsSection initialFeaturedItems={featuredItems} />

    {/* CTA Itinéraire PROÉMINENT */}
    <section className="py-20 bg-gradient-to-r from-blue-50 to-yellow-50">
        <div className="container mx-auto px-4 text-center">
             <div className="max-w-3xl mx-auto">
                 <FontAwesomeIcon icon={faMagic} className="text-5xl text-primary mb-6" />
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">Créez Votre Voyage <span className="text-primary">Magique</span> aux Philippines !</h2>
                 <p className="text-lg text-foreground mb-8">Notre assistant IA analyse vos envies (durée, budget, style, intérêts) pour générer un <strong className="font-semibold">itinéraire personnalisé et détaillé</strong> en quelques instants. Ne perdez plus des heures à chercher, laissez-vous guider !</p>
                 <Link href="/itineraire-personnalise-pour-les-philippines" className="inline-block px-10 py-4 bg-accent text-card-foreground text-xl rounded-lg shadow-lg hover:bg-accent/90 transition duration-300 pulse-animation font-bold">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" /> Je crée mon itinéraire !
                 </Link>
                 <p className="text-sm text-muted-foreground mt-6">
                     <FontAwesomeIcon icon={faStar} className="text-accent" /> <span className="font-semibold">Option Premium Easy+:</span> Recevez votre itinéraire directement sur <strong className="text-green-600">WhatsApp</strong> ou <strong className="text-primary">Telegram</strong>, avec mises à jour et support pendant votre voyage ! <Link href="/meilleurs-plans#premium" className="text-primary hover:underline">En savoir plus</Link>.
                 </p>
             </div>
        </div>
    </section>

    <FeaturedProductsCarousel />

    {/* Aperçu Meilleurs Plans - Now Dynamic */}
    <BestDealsSection initialDeals={bestDeals} />

    {/* Feature Highlights (Réduit) */}
    <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nos Autres Outils Essentiels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                 {/* Mobile App Card */}
                 <div className="feature-card bg-card rounded-lg shadow-lg p-6 text-center border border-border">
                    <div className="text-accent text-5xl mb-4"><FontAwesomeIcon icon={faMobileAlt} /></div>
                    <h3 className="text-xl font-bold mb-3">Application Mobile</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Votre guide de poche : cartes offline, traducteur, itinéraires...</p>
                    <Link href="/application-mobile" className="text-primary hover:text-primary/90 font-semibold">Découvrir l'App →</Link>
                </div>
                 {/* Forums Card */}
                 <div className="feature-card bg-card rounded-lg shadow-lg p-6 text-center border border-border">
                    <div className="text-primary text-5xl mb-4"><FontAwesomeIcon icon={faUsers} /></div>
                    <h3 className="text-xl font-bold mb-3">Forums Communautaires</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Échangez avec des voyageurs et expatriés. Partagez vos expériences.</p>
                    <Link href="/forum-sur-les-philippines" className="text-primary hover:text-primary/90 font-semibold">Rejoindre la discussion →</Link>
                </div>
                 {/* News Card */}
                 <div className="feature-card bg-card rounded-lg shadow-lg p-6 text-center border border-border">
                    <div className="text-accent text-5xl mb-4"><FontAwesomeIcon icon={faNewspaper} /></div>
                    <h3 className="text-xl font-bold mb-3">Actualités Locales</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Restez informé des dernières nouvelles importantes pour votre séjour.</p>
                    <Link href="/actualites-sur-les-philippines" className="text-primary hover:text-primary/90 font-semibold">Lire les actus →</Link>
                </div>
            </div>
        </div>
    </section>

    {/* Testimonials Section */}
     <section className="py-20 bg-muted">
           <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Ils ont choisi les <span className="text-primary">Philippines</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                <div className="relative w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20">
                    <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="Photo de Pierre D., entrepreneur digital à Cebu" fill className="rounded-full object-cover" sizes="80px" />
                </div>
                <p className="text-muted-foreground italic mb-4 text-sm">"M'installer à Cebu a été la meilleure décision. Le coût de la vie, le climat, la gentillesse des gens... mon entreprise en ligne me permet d'en profiter pleinement."</p>
                <h4 className="font-bold">Pierre D., 42 ans</h4>
                <p className="text-xs text-muted-foreground">Entrepreneur digital à Cebu</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                <div className="relative w-20 h-20 rounded-full mx-auto mb-4 border-4 border-accent/20">
                    <Image src="https://randomuser.me/api/portraits/women/68.jpg" alt="Photo de Sophie L., voyageuse en couple aux Philippines" fill className="rounded-full object-cover" sizes="80px" />
                </div>
                <p className="text-muted-foreground italic mb-4 text-sm">"Notre voyage de 3 semaines était incroyable ! L'outil itinéraire de Philippin'Easy nous a vraiment aidés à organiser notre séjour à Palawan et Bohol."</p>
                <h4 className="font-bold">Sophie L., 29 ans</h4>
                <p className="text-xs text-muted-foreground">Voyageuse en couple</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                <div className="relative w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20">
                    <Image src="https://randomuser.me/api/portraits/men/45.jpg" alt="Photo de Marc T., futur retraité aux Philippines" fill className="rounded-full object-cover" sizes="80px" />
                </div>
                <p className="text-muted-foreground italic mb-4 text-sm">"Le forum est une mine d'or ! J'ai trouvé toutes les réponses à mes questions sur le visa SRRV et des contacts utiles avant mon départ à la retraite."</p>
                <h4 className="font-bold">Marc T., 63 ans</h4>
                <p className="text-xs text-muted-foreground">Futur retraité aux Philippines</p>
              </div>
            </div>
          </div>
     </section>

    {/* Final Call to Action */}
    <section className="section-bg-1 py-24 text-white">
         <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à écrire votre histoire Philippine ?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">Rejoignez notre communauté, utilisez nos outils et laissez-vous guider vers une expérience inoubliable.</p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            {user ? (
              <Link href="/profil" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 text-lg font-semibold">Mon compte</Link>
            ) : (
              <Link href="/connexion" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 text-lg font-semibold">Créer un compte</Link>
            )}
            <button id="open-chatbot" className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-300 text-lg font-semibold">Discuter avec notre IA</button>
          </div>
        </div>
    </section>
    </div>
  );
}
