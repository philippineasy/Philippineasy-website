'use client';

/**
 * Simulateur "Quel visa Philippines ?" : outil interactif à jour de la réforme
 * SRRV du 1er septembre 2025 (âge abaissé à 40 ans, catégories Classic/Courtesy,
 * nouveaux dépôts). Sources : Bureau of Immigration PH, PRA, Executive Order n°86
 * (Digital Nomad Visa, 2025).
 *
 * Présentation v2 : calquée sur l'ADN de la home (ItineraireIABlock). Panneau bleu
 * en dégradé, colonne gauche éditoriale, colonne droite "fenêtre app" blanche qui
 * contient tout le flux (choix, question de suivi, fiche résultat en lignes compactes).
 * Les données et la logique (OBJECTIFS, FOLLOW_UPS, getResult) sont inchangées.
 */

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faPlane, faUmbrellaBeach, faBriefcase, faChartLine, faLaptop, faHeart,
  faClock, faSackDollar, faIdCard, faArrowsRotate,
  faTriangleExclamation, faArrowRight, faArrowLeft, faRotateLeft, faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

const SRRV_ARTICLE = '/vivre-aux-philippines/visas-et-formalites/visa-longue-duree-srrv-13a-comparatif';

type ObjectifId = 'tourisme' | 'retraite' | 'travail' | 'investir' | 'teletravail' | 'conjoint';

interface Objectif {
  id: ObjectifId;
  label: string;
  desc: string;
  icon: IconDefinition;
}

const OBJECTIFS: Objectif[] = [
  { id: 'tourisme', label: 'Voyager / découvrir', desc: 'Séjour touristique, court ou prolongé.', icon: faPlane },
  { id: 'retraite', label: 'Prendre ma retraite', desc: 'M’installer durablement une fois retraité.', icon: faUmbrellaBeach },
  { id: 'travail', label: 'Travailler', desc: 'Emploi salarié auprès d’une entreprise locale.', icon: faBriefcase },
  { id: 'investir', label: 'Investir', desc: 'Bourse, entreprise ou immobilier.', icon: faChartLine },
  { id: 'teletravail', label: 'Télétravailler', desc: 'Travailler à distance pour un employeur hors PH.', icon: faLaptop },
  { id: 'conjoint', label: 'Rejoindre mon conjoint', desc: 'Je suis marié(e) à un(e) Philippin(e).', icon: faHeart },
];

interface FollowUp {
  question: string;
  options: { id: string; label: string; hint?: string }[];
}

const FOLLOW_UPS: Partial<Record<ObjectifId, FollowUp>> = {
  tourisme: {
    question: 'Combien de temps comptes-tu rester ?',
    options: [
      { id: 'court', label: 'Jusqu’à ~2 mois', hint: 'Vacances, repérage' },
      { id: 'long', label: 'Plusieurs mois', hint: 'Long séjour sur place' },
    ],
  },
  retraite: {
    question: 'Quel est ton âge ?',
    options: [
      { id: 'moins40', label: 'Moins de 40 ans' },
      { id: '40-49', label: 'Entre 40 et 49 ans' },
      { id: '50plus', label: '50 ans et plus' },
    ],
  },
  travail: {
    question: 'As-tu déjà un employeur aux Philippines ?',
    options: [
      { id: 'oui', label: 'Oui, une entreprise locale m’embauche' },
      { id: 'non', label: 'Non, pas encore' },
    ],
  },
  investir: {
    question: 'Quel type d’investissement vises-tu ?',
    options: [
      { id: 'bourse', label: 'Bourse / entreprise' },
      { id: 'immo', label: 'Immobilier' },
    ],
  },
};

interface ResultData {
  name: string;
  tagline: string;
  badge?: string;
  tone: 'primary' | 'accent' | 'neutral';
  stats: { icon: IconDefinition; value: string; label: string; color: 'primary' | 'accent' }[];
  conditions: string[];
  caveat: string;
  alternatives: string[];
  cta: { label: string; href: string };
}

