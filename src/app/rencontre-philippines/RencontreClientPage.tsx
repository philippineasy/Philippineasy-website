'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-solid-svg-icons';

import { DatingProfile, DatingQuestionAnswer, Interest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { PageHero, CTABand, FaqAccordion } from '@/components/sections';
import { checkHasProfile, getUserExtras, getProfiles } from '@/services/datingService';
import { MemberCard } from './MemberCard';

const premiumFeatures = [
  {
    title: 'Messages illimités',
    description: 'Échangez sans compter avec toutes les personnes qui vous intéressent.',
  },
  {
    title: 'Visibilité accrue',
    description: 'Votre profil est mis en avant et vu par davantage de membres.',
  },
  {
    title: 'Super Likes',
    description: 'Sortez du lot et montrez un intérêt sincère avant même le match.',
  },
];

// Rencontre Premium — displayed tariffs. Canonical source of truth for these
// values is src/app/rencontre-philippines/premium/page.tsx (there is no shared
// dating-pricing config; services-pricing.ts is unrelated visa/guide pricing).
// Verified equal to the validated canvas: 19,99 / 14,99 / 9,99 €/mois.
const premiumPlans = [
  { label: '1 mois', price: '19,99 €', recommended: false },
  { label: '3 mois', price: '14,99 €', recommended: false },
  { label: '6 mois — recommandé', price: '9,99 €', recommended: true },
];

interface RencontreFaq {
  q: string;
  a: string;
}

// Schema is emitted server-side by the parent page.tsx (see RENCONTRE_FAQS) to
// keep the FAQPage JSON-LD out of this client bundle — so here withSchema=false.
const RencontreClientPage = ({ faqs }: { faqs: RencontreFaq[] }) => {
  const [profiles, setProfiles] = useState<DatingProfile[]>([]);
  const [profileStatus, setProfileStatus] = useState({ hasProfile: false, isValidated: false, loading: true });
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [, setCurrentUserAnswers] = useState<DatingQuestionAnswer[]>([]);
  const [, setCurrentUserInterests] = useState<Interest[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setProfileStatus((prev) => ({ ...prev, loading: true }));
      setLoadingProfiles(true);

      try {
        // Fetch profiles first
        const profileData = await getProfiles(1, 8, null, user?.id);
        setProfiles(profileData.profiles);
        setHasMore(profileData.hasMore);

        // Then check user-specific data
        if (user) {
          const status = await checkHasProfile(user.id);
          setProfileStatus({ ...status, loading: false });

          const extras = await getUserExtras(user.id);
          setCurrentUserAnswers(extras.answers);
          setCurrentUserInterests(extras.interests);
        } else {
          setProfileStatus({ hasProfile: false, isValidated: false, loading: false });
        }
      } catch (err: any) {
        setError(err.message);
        setProfileStatus((prev) => ({ ...prev, loading: false }));
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadInitialData();
  }, [user]);

  const getButtonLink = () => {
    if (profileStatus.loading) return '#';
    if (!user) return '/connexion';
    if (profileStatus.hasProfile) {
      return profileStatus.isValidated
        ? `/rencontre-philippines/profil/${user.id}`
        : '/rencontre-philippines/en-attente';
    }
    return '/rencontre-philippines/inscription';
  };

  const getButtonText = () => {
    if (profileStatus.loading) return 'Chargement…';
    if (!user) return 'Connectez-vous pour créer votre profil';
    if (profileStatus.hasProfile) {
      return profileStatus.isValidated ? 'Voir mon profil' : 'Profil en attente de validation';
    }
    return 'Créer mon profil gratuit';
  };

  const loadMoreProfiles = async () => {
    const nextPage = page + 1;
    setLoadingProfiles(true);
    try {
      const data = await getProfiles(nextPage, 8, null, user?.id);
      setProfiles((prev) => [...prev, ...data.profiles]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const isRecent = (createdAt: string) =>
    new Date(createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  const showDiscovery = profileStatus.hasProfile && profileStatus.isValidated;

  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Rencontre · Communauté vérifiée"
        title="Site de rencontre"
        titleAccent="Philippines"
        subtitle="Inscription gratuite, profils vérifiés à la main, messagerie avec traduction français-tagalog. Faites de belles rencontres au sein d'une communauté francophone et philippine."
        imageUrl="/imagesHero/couple-rencontre-aux-philippines.webp"
        imageAlt="Couple heureux au coucher du soleil aux Philippines"
      />

      {/* Hero CTA + trust line — the canvas anchors these in the hero; PageHero
          has no post-subtitle slot, so they sit in a snug band right below it. */}
      <section className="bg-background pt-12 pb-6 md:pt-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={getButtonLink()}
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-accent px-8 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {getButtonText()}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                →
              </span>
            </Link>
            {showDiscovery && (
              <Link
                href="/rencontre-philippines/swipe"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-border bg-card px-8 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FontAwesomeIcon icon={faClone} className="text-[14px] text-primary" />
                Mode Découverte
              </Link>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              Profils <strong className="font-semibold text-foreground">validés à la main</strong>
            </span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>
              <strong className="font-semibold text-foreground">Gratuit</strong> pour les femmes
            </span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>
              Communauté <strong className="font-semibold text-foreground">francophone</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="bg-background pt-10 pb-20 md:pb-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Comment ça marche
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
              Simple, transparent, <span className="text-accent">respectueux</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-[880px] gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">Pour les femmes</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                L&apos;expérience est{' '}
                <strong className="font-semibold text-foreground">100&nbsp;% gratuite</strong>. Discutez,
                partagez et rencontrez sans aucune limite.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">Pour les hommes</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                L&apos;inscription est gratuite et permet d&apos;envoyer{' '}
                <strong className="font-semibold text-foreground">2 messages par jour</strong>. Pour des
                conversations illimitées, passez Premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium ──────────────────────────────────────────────────────── */}
      <section className="bg-muted py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-accent-strong">
              <span aria-hidden="true">★</span>
              Premium
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
              Passez à la vitesse <span className="text-accent">supérieure</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Débloquez tout le potentiel de vos rencontres avec des fonctionnalités pensées pour aller
              plus loin.
            </p>
          </div>

          <div className="mx-auto grid max-w-[960px] gap-6 md:grid-cols-3">
            {premiumFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tarifs Premium — même patron que les packs Services. */}
          {!isPremium && (
            <div className="relative mx-auto mt-10 max-w-[720px] rounded-2xl border-[1.5px] border-primary bg-card px-6 py-8 shadow-md sm:px-8">
              <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
                Rencontre Premium
              </span>

              <div className="grid grid-cols-3">
                {premiumPlans.map((plan, i) => (
                  <div
                    key={plan.label}
                    className={`px-1.5 py-2.5 text-center sm:px-3 ${
                      i < premiumPlans.length - 1 ? 'border-r border-border' : ''
                    }`}
                  >
                    <span
                      className={`mb-1.5 block text-[11px] leading-tight sm:text-[13px] ${
                        plan.recommended ? 'font-medium text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {plan.label}
                    </span>
                    <span
                      className={`block text-[22px] font-bold tabular-nums tracking-[-0.02em] sm:text-2xl ${
                        plan.recommended ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {plan.price}
                      <span className="text-[11px] font-normal text-muted-foreground sm:text-xs">/mois</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-border pt-4 text-center">
                <Link
                  href="/rencontre-philippines/premium"
                  className="group inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Découvrir nos offres Premium
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                    →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Nos derniers membres inscrits ────────────────────────────────── */}
      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                La communauté
              </span>
              <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
                Nos derniers membres <span className="text-accent">inscrits</span>
              </h2>
            </div>
            {showDiscovery && (
              <Link
                href="/rencontre-philippines/swipe"
                className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:self-auto"
              >
                <FontAwesomeIcon icon={faClone} className="text-[13px]" />
                Mode Découverte
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {profiles.map((profile, index) => (
              <MemberCard
                key={profile.user_id}
                profile={profile}
                index={index}
                canView={Boolean(isPremium || (user && user.id === profile.user_id))}
                isNew={isRecent(profile.created_at)}
              />
            ))}
          </div>

          {loadingProfiles && (
            <p className="mt-10 text-center text-muted-foreground">Chargement des profils…</p>
          )}
          {error && <p className="mt-10 text-center text-destructive">{error}</p>}
          {!loadingProfiles && hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMoreProfiles}
                className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Voir plus de profils
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ (visible ; schema émis par la page serveur parente) ──────── */}
      <section className="bg-muted py-20 md:py-24">
        <div className="container mx-auto px-4">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Tout est"
            titleAccent="clair ?"
            faqs={faqs}
          />
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <CTABand
        title="Prêt à faire une"
        titleAccent="belle rencontre ?"
        subtitle="Créez votre profil en quelques minutes. C'est gratuit, et chaque profil est vérifié à la main."
        primary={{ label: getButtonText(), href: getButtonLink() }}
        secondary={{ label: 'Voir les offres Premium', href: '/rencontre-philippines/premium' }}
      />
    </div>
  );
};

export default RencontreClientPage;
