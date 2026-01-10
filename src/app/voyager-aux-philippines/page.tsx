import { faMapMarkerAlt, faCalendarAlt, faPlaneDeparture, faWallet, faBriefcaseMedical, faWifi } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { VoyagerClientPage } from './VoyagerClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voyager aux Philippines : Guide Complet & Destinations | Philippin\'Easy',
  description: 'Découvrez nos guides de voyage complets pour les Philippines : destinations incontournables, conseils pratiques, budget, transport, et itinéraires personnalisés.',
  keywords: [
    'voyage Philippines',
    'destinations Philippines',
    'guide voyage Philippines',
    'tourisme Philippines',
    'itinéraire Philippines',
    'Palawan',
    'Boracay',
    'Cebu',
    'Manille',
    'budget voyage Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines',
  },
  openGraph: {
    title: 'Voyager aux Philippines : Guide Complet & Destinations',
    description: 'Découvrez nos guides de voyage complets pour les Philippines : destinations, conseils, budget et itinéraires.',
    url: 'https://philippineasy.com/voyager-aux-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Voyager aux Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voyager aux Philippines : Guide Complet',
    description: 'Guides de voyage, destinations et conseils pour les Philippines',
    images: ['https://philippineasy.com/imagesHero/comment-voyager-aux-philippines.webp'],
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

const VoyagerPage = async () => {
  const supabase = await createClient();
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
