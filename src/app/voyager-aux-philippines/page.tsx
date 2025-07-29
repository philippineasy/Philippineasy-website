import { faMapMarkerAlt, faCalendarAlt, faPlaneDeparture, faWallet, faBriefcaseMedical, faWifi } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { VoyagerClientPage } from './VoyagerClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voyager aux Philippines | Philippin\'Easy',
  description: 'Guides de voyage, conseils et destinations pour votre voyage aux Philippines.',
};

export const revalidate = 3600; // Revalidate every hour

const VoyagerPage = async () => {
  const supabase = createClient();
  const { data: destinations, error } = await getCategoriesByMainCategory(supabase, 'voyager-aux-philippines');

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les destinations.</p>;
  }

  const practicalTips = [
    {
      icon: faCalendarAlt,
      title: "Quand partir ?",
      text: "Idéalement pendant la saison sèche (Novembre à Mai). Saison des pluies de Juin à Octobre (risques de typhons).",
      link: "/voyager-aux-philippines/quand-partir"
    },
    {
      icon: faPlaneDeparture,
      title: "Transport",
      text: "Vols internationaux vers Manille (MNL) ou Cebu (CEB). Vols intérieurs, ferries et bus pour se déplacer entre les îles.",
      link: "/voyager-aux-philippines/transport"
    },
    {
      icon: faWallet,
      title: "Budget",
      text: "Destination abordable. Comptez 30-50€/jour (backpacker), 60-100€/jour (moyen), 120€+ (confort). Billet d'avion = poste majeur.",
      link: "/voyager-aux-philippines/budget"
    },
    {
      icon: faBriefcaseMedical,
      title: "Santé & Sécurité",
      text: "Vaccins à jour recommandés. Protection anti-moustiques. Assurance voyage indispensable. Restez vigilant dans les zones urbaines.",
      link: "/voyager-aux-philippines/sante-securite"
    },
    {
      icon: faWifi,
      title: "Communication",
      text: "Achetez une carte SIM locale (Globe, Smart) pour data et appels. Anglais largement parlé. Apprendre quelques mots de Tagalog est apprécié.",
      link: "/voyager-aux-philippines/communication"
    },
    {
      icon: faMapMarkerAlt,
      title: "Préparer son Itinéraire",
      text: "Ne surchargez pas ! Choisissez 2-3 régions max pour un séjour de 2-3 semaines. Utilisez notre outil pour vous aider.",
      link: "/itineraire",
      linkText: "Créer mon itinéraire →"
    }
  ];

  return (
    <VoyagerClientPage initialDestinations={destinations || []} practicalTips={practicalTips} />
  );
};

export default VoyagerPage;
