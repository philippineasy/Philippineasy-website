import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkedAlt, faLanguage, faRoute, faBell, faComments, faStar, faVrCardboard } from '@fortawesome/free-solid-svg-icons';

const ApplicationMobilePage = () => {
  const features = [
    { icon: faMapMarkedAlt, title: "Cartes Hors Connexion", description: "Naviguez facilement dans les villes et îles, même sans connexion internet. Téléchargez les cartes dont vous avez besoin.", color: "blue" },
    { icon: faLanguage, title: "Traducteur Tagalog Intégré", description: "Communiquez avec les locaux grâce à notre traducteur vocal et textuel (fonctionnalités offline limitées).", color: "yellow" },
    { icon: faRoute, title: "Vos Itinéraires Personnels", description: "Accédez aux itinéraires que vous avez créés sur le site, synchronisés et disponibles offline.", color: "blue" },
    { icon: faBell, title: "Notifications Locales", description: "Recevez des alertes utiles : météo locale, événements à proximité, bons plans flash (connexion requise).", color: "yellow" },
    { icon: faComments, title: "Accès aux Forums", description: "Consultez les dernières discussions et participez à la communauté où que vous soyez (connexion requise).", color: "blue" },
    { icon: faStar, title: "Avantages Easy+", description: "Accédez à votre carte de membre virtuelle et aux réductions partenaires directement depuis l'application.", color: "yellow" }
  ];

  return (
    <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-card p-8 md:p-12 rounded-lg shadow-xl">
            <div className="w-full md:w-1/2 text-center md:text-left">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Votre compagnon de voyage ultime</span>
                <h1 className="text-4xl md:text-5xl font-bold my-4 leading-tight">L'Application Mobile <span className="text-accent">Philippin'Easy</span></h1>
                <p className="text-lg text-muted-foreground mb-8">Emportez tout Philippin'Easy dans votre poche. Accédez à vos infos, outils et à la communauté, même hors connexion.</p>
                <div className="flex justify-center md:justify-start space-x-4">
                    <a href="#" className="bg-black text-white px-5 py-3 rounded-lg hover:bg-neutral-800 transition duration-300 flex items-center space-x-2">
                        <FontAwesomeIcon icon={faApple} className="text-2xl" />
                        <div>
                            <span className="text-xs block">Télécharger sur</span>
                            <span className="font-semibold">App Store</span>
                        </div>
                    </a>
                     <a href="#" className="bg-black text-white px-5 py-3 rounded-lg hover:bg-neutral-800 transition duration-300 flex items-center space-x-2">
                        <FontAwesomeIcon icon={faGooglePlay} className="text-2xl" />
                        <div>
                            <span className="text-xs block">DISPONIBLE SUR</span>
                            <span className="font-semibold">Google Play</span>
                        </div>
                    </a>
                </div>
            </div>
             <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative max-w-xs w-full h-auto" style={{ aspectRatio: '1/2' }}>
                    <Image src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-phone.webp" alt="Application Mobile Philippin'Easy" fill className="rounded-lg shadow-2xl transform md:rotate-3 object-contain" />
                </div>
            </div>
        </div>

        <section className="py-20">
            <h2 className="text-3xl font-bold text-center mb-16">Fonctionnalités <span className="text-primary">Clés</span> de l'Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <div key={index} className="text-center">
                        <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 ${feature.color === 'blue' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                            <FontAwesomeIcon icon={feature.icon} className={`text-3xl ${feature.color === 'blue' ? 'text-primary' : 'text-accent'}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>

         <section className="py-16 bg-card rounded-lg shadow-lg">
             <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold mb-4">Bientôt : Explorez en <span className="text-primary">Réalité Augmentée</span></h2>
                 <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Imaginez pointer votre téléphone vers un monument ou un plat et obtenir instantanément des informations... Nous travaillons sur cette fonctionnalité innovante !</p>
                 <FontAwesomeIcon icon={faVrCardboard} className="text-6xl text-primary/50" />
                 <p className="mt-4 text-sm text-muted-foreground">(Fonctionnalité en cours de développement)</p>
             </div>
         </section>
    </main>
  );
};

export default ApplicationMobilePage;
