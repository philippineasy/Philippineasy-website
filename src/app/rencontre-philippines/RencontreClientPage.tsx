'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faEye,
  faStar,
  faClone,
  faVenus,
  faMars,
} from '@fortawesome/free-solid-svg-icons';

import { DatingProfile, DatingQuestionAnswer, Interest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { PageHero, CTABand } from '@/components/sections';
import { checkHasProfile, getUserExtras, getProfiles } from '@/services/datingService';

const premiumFeatures = [
  {
    icon: faComments,
    title: 'Messages illimités',
    description: 'Échangez sans compter avec toutes les personnes qui vous intéressent.',
  },
  {
    icon: faEye,
    title: 'Visibilité accrue',
    description: 'Votre profil est mis en avant et vu par davantage de membres.',
  },
  {
    icon: faStar,
    title: 'Super Likes',
    description: 'Sortez du lot et montrez un intérêt sincère avant même le match.',
  },
];

const RencontreClientPage = () => {
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
    return "Créer mon profil gratuit";
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

  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Rencontre · Communauté vérifiée"
        title="Rencontres aux"
        titleAccent="Philippines"
        subtitle="Des profils vérifiés à la main, des conversations qui comptent. Faites de belles rencontres au sein d'une communauté francophone et philippine."
        imageUrl="/imagesHero/couple-rencontre-aux-philippines.webp"
        imageAlt="Couple heureux au coucher du soleil aux Philippines"
        stats={[
          { value: 'Vérifiés', label: 'Profils validés à la main' },
          { value: 'Gratuit', label: 'Pour les femmes' },
          { value: 'FR', label: 'Communauté francophone' },
        ]}
      />

      {/* Intro + primary CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-[clamp(1.875rem,4vw,2.375rem)] font-bold leading-tight tracking-[-0.02em] text-foreground">
            Bienvenue dans l&apos;espace rencontre
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            Un lieu pensé pour des échanges authentiques et des connexions qui ont du sens — loin des
            applications impersonnelles.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={getButtonLink()}
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-accent px-8 text-base font-semibold text-ink shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {getButtonText()}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            {profileStatus.hasProfile && profileStatus.isValidated && (
              <Link
                href="/rencontre-philippines/swipe"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-border bg-card px-8 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FontAwesomeIcon icon={faClone} className="text-[14px] text-primary" />
                Mode Découverte
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Comment ça marche
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
              Simple, transparent, respectueux
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                <FontAwesomeIcon icon={faVenus} className="text-xl" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Pour les femmes</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                L&apos;expérience est <strong className="font-semibold text-foreground">100&nbsp;% gratuite</strong>.
                Discutez, partagez et rencontrez sans aucune limite.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faMars} className="text-xl" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Pour les hommes</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                L&apos;inscription est gratuite et vous permet d&apos;envoyer{' '}
                <strong className="font-semibold text-foreground">2 messages par jour</strong>. Pour des
                conversations illimitées, passez Premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-accent-strong">
              ★ Premium
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
              Passez à la vitesse supérieure
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Débloquez tout le potentiel de vos rencontres avec des fonctionnalités pensées pour aller
              plus loin.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {premiumFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:hover:translate-y-0"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={feature.icon} className="text-xl" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {!isPremium && (
            <div className="mt-10 text-center">
              <Link
                href="/rencontre-philippines/premium"
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Découvrir nos offres Premium
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Latest members */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                La communauté
              </span>
              <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
                Nos derniers membres inscrits
              </h2>
            </div>
            {profileStatus.hasProfile && profileStatus.isValidated && (
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
            {profiles.map((profile) => {
              const canView = isPremium || (user && user.id === profile.user_id); // Can always view own profile
              const Wrapper: any = canView ? Link : 'div';
              const wrapperProps: any = canView
                ? { href: `/rencontre-philippines/profil/${profile.user_id}` }
                : {};

              return (
                <Wrapper key={profile.user_id} {...wrapperProps} className="group block">
                  <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={profile.profile_picture_url || '/default-avatar.webp'}
                        alt={profile.username ? `Photo de ${profile.username}` : 'Photo de profil'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-[1.05] ${
                          !canView ? 'blur-md' : ''
                        }`}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                      />

                      {isRecent(profile.created_at) && (
                        <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-ink shadow-sm">
                          Nouveau
                        </span>
                      )}

                      {!canView && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <p className="text-center text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                            Inscrivez-vous pour voir les profils
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <h3 className="text-xl font-bold leading-tight [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]">
                          {canView ? `${profile.username}, ${profile.age}` : 'Membre'}
                        </h3>
                        <p className="text-sm text-white/85">
                          {canView ? profile.city : 'Ville masquée'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex min-h-[28px] flex-wrap gap-1.5">
                        {(profile.interests ?? []).slice(0, 3).map((interest) => (
                          <span
                            key={interest.id}
                            className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                          >
                            {interest.name}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-primary">
                        {canView ? 'Voir le profil' : 'Inscription requise'}
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                </Wrapper>
              );
            })}
          </div>

          {loadingProfiles && (
            <p className="mt-10 text-center text-muted-foreground">Chargement des profils…</p>
          )}
          {error && <p className="mt-10 text-center text-destructive">{error}</p>}
          {!loadingProfiles && hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMoreProfiles}
                className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Voir plus de profils
              </button>
            </div>
          )}
        </div>
      </section>

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