function getResult(objectif: ObjectifId, follow?: string): ResultData {
  const srrvCta = { label: 'Comparatif détaillé SRRV vs 13(a)', href: SRRV_ARTICLE };

  if (objectif === 'tourisme') {
    if (follow === 'long') {
      return {
        name: 'Visa touriste 9(a) + extensions',
        tagline: 'Pour rester plusieurs mois sans t’installer officiellement : on prolonge le séjour touristique.',
        tone: 'primary',
        stats: [
          { icon: faClock, value: '36 mois', label: 'Durée cumulée max', color: 'primary' },
          { icon: faSackDollar, value: 'Payant', label: 'Extensions au BI', color: 'accent' },
          { icon: faIdCard, value: '6 mois', label: 'Validité passeport', color: 'primary' },
          { icon: faArrowsRotate, value: '1 à 2 mois', label: 'Rythme de renouvellement', color: 'accent' },
        ],
        conditions: [
          'Entrée sans visa (30 jours), puis extension de 29 jours pour atteindre 59 jours.',
          'Ensuite, extensions 9(a) successives jusqu’à 36 mois (programme LSVVE).',
          'Extensions en ligne possibles via le nouveau système du Bureau of Immigration.',
        ],
        caveat: 'C’est un statut touristique, pas une résidence. Pour t’installer vraiment, vise un visa long séjour (SRRV, 13a, 9g selon ton cas).',
        alternatives: ['SRRV si retraité', 'Digital Nomad Visa si télétravail'],
        cta: { label: 'Voir tous les types de visas', href: '/vivre-aux-philippines/s-installer/visas' },
      };
    }
    return {
      name: 'Exemption de visa (9a)',
      tagline: 'Pour un séjour touristique court, aucune démarche préalable en tant que Français.',
      tone: 'primary',
      stats: [
        { icon: faClock, value: '30 jours', label: 'À l’arrivée (extensible)', color: 'primary' },
        { icon: faSackDollar, value: 'Gratuit', label: 'À l’entrée', color: 'accent' },
        { icon: faIdCard, value: '6 mois', label: 'Validité passeport requise', color: 'primary' },
        { icon: faArrowsRotate, value: 'jusqu’à 59 j', label: 'Avec 1re extension', color: 'accent' },
      ],
      conditions: [
        'Français : entrée sans visa pour 30 jours, à l’arrivée.',
        'Passeport valide 6 mois minimum + billet de sortie du territoire.',
        'Extension possible de 29 jours pour atteindre 59 jours.',
      ],
      caveat: 'Les règles d’entrée peuvent évoluer : vérifie toujours auprès du Bureau of Immigration avant de partir.',
      alternatives: ['Extensions 9a pour un séjour plus long'],
      cta: { label: 'Voir tous les types de visas', href: '/vivre-aux-philippines/s-installer/visas' },
    };
  }

  if (objectif === 'retraite') {
    if (follow === 'moins40') {
      return {
        name: 'SRRV : pas encore éligible avant 40 ans',
        tagline: 'Depuis la réforme du 1er septembre 2025, l’âge minimum du visa retraite SRRV est de 40 ans.',
        badge: 'Réforme sept. 2025',
        tone: 'neutral',
        stats: [
          { icon: faIdCard, value: '40 ans', label: 'Âge minimum SRRV', color: 'primary' },
          { icon: faClock, value: '9(a)', label: 'Alternative séjour long', color: 'accent' },
          { icon: faHeart, value: '13(a)', label: 'Si conjoint philippin', color: 'primary' },
          { icon: faLaptop, value: 'DNV', label: 'Si tu télétravailles', color: 'accent' },
        ],
        conditions: [
          'Le SRRV n’est pas accessible avant 40 ans depuis la réforme de 2025.',
          'En attendant : visa touriste 9(a) prolongé, ou 13(a) si tu épouses un(e) Philippin(e).',
          'Si tu travailles à distance, le nouveau Digital Nomad Visa peut convenir.',
        ],
        caveat: 'Les catégories SRRV Smile et Human Touch ont été supprimées en 2025. Renseigne-toi auprès de la PRA pour les dernières règles.',
        alternatives: ['9(a) prolongé', '13(a) conjoint', 'Digital Nomad Visa'],
        cta: srrvCta,
      };
    }
    if (follow === '40-49') {
      return {
        name: 'SRRV (retraite), tranche 40-49 ans',
        tagline: 'Éligible depuis la réforme 2025, avec un dépôt plus élevé que pour les 50 ans et plus.',
        badge: 'Réforme sept. 2025',
        tone: 'primary',
        stats: [
          { icon: faSackDollar, value: '25 à 50 k$', label: 'Dépôt (avec / sans pension)', color: 'accent' },
          { icon: faClock, value: 'Résidence', label: 'Séjour indéfini', color: 'primary' },
          { icon: faIdCard, value: '40-49 ans', label: 'Tranche d’âge', color: 'primary' },
          { icon: faArrowsRotate, value: 'Annuel', label: 'Rapport de résidence', color: 'accent' },
        ],
        conditions: [
          'SRRV Classic 40-49 ans : dépôt de 50 000 $ (sans pension) ou 25 000 $ (avec pension qualifiante).',
          'SRRV Courtesy possible (6 000 $, ou 3 000 $ avec pension/handicap) selon éligibilité.',
          'BI Clearance désormais obligatoire pour tous les candidats.',
        ],
        caveat: 'Montants et catégories réformés le 1er septembre 2025. Les chiffres exacts dépendent de ta situation : à confirmer auprès de la PRA.',
        alternatives: ['13(a) si conjoint philippin', 'SIRV si tu investis'],
        cta: srrvCta,
      };
    }
    return {
      name: 'SRRV (retraite), 50 ans et plus',
      tagline: 'La voie classique pour s’installer à la retraite, avec le dépôt le plus accessible.',
      badge: 'Réforme sept. 2025',
      tone: 'primary',
      stats: [
        { icon: faSackDollar, value: '15 à 30 k$', label: 'Dépôt (avec / sans pension)', color: 'accent' },
        { icon: faClock, value: 'Résidence', label: 'Séjour indéfini', color: 'primary' },
        { icon: faIdCard, value: '50 ans +', label: 'Tranche d’âge', color: 'primary' },
        { icon: faArrowsRotate, value: 'Annuel', label: 'Rapport de résidence', color: 'accent' },
      ],
      conditions: [
        'SRRV Classic 50+ : dépôt de 30 000 $ (sans pension) ou 15 000 $ (avec pension qualifiante).',
        'SRRV Courtesy : 1 500 $ pour les profils éligibles (ex. ancien Filipino, retraité d’un organisme reconnu).',
        'BI Clearance obligatoire depuis la réforme 2025.',
      ],
      caveat: 'Dépôts revus à la hausse le 1er septembre 2025. Vérifie le montant applicable à ton profil auprès de la PRA.',
      alternatives: ['13(a) si conjoint philippin'],
      cta: srrvCta,
    };
  }

  if (objectif === 'travail') {
    if (follow === 'oui') {
      return {
        name: 'Visa de travail 9(g)',
        tagline: 'Le visa des salariés parrainés par une entreprise philippine.',
        tone: 'primary',
        stats: [
          { icon: faClock, value: '1 à 3 ans', label: 'Durée selon contrat', color: 'primary' },
          { icon: faSackDollar, value: '₱12-18k', label: 'Coût annuel indicatif', color: 'accent' },
          { icon: faIdCard, value: 'AEP', label: 'Permis DOLE requis', color: 'primary' },
          { icon: faArrowsRotate, value: 'Annuel', label: 'Renouvellement employeur', color: 'accent' },
        ],
        conditions: [
          'Nécessite un employeur philippin qui te parraine.',
          'Permis de travail AEP délivré par le DOLE (ministère du Travail).',
          'Renouvellement annuel via l’employeur.',
        ],
        caveat: 'Sans employeur local, le 9(g) n’est pas accessible : regarde plutôt le télétravail (DNV) ou la création d’entreprise.',
        alternatives: ['Digital Nomad Visa', 'SIRV / création d’entreprise'],
        cta: { label: 'Guides travail & entreprise', href: '/vivre-aux-philippines/travail-entreprise' },
      };
    }
    return {
      name: 'Pas encore d’employeur ? Deux pistes',
      tagline: 'Le visa de travail 9(g) exige un employeur local. En attendant, deux options réalistes.',
      tone: 'neutral',
      stats: [
        { icon: faLaptop, value: 'DNV', label: 'Si tu télétravailles', color: 'primary' },
        { icon: faChartLine, value: 'SIRV', label: 'Si tu crées / investis', color: 'accent' },
        { icon: faPlane, value: '9(a)', label: 'Pour prospecter sur place', color: 'primary' },
        { icon: faIdCard, value: 'AEP', label: 'Requis dès qu’un emploi arrive', color: 'accent' },
      ],
      conditions: [
        'Le 9(g) suppose un contrat avec une entreprise philippine.',
        'Tu travailles à distance ? Le Digital Nomad Visa est fait pour ça.',
        'Tu veux monter une activité ? Regarde la création d’entreprise / le SIRV.',
      ],
      caveat: 'Prospecter sur place avec un visa touriste est possible, mais travailler sans le bon visa est interdit.',
      alternatives: ['Digital Nomad Visa', 'SIRV'],
      cta: { label: 'Guides travail & entreprise', href: '/vivre-aux-philippines/travail-entreprise' },
    };
  }

  if (objectif === 'investir') {
    if (follow === 'immo') {
      return {
        name: 'Immobilier : attention, ce n’est pas un visa',
        tagline: 'Acheter un bien ne donne aucun droit de séjour. Il faut le coupler à un vrai visa.',
        tone: 'neutral',
        stats: [
          { icon: faTriangleExclamation, value: '40 %', label: 'Quota étranger en condo', color: 'accent' },
          { icon: faIdCard, value: '0', label: 'Terrain possédé par un étranger', color: 'primary' },
          { icon: faUmbrellaBeach, value: 'SRRV', label: 'Visa à coupler', color: 'primary' },
          { icon: faHeart, value: '13(a)', label: 'Autre option de séjour', color: 'accent' },
        ],
        conditions: [
          'Un étranger peut posséder un condominium à 100 %, tant que la part étrangère de l’immeuble reste sous 40 %.',
          'Un étranger ne peut pas posséder de terrain (restriction constitutionnelle).',
          'Le droit de séjour vient d’un visa (SRRV, 13a, 9g...), pas de l’achat.',
        ],
        caveat: 'Beaucoup pensent qu’acheter donne un visa : c’est faux. Sépare bien les deux démarches.',
        alternatives: ['SRRV', 'SIRV', '13(a)'],
        cta: { label: 'Investir dans l’immobilier locatif', href: '/vivre-aux-philippines/investir/immobilier' },
      };
    }
    return {
      name: 'SIRV (visa investisseur)',
      tagline: 'Pour ceux qui investissent dans l’économie locale et veulent résider durablement.',
      tone: 'primary',
      stats: [
        { icon: faSackDollar, value: '75 000 $', label: 'Investissement minimum', color: 'accent' },
        { icon: faClock, value: 'Indéfinie', label: 'Résidence tant que l’invest. tient', color: 'primary' },
        { icon: faChartLine, value: 'Cotées / IPP', label: 'Cibles d’investissement', color: 'primary' },
        { icon: faArrowsRotate, value: 'Maintien', label: 'Conditionné à l’investissement', color: 'accent' },
      ],
      conditions: [
        'Investissement d’au moins 75 000 $ dans des sociétés cotées ou des secteurs prioritaires (IPP).',
        'Confère une résidence indéfinie tant que l’investissement est maintenu.',
        'Dossier via le Board of Investments + Bureau of Immigration.',
      ],
      caveat: 'Les secteurs éligibles et seuils évoluent : valide ton projet avec un conseiller avant d’engager les fonds.',
      alternatives: ['Création d’entreprise (9g)', 'SRRV si retraité'],
      cta: { label: 'Guides investir aux Philippines', href: '/vivre-aux-philippines/travail-entreprise' },
    };
  }

  if (objectif === 'teletravail') {
    return {
      name: 'Digital Nomad Visa (DNV)',
      tagline: 'Le tout nouveau visa pour travailler à distance depuis les Philippines.',
      badge: 'Nouveau · Executive Order n°86 (2025)',
      tone: 'accent',
      stats: [
        { icon: faClock, value: '1 an', label: 'Renouvelable', color: 'primary' },
        { icon: faLaptop, value: 'Hors PH', label: 'Revenus depuis l’étranger', color: 'accent' },
        { icon: faIdCard, value: '18 ans +', label: 'Âge minimum', color: 'primary' },
        { icon: faCircleCheck, value: 'Assurance', label: 'Santé exigée', color: 'accent' },
      ],
      conditions: [
        'Créé par l’Executive Order n°86 (2025), pour les travailleurs à distance.',
        'Revenus générés hors des Philippines, casier vierge, assurance santé valide.',
        'Durée d’un an, renouvelable, entrées multiples ; interdiction de travailler pour une entreprise locale.',
      ],
      caveat: 'Programme récent : les modalités d’application se déploient encore et la réciprocité entre pays est requise. Vérifie l’état d’ouverture pour la France auprès du DFA.',
      alternatives: ['9(a) prolongé en attendant', 'SIRV si tu investis'],
      cta: { label: 'Voir tous les types de visas', href: '/vivre-aux-philippines/s-installer/visas' },
    };
  }

  // conjoint
  return {
    name: 'Visa de conjoint 13(a)',
    tagline: 'La voie de résidence pour l’époux ou l’épouse d’un(e) Philippin(e).',
    tone: 'primary',
    stats: [
      { icon: faHeart, value: 'Permanent', label: 'Après 1 an probatoire', color: 'primary' },
      { icon: faIdCard, value: 'Mariage', label: 'Avec un(e) citoyen(ne) PH', color: 'accent' },
      { icon: faBriefcase, value: 'Autorisé', label: 'Droit de travailler', color: 'primary' },
      { icon: faArrowsRotate, value: 'Indéfini', label: 'Séjour une fois permanent', color: 'accent' },
    ],
    conditions: [
      'Réservé au conjoint étranger d’un(e) citoyen(ne) philippin(e).',
      'Visa probatoire d’un an, converti ensuite en résidence permanente.',
      'Donne le droit de vivre et de travailler aux Philippines.',
    ],
    caveat: 'La réciprocité entre pays s’applique (E.O. 408). Prépare les justificatifs de mariage et de vie commune.',
    alternatives: ['SRRV si retraité', '9(a) prolongé en attendant'],
    cta: srrvCta,
  };
}

