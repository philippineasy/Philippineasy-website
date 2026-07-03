import { CheckCircle, Star, Heart, Ghost } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passez Premium - Rencontre Philippines',
  description: 'Découvrez les avantages de l\'abonnement Premium : Super Likes, mode incognito, et voyez qui vous a liké. Multipliez vos chances de rencontre.',
};

// Signature / product gradients — amber (accent), dating rose, violet duo.
const FEATURES = [
  {
    icon: Star,
    gradient: 'linear-gradient(160deg, #F59E0B, #B45309)',
    title: 'Super Likes',
    text: "Vous avez un vrai coup de cœur ? Montrez-le avec un Super Like. Votre profil apparaîtra en priorité chez cette personne avec une notification spéciale. Vos chances de match sont multipliées par 3 !",
  },
  {
    icon: Heart,
    gradient: 'linear-gradient(160deg, #EC4899, #BE185D)',
    title: 'Découvrez qui vous aime',
    text: 'Ne perdez plus de temps à swiper dans le vide. Découvrez directement la liste de toutes les personnes qui ont déjà liké votre profil et choisissez qui vous plaît en retour.',
  },
  {
    icon: Ghost,
    gradient: 'linear-gradient(160deg, #6D28D9, #4C1D95)',
    title: 'Mode Incognito',
    text: "Visitez les profils en toute discrétion. Vous n'apparaîtrez dans les suggestions et les recherches que des personnes que vous avez vous-même likées. Contrôlez qui peut voir votre profil.",
  },
];

// Prices & Stripe checkout links unchanged. Order matches the previous layout.
const PLANS = [
  {
    duration: '1 mois',
    price: '19.99€',
    caption: 'par mois',
    href: '/api/dating/checkout?plan=month',
    highlight: false,
    badge: null as string | null,
  },
  {
    duration: '6 mois',
    price: '9.99€',
    caption: 'par mois (facturé 59.94€)',
    href: '/api/dating/checkout?plan=semester',
    highlight: true,
    badge: 'Le plus populaire',
  },
  {
    duration: '3 mois',
    price: '14.99€',
    caption: 'par mois (facturé 44.97€)',
    href: '/api/dating/checkout?plan=trimester',
    highlight: false,
    badge: null,
  },
];

const COMPARISON: { label: string; free: React.ReactNode; premium: React.ReactNode }[] = [
  { label: 'Inscription & Création de profil', free: 'check', premium: 'check' },
  { label: 'Recherche de profils', free: 'check', premium: 'check' },
  { label: 'Messages par jour (hommes)', free: '2', premium: 'Illimités' },
  { label: 'Messages (femmes)', free: 'Illimités', premium: 'Illimités' },
  { label: 'Voir qui a aimé votre profil', free: 'dash', premium: 'check' },
  { label: 'Super Likes', free: '1 par semaine', premium: '5 par jour' },
  { label: 'Mise en avant du profil', free: 'dash', premium: 'check' },
  { label: 'Mode Incognito', free: 'dash', premium: 'check' },
];

const Cell = ({ value }: { value: React.ReactNode }) => {
  if (value === 'check') return <CheckCircle className="mx-auto h-5 w-5 text-success" />;
  if (value === 'dash') return <span className="text-muted-foreground/50">—</span>;
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

const PremiumPage = () => {
  return (
    <div className="min-h-screen bg-muted">
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-accent-strong">
            <span aria-hidden="true">★</span>
            Premium
          </span>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-foreground">
            Passez à <span className="text-accent">Premium</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            Débloquez le meilleur de notre plateforme et multipliez vos chances de faire des rencontres inoubliables.
          </p>
        </div>

        {/* Detailed Features */}
        <section className="mt-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-foreground">
              Les avantages Premium <span className="text-accent">en détail</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, gradient, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ background: gradient }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing — PriceCard patron */}
        <section className="mt-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-foreground">
              Choisissez votre <span className="text-accent">plan</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
              Un seul plan, plusieurs durées. Simple et transparent.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.duration}
                className={`relative flex h-full flex-col rounded-2xl bg-card p-7 ${
                  plan.highlight
                    ? 'border-[1.5px] border-primary shadow-md md:-translate-y-1'
                    : 'border border-border shadow-sm'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
                    {plan.badge}
                  </span>
                )}

                <span className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">{plan.duration}</span>

                <div className="mt-4 mb-1 flex items-baseline gap-2">
                  <span
                    className={`text-[32px] font-bold tabular-nums leading-none tracking-[-0.02em] ${
                      plan.highlight ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {plan.price}
                  </span>
                </div>
                <span className="text-[13px] text-muted-foreground">{plan.caption}</span>

                <div className="mt-auto pt-7">
                  <Link
                    href={plan.href}
                    className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      plan.highlight
                        ? 'bg-accent text-accent-foreground shadow-cta hover:bg-accent/90 hover:scale-[1.02] motion-reduce:hover:scale-100'
                        : 'border border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Choisir ce plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mt-24">
          <h2 className="text-center text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-foreground">
            Comparez les <span className="text-accent">fonctionnalités</span>
          </h2>
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border shadow-sm">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Fonctionnalité</th>
                  <th className="px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Gratuit</th>
                  <th className="bg-primary/5 px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {COMPARISON.map((row) => (
                  <tr key={row.label}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{row.label}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.free === 'string' && (row.free === 'Illimités') ? (
                        <span className="text-sm font-semibold text-primary">{row.free}</span>
                      ) : (
                        <Cell value={row.free} />
                      )}
                    </td>
                    <td className="bg-primary/5 px-6 py-4 text-center">
                      {typeof row.premium === 'string' && row.premium !== 'check' ? (
                        <span className="text-sm font-semibold text-primary">{row.premium}</span>
                      ) : (
                        <Cell value={row.premium} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-foreground">
            Questions <span className="text-accent">fréquentes</span>
          </h2>
          <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-6 shadow-sm">
            <div className="py-5">
              <dt className="font-semibold text-foreground">Le paiement est-il sécurisé ?</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Oui, toutes les transactions sont traitées via Stripe, une plateforme de paiement mondialement reconnue pour sa sécurité.</dd>
            </div>
            <div className="py-5">
              <dt className="font-semibold text-foreground">Puis-je annuler mon abonnement à tout moment ?</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Absolument. Vous pouvez gérer votre abonnement et l&apos;annuler à tout moment depuis les paramètres de votre profil. L&apos;accès Premium restera actif jusqu&apos;à la fin de la période de facturation en cours.</dd>
            </div>
            <div className="py-5">
              <dt className="font-semibold text-foreground">Quels sont les moyens de paiement acceptés ?</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Nous acceptons les principales cartes de crédit (Visa, Mastercard, American Express) ainsi que d&apos;autres moyens de paiement via Stripe.</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
};

export default PremiumPage;
