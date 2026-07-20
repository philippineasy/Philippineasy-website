import { Metadata } from 'next';
import FAQSchema from '@/components/shared/FAQSchema';
import RencontreClientPage from './RencontreClientPage';

// FAQ 100 % factuelle — valeurs vérifiées dans src/config/dating.ts
// (2 messages/jour et 10 traductions/jour en gratuit, illimité en Premium),
// les tarifs Premium (19,99 / 14,99 / 9,99 €/mois) et le délai de validation
// affiché sur /rencontre-philippines/en-attente (« moins de 24 heures »).
// Source unique : le schéma FAQPage est émis ici (serveur), la liste visible
// est rendue par <FaqAccordion> côté client avec les mêmes données.
const RENCONTRE_FAQS = [
  {
    q: 'Le site de rencontre Philippines est-il gratuit ?',
    a: "L'inscription et la création de profil sont gratuites pour tout le monde. Les femmes profitent d'une expérience 100 % gratuite et illimitée ; les hommes disposent de 2 messages et 10 traductions gratuits par jour, le Premium débloquant l'illimité.",
  },
  {
    q: 'La rencontre est-elle gratuite pour les femmes ?',
    a: "Oui, totalement. Pour les femmes, l'expérience est 100 % gratuite et sans limite : messages, découverte et rencontres, sans aucune restriction.",
  },
  {
    q: 'Comment les profils sont-ils validés ?',
    a: 'Chaque profil est vérifié à la main par notre équipe de modération, généralement en moins de 24 heures. Vous recevez un e-mail dès que le vôtre est approuvé.',
  },
  {
    q: "Combien coûte l'abonnement Premium ?",
    a: "Le Premium démarre à 19,99 €/mois pour un mois, 14,99 €/mois pour trois mois et 9,99 €/mois pour six mois. Il débloque les messages illimités, une meilleure visibilité et les Super Likes.",
  },
  {
    q: 'Puis-je échanger si je ne parle pas anglais ?',
    a: 'Oui. Une traduction FR ↔ EN ↔ Tagalog est intégrée à la messagerie : 10 traductions par jour gratuitement, et un nombre illimité avec le Premium.',
  },
];

export const metadata: Metadata = {
  // Ciblage transactionnel « site de rencontre philippines (gratuit) » :
  // l'informationnel « rencontre philippines » est capté par l'article
  // guide-rencontrer-femmes-philippines (audit SEO 2026-07-20, la landing
  // et l'article se cannibalisaient sur la même requête).
  title: 'Site de rencontre Philippines gratuit : profils vérifiés',
  description: 'Site de rencontre Philippines francophone : inscription gratuite, profils de Filipinas vérifiés à la main, messagerie avec traduction français-tagalog intégrée.',
  keywords: [
    'site de rencontre Philippines',
    'site de rencontre Philippines gratuit',
    'rencontre Philippines',
    'dating Philippines',
    'célibataires Philippines',
    'filipina rencontre',
    'expatriés Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/rencontre-philippines',
  },
  openGraph: {
    title: 'Site de rencontre Philippines gratuit : profils vérifiés',
    description: 'Inscription gratuite, profils de Filipinas vérifiés à la main, messagerie avec traduction intégrée. La communauté francophone de rencontre aux Philippines.',
    url: 'https://philippineasy.com/rencontre-philippines',
    siteName: 'Philippin\'Easy',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Couple heureux aux Philippines - Rencontre et amour',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site de rencontre Philippines gratuit : profils vérifiés',
    description: 'Inscription gratuite, profils vérifiés à la main, traduction français-tagalog intégrée.',
    images: ['https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp'],
  },
};

const RencontrePage = () => {
  return (
    <>
      <FAQSchema faqs={RENCONTRE_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      <RencontreClientPage faqs={RENCONTRE_FAQS} />
    </>
  );
};

export default RencontrePage;