/* ---------------------------------------------------------------------------- */
/* Présentation                                                                  */
/* ---------------------------------------------------------------------------- */

const EDITORIAL_POINTS = [
  '6 profils couverts, du tourisme à la retraite',
  'À jour de la réforme SRRV de septembre 2025',
  'Un résultat en moins d’une minute',
  'Basé sur les sources officielles (Bureau of Immigration, PRA)',
];

const EDITORIAL_STATS = [
  { value: '6', label: 'profils de visa' },
  { value: '< 1 min', label: 'pour un résultat' },
  { value: '2025-26', label: 'règles à jour' },
];

// Petit check décoratif (colonne éditoriale, identique au motif home).
const CheckIcon = () => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Tuile d'icône (fenêtre app) : bleu primary ou orange accent, façon lignes J1/J2.
const iconTileStyle = (color: 'primary' | 'accent') =>
  color === 'primary'
    ? { backgroundColor: 'rgba(59, 91, 219, 0.10)' }
    : { backgroundColor: 'rgba(245, 158, 11, 0.14)' };

// Ligne de choix cliquable, compacte (objectif ou question de suivi).
const ChoiceRow = ({
  icon,
  label,
  hint,
  onClick,
}: {
  icon?: IconDefinition;
  label: string;
  hint?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
  >
    {icon && (
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        style={iconTileStyle('primary')}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={icon} style={{ fontSize: '18px' }} />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block text-[14.5px] font-semibold leading-tight text-foreground" style={{ letterSpacing: '-0.01em' }}>
        {label}
      </span>
      {hint && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">{hint}</span>}
    </span>
    <FontAwesomeIcon
      icon={faArrowRight}
      className="h-3.5 w-3.5 flex-shrink-0 text-primary/60 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
      aria-hidden="true"
    />
  </button>
);

export const VisaSimulator = () => {
  const reduce = useReducedMotion();
  const [objectif, setObjectif] = useState<ObjectifId | null>(null);
  const [follow, setFollow] = useState<string | null>(null);

  const followUp = objectif ? FOLLOW_UPS[objectif] : undefined;
  const showResult = objectif !== null && (!followUp || follow !== null);

  const reset = () => { setObjectif(null); setFollow(null); };
  const selectObjectif = (id: ObjectifId) => { setObjectif(id); setFollow(null); };

  const result = showResult && objectif ? getResult(objectif, follow ?? undefined) : null;

  const anim = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: 'easeOut' as const },
  };

  return (
    <section className="bg-background py-10 md:py-16" aria-labelledby="visa-simulateur-titre">
      <div className="container mx-auto px-4">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl text-white"
          style={{
            background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Cercles pointillés décoratifs (haut-droite + bas-gauche) */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{ width: '320px', height: '320px', top: '-120px', right: '-80px', border: '2px dashed rgba(255, 255, 255, 0.13)' }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{ width: '200px', height: '200px', bottom: '-60px', left: '-40px', border: '2px dashed rgba(255, 255, 255, 0.13)', opacity: 0.9 }}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
            {/* Colonne gauche : pitch éditorial */}
            <div className="md:pt-1">
              <span
                className="mb-4 inline-block text-[13px] font-medium uppercase"
                style={{ letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.95)' }}
              >
                <span className="mr-1.5 text-accent" aria-hidden="true">✦</span>
                Outil gratuit
              </span>

              <h2
                id="visa-simulateur-titre"
                className="mb-4 font-bold text-white"
                style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
              >
                Quel visa pour les{' '}
                <span className="text-accent">Philippines</span>&nbsp;?
              </h2>

              <p className="mb-6 text-[16px]" style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
                Réponds à une ou deux questions. On identifie le visa adapté à ton projet,
                à jour des dernières règles d’immigration.
              </p>

              <ul className="mb-7 flex flex-col gap-2.5" role="list">
                {EDITORIAL_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[14px]" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
                    <span
                      className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-accent"
                      style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6">
                {EDITORIAL_STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <strong className="text-[24px] font-bold tabular-nums text-white" style={{ letterSpacing: '-0.02em' }}>
                      {s.value}
                    </strong>
                    <span className="text-[12px] uppercase" style={{ letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite : fenêtre "app" blanche, contient tout le flux */}
            <div
              className="overflow-hidden rounded-2xl bg-card text-foreground shadow-mockup"
              role="group"
              aria-label="Simulateur de visa"
            >
              {/* Barre de titre style Mac */}
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3" style={{ background: '#F8FAFC' }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
                <span className="ml-3 truncate text-[12px] font-semibold text-muted-foreground">
                  Simulateur de visa · Philippin’Easy
                </span>
              </div>

              {/* Corps produit */}
              <div className="px-5 py-5" aria-live="polite">
                <AnimatePresence mode="wait">
                  {/* Étape 1 : objectif */}
                  {objectif === null && (
                    <motion.div key="objectif" {...anim}>
                      <h3 className="text-[15px] font-semibold text-foreground">Quel est ton projet ?</h3>
                      <p className="mt-0.5 mb-3 text-[12.5px] text-muted-foreground">
                        Choisis l’objectif le plus proche du tien.
                      </p>
                      <div className="-mx-1 flex flex-col">
                        {OBJECTIFS.map((o) => (
                          <ChoiceRow key={o.id} icon={o.icon} label={o.label} hint={o.desc} onClick={() => selectObjectif(o.id)} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Étape 2 : question de suivi */}
                  {objectif !== null && followUp && follow === null && (
                    <motion.div key="followup" {...anim}>
                      <button
                        type="button"
                        onClick={reset}
                        className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" aria-hidden="true" />
                        Retour
                      </button>
                      <h3 className="mb-3 text-[15px] font-semibold text-foreground">{followUp.question}</h3>
                      <div className="-mx-1 flex flex-col">
                        {followUp.options.map((opt) => (
                          <ChoiceRow key={opt.id} label={opt.label} hint={opt.hint} onClick={() => setFollow(opt.id)} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Étape 3 : fiche résultat */}
                  {result && (
                    <motion.div key="result" {...anim}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Visa recommandé
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-[19px] font-bold leading-tight text-foreground" style={{ letterSpacing: '-0.02em' }}>
                          {result.name}
                        </h3>
                        {result.badge && (
                          <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-strong">
                            {result.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-[1.55] text-muted-foreground">{result.tagline}</p>

                      {/* Faits clés en lignes compactes (stats 2 à 4) */}
                      <div className="mt-4">
                        {result.stats.slice(1).map((s) => (
                          <div key={s.label} className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
                            <span
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                              style={{ ...iconTileStyle(s.color), color: s.color === 'primary' ? '#3B5BDB' : '#A85F0A' }}
                              aria-hidden="true"
                            >
                              <FontAwesomeIcon icon={s.icon} style={{ fontSize: '13px' }} />
                            </span>
                            <span className="flex-1 text-[13px] leading-snug text-muted-foreground">{s.label}</span>
                            <span className="text-right text-[14px] font-bold tabular-nums text-foreground">{s.value}</span>
                          </div>
                        ))}

                        {/* Fait mis en avant (dépôt / durée), façon footer "Budget estimé" */}
                        <div className="mt-1 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                          <span className="max-w-[58%] text-[11px] font-semibold uppercase leading-tight tracking-[0.07em] text-muted-foreground">
                            {result.stats[0].label}
                          </span>
                          <span className="text-right text-[18px] font-bold tabular-nums text-accent-strong">
                            {result.stats[0].value}
                          </span>
                        </div>
                      </div>

                      {/* Conditions clés (tight, sans grosse box) */}
                      <div className="mt-5">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                          Conditions clés
                        </p>
                        <ul className="space-y-1.5">
                          {result.conditions.map((c) => (
                            <li key={c} className="flex gap-2 text-[13px] leading-[1.5] text-foreground/80">
                              <FontAwesomeIcon icon={faCircleCheck} className="mt-[3px] h-3 w-3 flex-shrink-0 text-primary/70" aria-hidden="true" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* À vérifier : encadré honnête et discret */}
                      <div className="mt-4 flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="mt-[2px] h-3.5 w-3.5 flex-shrink-0 text-accent-strong" aria-hidden="true" />
                        <div>
                          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-accent-strong">À vérifier</p>
                          <p className="text-[12.5px] leading-[1.5] text-foreground/75">{result.caveat}</p>
                        </div>
                      </div>

                      {result.alternatives.length > 0 && (
                        <p className="mt-3 text-[12px] leading-[1.5] text-muted-foreground">
                          Autres pistes : {result.alternatives.join(' · ')}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        <Link
                          href={result.cta.href}
                          className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-semibold text-ink shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {result.cta.label}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                            aria-hidden="true"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={reset}
                          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-3 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <FontAwesomeIcon icon={faRotateLeft} className="h-3 w-3" aria-hidden="true" />
                          Recommencer
                        </button>
                      </div>

                      <p className="mt-4 text-[11px] leading-[1.5] text-muted-foreground">
                        Données 2025-2026 (réforme SRRV, Digital Nomad Visa). Sources :{' '}
                        <a
                          href="https://immigration.gov.ph/visas/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          Bureau of Immigration
                        </a>{' '}
                        et PRA. Ce simulateur est indicatif et ne remplace pas un avis officiel.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaSimulator;
