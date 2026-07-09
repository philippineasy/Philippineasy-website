'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DatingProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { likeUser, superLikeUser } from '../actions';
import { reportUserAction, blockUserAction } from '../../messages/actions';
import { getFullProfile } from '@/services/datingService';

import ProfileHeader from '@/components/dating/profile/ProfileHeader';
import PhotoGallery from '@/components/dating/profile/PhotoGallery';
import ProfileTabs from '@/components/dating/profile/ProfileTabs';
import ActionBar from '@/components/dating/profile/ActionBar';
import UserLimits from '@/components/dating/profile/UserLimits';
import ProfileViewers from '@/components/dating/profile/ProfileViewers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faShieldAlt, faTrash, faCrown, faClone, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';

const ProfileClientPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [compatibility, setCompatibility] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isOwnProfile = user?.id === id;

  // Modales signalement / blocage (remplacent prompt()/alert() natifs).
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [blockOpen, setBlockOpen] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Action Handlers
  const handleReport = () => {
    setReportReason('');
    setReportOpen(true);
  };

  const submitReport = async () => {
    if (!profile || reportReason.trim().length < 5) return;
    setModalBusy(true);
    const res = await reportUserAction(profile.user_id, reportReason);
    setModalBusy(false);
    setReportOpen(false);
    setFeedback(res.error || 'Signalement transmis. Merci — notre équipe va examiner ce profil.');
  };

  const submitBlock = async () => {
    if (!profile) return;
    setModalBusy(true);
    const res = await blockUserAction(profile.user_id);
    setModalBusy(false);
    setBlockOpen(false);
    if (res.error) {
      setFeedback(res.error);
    } else {
      router.push('/rencontre-philippines/swipe');
      router.refresh();
    }
  };

  const handleMessage = () => {
    if (isMatch) {
      router.push(`/rencontre-philippines/messages/${profile?.user_id}`);
    }
  };

  const handleLike = async () => {
    if (!user || !profile || isOwnProfile) return;
    setIsSubmitting(true);
    setActionError(null);
    const result = await likeUser(profile.user_id);
    if (result.error) {
      setActionError(result.error);
    } else {
      alert('Like envoyé !');
    }
    setIsSubmitting(false);
  };

  const handleSuperLike = async () => {
    if (!user || !profile || isOwnProfile) return;
    if (!isPremium) {
      router.push('/rencontre-philippines/premium');
      return;
    }
    setIsSubmitting(true);
    setActionError(null);
    const result = await superLikeUser(profile.user_id);
    if (result.error) {
      setActionError(result.error);
    } else {
      alert('Super Like envoyé !');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { profile: fetchedProfile, compatibility: fetchedCompatibility, isMatch: fetchedIsMatch } = await getFullProfile(id as string, user.id);
        setProfile(fetchedProfile);
        setCompatibility(fetchedCompatibility);
        setIsMatch(fetchedIsMatch);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Chargement du profil…</div>;
  }

  if (!profile) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Profil non trouvé ou non validé.</div>;
  }

  return (
    <div className="bg-muted min-h-screen">
      <ProfileHeader profile={profile} />
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {!isOwnProfile && (
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="block text-4xl font-bold tabular-nums tracking-[-0.02em] text-primary">
                  {compatibility}%
                </span>
                <p className="mt-1 text-sm text-muted-foreground">de compatibilité</p>
              </div>
            )}

            {!isOwnProfile && (
              <div className="lg:hidden">
                <ActionBar onLike={handleLike} onSuperLike={handleSuperLike} onReport={handleReport} onMessage={handleMessage} onBlock={() => setBlockOpen(true)} isMatch={isMatch} />
              </div>
            )}

            {isOwnProfile && (
              <>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold tracking-[-0.01em] text-foreground">Mon tableau de bord</h2>
                  <ul className="space-y-1">
                    {[
                      { href: '/rencontre-philippines/messages', icon: faComments, label: 'Mes conversations' },
                      { href: '/rencontre-philippines/likes', icon: faHeart, label: "Qui m'a liké ?" },
                      { href: '/rencontre-philippines/swipe', icon: faClone, label: 'Mode Découverte' },
                      { href: '/rencontre-philippines/profil/modifier', icon: faEdit, label: 'Modifier mon profil' },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FontAwesomeIcon icon={item.icon} className="text-[13px]" />
                          </span>
                          {item.label}
                          <span aria-hidden="true" className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                      </li>
                    ))}
                    {isPremium ? (
                      <li>
                        <Link
                          href="/rencontre-philippines/profil/abonnement"
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-[13px]" />
                          </span>
                          Mon abonnement
                          <span aria-hidden="true" className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link
                          href="/rencontre-philippines/premium"
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-accent-strong transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-strong">
                            <FontAwesomeIcon icon={faCrown} className="text-[13px]" />
                          </span>
                          Passer Premium
                          <span aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                      </li>
                    )}
                    <li className="pt-1">
                      <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <FontAwesomeIcon icon={faTrash} className="text-[13px]" />
                        </span>
                        Supprimer le profil
                      </button>
                    </li>
                  </ul>
                </div>
                <UserLimits />
                <ProfileViewers />
              </>
            )}
          </div>

          {/* Center Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileTabs profile={profile} />
            <PhotoGallery profile={profile} isOwnProfile={isOwnProfile} />
          </div>

        </div>
      </div>
      
      {/* Desktop Action Bar */}
      {!isOwnProfile && (
        <div className="hidden lg:block fixed right-8 bottom-8">
           <ActionBar onLike={handleLike} onSuperLike={handleSuperLike} onReport={handleReport} onMessage={handleMessage} onBlock={() => setBlockOpen(true)} isMatch={isMatch} />
        </div>
      )}

      {/* Modale — Signaler */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={() => setReportOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground">Signaler {profile.username ?? 'ce profil'}</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Explique ce qui ne va pas (comportement, contenu inapproprié…)"
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Annuler</button>
              <button type="button" onClick={submitReport} disabled={modalBusy || reportReason.trim().length < 5} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {modalBusy ? '…' : 'Envoyer le signalement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale — Bloquer */}
      {blockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={() => setBlockOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground">Bloquer {profile.username ?? 'ce membre'} ?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Vous ne pourrez plus vous écrire ni apparaître dans vos suggestions respectives. Cette personne ne sera pas notifiée.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setBlockOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Annuler</button>
              <button type="button" onClick={submitBlock} disabled={modalBusy} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50">
                {modalBusy ? '…' : 'Bloquer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback (remplace alert()) */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={() => setFeedback(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm leading-relaxed text-foreground">{feedback}</p>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setFeedback(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileClientPage;
