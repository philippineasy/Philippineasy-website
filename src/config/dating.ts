import { SelectOption } from '@/components/shared/CustomSelect';

export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'homme_transgenre', label: 'Homme transgenre' },
  { value: 'femme_transgenre', label: 'Femme transgenre' },
  { value: 'non-binaire', label: 'Non-binaire' },
  { value: 'autre', label: 'Autre' },
];

export const ORIENTATION_OPTIONS: SelectOption[] = [
  { value: 'hétérosexuel(le)', label: 'Hétérosexuel(le)' },
  { value: 'homosexuel(le)', label: 'Homosexuel(le)' },
  { value: 'bisexuel(le)', label: 'Bisexuel(le)' },
  { value: 'pansexuel(le)', label: 'Pansexuel(le)' },
  { value: 'asexuel(le)', label: 'Asexuel(le)' },
  { value: 'autre', label: 'Autre' },
];

export const RELIGION_OPTIONS: SelectOption[] = [
  { value: 'christianity', label: 'Christianisme' },
  { value: 'islam', label: 'Islam' },
  { value: 'hinduism', label: 'Hindouisme' },
  { value: 'buddhism', label: 'Bouddhisme' },
  { value: 'sikhism', label: 'Sikhisme' },
  { value: 'judaism', label: 'Judaïsme' },
  { value: 'bahai', label: 'Bahaïsme' },
  { value: 'jainism', label: 'Jaïnisme' },
  { value: 'shintoism', label: 'Shintoïsme' },
  { value: 'taoism', label: 'Taoïsme' },
  { value: 'zoroastrianism', label: 'Zoroastrisme' },
  { value: 'agnosticism', label: 'Agnosticisme' },
  { value: 'atheism', label: 'Athéisme' },
  { value: 'other', label: 'Autre' },
];

export const EDUCATION_OPTIONS: SelectOption[] = [
    { value: "sans_diplôme", label: "Sans diplôme" },
    { value: "brevet_des_collèges", label: "Brevet des collèges" },
    { value: "cap/bep", label: "CAP/BEP" },
    { value: "baccalauréat", label: "Baccalauréat" },
    { value: "bac+2_(bts,_dut)", label: "Bac+2 (BTS, DUT)" },
    { value: "bac+3_(licence)", label: "Bac+3 (Licence)" },
    { value: "bac+5_(master)", label: "Bac+5 (Master)" },
    { value: "doctorat", label: "Doctorat" },
    { value: "autre", label: "Autre" },
];

export const DATING_INTENT_OPTIONS: SelectOption[] = [
  { value: 'serious_relationship', label: 'Relation sérieuse' },
  { value: 'casual_dating', label: 'Rencards sans prise de tête' },
  { value: 'friendship', label: 'Amitié' },
  { value: 'not_sure', label: 'Je ne suis pas sûr(e)' },
];

export const YES_NO_MAYBE_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Oui, absolument !' },
  { value: 'maybe', label: 'Peut-être, cela dépend des circonstances' },
  { value: 'no', label: 'Non, je préfère rester dans mon pays' },
];

export const MONEY_IMPORTANCE_OPTIONS: SelectOption[] = [
  { value: 'very_important', label: 'C\'est un facteur essentiel pour moi' },
  { value: 'important', label: 'C\'est important, mais pas prioritaire' },
  { value: 'not_important', label: 'Ce n\'est pas un critère important' },
];

export const FOREINGNER_KINKY_OPTIONS: SelectOption[] = [
  { value: 'very_open', label: 'Très ouverte et aventureuse' },
  { value: 'open', label: 'Ouverte à la découverte' },
  { value: 'reserved', label: 'Plutôt réservée' },
];

export const PARTNER_MOVE_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Oui, avec plaisir' },
  { value: 'maybe', label: 'J\'y suis ouvert, mais cela demanderait de la discussion' },
  { value: 'no', label: 'Non, ce serait compliqué pour moi' },
];

export const FINANCIAL_STABILITY_OPTIONS: SelectOption[] = [
  { value: 'supportive', label: 'Je suis prêt à soutenir entièrement mon/ma partenaire' },
  { value: 'balanced', label: 'Je crois en un équilibre et une contribution mutuelle' },
  { value: 'independent', label: 'Je préfère que chacun soit financièrement indépendant' },
];

export const PARTNER_NOT_KINKY_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Oui, je privilégie la tendresse et la connexion' },
  { value: 'balanced', label: 'J\'apprécie un équilibre entre les deux' },
  { value: 'no', label: 'Non, j\'aime explorer et expérimenter' },
];

export const DATING_CONFIG = {
  free_plan: {
    daily_message_limit: 2,
    super_likes_per_day: 0,
  },
  premium_plan: {
    daily_message_limit: -1, // -1 means unlimited
    super_likes_per_day: 1,
  },
};
