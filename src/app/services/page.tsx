import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrown,
  faUsers,
  faShieldAlt,
  faPlane,
  faHeart,
  faStar,
  faCheck,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ServiceCard from '@/components/services/ServiceCard';
import FAQSchema from '@/components/shared/FAQSchema';
import {
  BUDDY_PRICING,
  VOYAGE_SEREIN_PRICING,
  PACK_ULTIME_PRICING,
  SERVICE_DETAILS,
  SERVICE_DURATION_LABELS,
} from '@/config/services-pricing';

const serviceFAQs = [
  {
    question: "Qu'est-ce que le Buddy System ?",
    answer:
      "Le Buddy System vous met en relation avec un expatrié français vivant aux Philippines. Vous bénéficiez de calls avant, pendant et après votre voyage, ainsi qu'un contact WhatsApp direct pour des conseils personnalisés et locaux.",
  },
  {
    question: 'Comment fonctionne le suivi WhatsApp ?',
    answer:
      "Pendant votre voyage, vous avez un accès direct à notre équipe via WhatsApp. Problème de transport, question sur un restaurant, besoin d'aide en urgence ? Nous sommes là pour vous répondre rapidement.",
  },
  {
    question: 'Le Pack Ultime inclut-il vraiment tout ?',
    answer:
      "Oui ! Le Pack Ultime comprend l'itinéraire Conciergerie, le Buddy System complet, le suivi WhatsApp pendant tout votre séjour, l'abonnement Easy+ 1 an, Rencontre Premium 6 mois, un guide PDF au choix et l'accès à vie au groupe privé.",
  },
  {
    question: 'Puis-je payer en plusieurs fois ?',
    answer:
      'Pour les packs supérieurs à 200€, nous proposons le paiement en 2 ou 3 fois sans frais. Contactez-nous pour en discuter.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <FAQSchema faqs={serviceFAQs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Services Exclusifs
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Accompagnement <span className="text-primary">Personnalisé</span> aux Philippines
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Des services uniques que nos concurrents ne peuvent pas offrir : IA + Humain, Buddy
            System avec expats français, suivi WhatsApp en temps réel.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
              +10 000 voyageurs accompagnés
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
              Satisfaction 98%
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
              Support francophone
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Voyageurs - Itinéraires */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={faPlane} className="text-4xl text-accent mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Pour les Voyageurs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Préparez votre voyage avec nos itinéraires personnalisés générés par IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Express</h3>
              <p className="text-2xl font-bold text-primary mb-2">9.99€ - 29.99€</p>
              <p className="text-sm text-muted-foreground">100% IA, livraison instantanée</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-6 text-center border-2 border-primary">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Populaire
              </span>
              <h3 className="font-bold text-lg mb-2 mt-2">Premium</h3>
              <p className="text-2xl font-bold text-primary mb-2">29€ - 99€</p>
              <p className="text-sm text-muted-foreground">IA + modifications + support email</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Conciergerie</h3>
              <p className="text-2xl font-bold text-primary mb-2">79€ - 219€</p>
              <p className="text-sm text-muted-foreground">Sur-mesure + WhatsApp direct</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/itineraire-personnalise-pour-les-philippines"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Créer mon itinéraire <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Accompagnement Personnalisé */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-primary mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Accompagnement Personnalisé</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ce que nos concurrents ne peuvent PAS offrir : un vrai accompagnement humain avec des
              français sur place
            </p>
          </div>

          {/* Buddy System */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <FontAwesomeIcon icon={faUsers} className="text-primary" />
              Buddy System
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full">
                Exclusif
              </span>
            </h3>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Un expatrié français vivant aux Philippines devient votre mentor personnel
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <ServiceCard
                name="Buddy Court Séjour"
                description="3-5 jours"
                features={['2 calls de 30min', 'WhatsApp 1 semaine', 'Conseils locaux personnalisés']}
                price={79}
                icon="faUsers"
                ctaText="Choisir"
                ctaHref="#contact"
              />
              <ServiceCard
                name="Buddy Standard"
                description="1-2 semaines"
                features={[
                  '3 calls de 30min',
                  'WhatsApp 2 semaines',
                  'Conseils locaux personnalisés',
                  'Support pendant le voyage',
                ]}
                price={119}
                icon="faUsers"
                badge="Populaire"
                highlighted
                ctaText="Choisir"
                ctaHref="#contact"
              />
              <ServiceCard
                name="Buddy Long Séjour"
                description="3+ semaines"
                features={[
                  '4 calls de 30min',
                  'WhatsApp 1 mois',
                  'Conseils locaux personnalisés',
                  'Support complet',
                  'Réseau d\'entraide',
                ]}
                price={149}
                icon="faUsers"
                ctaText="Choisir"
                ctaHref="#contact"
              />
            </div>
          </div>

          {/* Pack Voyage Serein */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
              Pack Voyage Serein
            </h3>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Itinéraire Premium + Call avec Hugo + Suivi WhatsApp pendant tout votre voyage
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <ServiceCard
                name="Serein Court"
                description="3-5 jours"
                features={[
                  'Itinéraire Premium inclus',
                  'Call 30min avant départ',
                  'Suivi WhatsApp 1 semaine',
                  'Checklist personnalisée',
                ]}
                price={99}
                icon="faShieldAlt"
                ctaText="Choisir"
                ctaHref="#contact"
              />
              <ServiceCard
                name="Serein Standard"
                description="1-2 semaines"
                features={[
                  'Itinéraire Premium inclus',
                  'Call 30min avant départ',
                  'Suivi WhatsApp 2 semaines',
                  'Checklist personnalisée',
                  'Support en cas de problème',
                ]}
                price={149}
                icon="faShieldAlt"
                badge="Populaire"
                highlighted
                ctaText="Choisir"
                ctaHref="#contact"
              />
              <ServiceCard
                name="Serein Long"
                description="3+ semaines"
                features={[
                  'Itinéraire Premium inclus',
                  'Call 30min avant départ',
                  'Suivi WhatsApp 3 semaines',
                  'Checklist personnalisée',
                  'Support prioritaire',
                ]}
                price={199}
                icon="faShieldAlt"
                ctaText="Choisir"
                ctaHref="#contact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pack Ultime */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={faCrown} className="text-5xl text-accent mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Pack Ultime</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour réussir votre projet Philippines. Le pack le plus
              complet du marché.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Jusqu&apos;à 2 semaines</p>
                <p className="text-4xl font-bold text-foreground">369€</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Itinéraire Conciergerie',
                  'Buddy System complet',
                  'Suivi WhatsApp 2 sem.',
                  'Easy+ 1 an',
                  'Rencontre Premium 6 mois',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="block w-full py-3 bg-muted text-foreground rounded-lg text-center font-semibold hover:bg-muted/80"
              >
                Choisir
              </Link>
            </div>

            <div className="bg-card rounded-2xl shadow-xl p-8 border-2 border-primary relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
                Best Value
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">3 semaines - 1 mois</p>
                <p className="text-4xl font-bold text-primary">449€</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Itinéraire Conciergerie',
                  'Buddy System complet',
                  'Suivi WhatsApp 4 sem.',
                  'Easy+ 1 an',
                  'Rencontre Premium 6 mois',
                  'Guide PDF au choix',
                  'Groupe privé à vie',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="block w-full py-3 bg-primary text-primary-foreground rounded-lg text-center font-semibold hover:bg-primary/90"
              >
                Choisir
              </Link>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">+1 mois / Expatriation</p>
                <p className="text-4xl font-bold text-foreground">549€</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Itinéraire Conciergerie',
                  'Buddy System complet',
                  'Suivi WhatsApp illimité',
                  'Easy+ 1 an',
                  'Rencontre Premium 6 mois',
                  'Tous les Guides PDF',
                  'Groupe privé à vie',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="block w-full py-3 bg-muted text-foreground rounded-lg text-center font-semibold hover:bg-muted/80"
              >
                Choisir
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Communauté */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={faHeart} className="text-4xl text-pink-500 mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Communauté & Abonnements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rejoignez notre communauté francophone aux Philippines
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Rencontre Premium */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faHeart} className="text-2xl text-pink-500" />
                <h3 className="text-xl font-bold">Rencontre Premium</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Rencontrez des personnes partageant votre passion pour les Philippines
              </p>
              <div className="space-y-2 mb-6">
                <p className="flex justify-between">
                  <span>1 mois</span>
                  <span className="font-bold">19.99€/mois</span>
                </p>
                <p className="flex justify-between">
                  <span>3 mois</span>
                  <span className="font-bold">14.99€/mois</span>
                </p>
                <p className="flex justify-between text-primary">
                  <span>6 mois</span>
                  <span className="font-bold">9.99€/mois</span>
                </p>
              </div>
              <Link
                href="/rencontre-philippines/premium"
                className="block w-full py-3 bg-pink-500 text-white rounded-lg text-center font-semibold hover:bg-pink-600"
              >
                Découvrir
              </Link>
            </div>

            {/* Easy+ */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-500" />
                <h3 className="text-xl font-bold">Easy+</h3>
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">VIP</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Abonnement privilège avec -20% partenaires, support prioritaire, guides premium
              </p>
              <div className="space-y-2 mb-6">
                <p className="flex justify-between">
                  <span>Mensuel</span>
                  <span className="font-bold">29.99€/mois</span>
                </p>
                <p className="flex justify-between text-primary">
                  <span>Annuel (-31%)</span>
                  <span className="font-bold">249€/an</span>
                </p>
              </div>
              <Link
                href="/meilleurs-plans-aux-philippines"
                className="block w-full py-3 bg-yellow-500 text-white rounded-lg text-center font-semibold hover:bg-yellow-600"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contact" className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre aventure ?</h2>
          <p className="text-lg opacity-90 mb-8">
            Contactez-nous pour discuter de votre projet et trouver l&apos;offre qui vous convient
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/VOTRE_NUMERO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              Discuter sur WhatsApp
            </a>
            <Link
              href="/itineraire-personnalise-pour-les-philippines"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Créer mon itinéraire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
