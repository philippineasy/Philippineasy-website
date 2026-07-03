'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DatingProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { reportUser, likeUser, superLikeUser } from '../actions';
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

  // Action Handlers
  const handleReport = async () => {
    if (!user || !profile) return;
    const reason = prompt("Veuillez indiquer la raison de votre signalement :");
    if (reason) {
      await reportUser(user.id, profile.user_id, reason);
      alert('Utilisateur signalé. Merci pour votre contribution.');
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
                <ActionBar onLike={handleLike} onSuperLike={handleSuperLike} onReport={handleReport} onMessage={handleMessage} isMatch={isMatch} />
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
           <ActionBar onLike={handleLike} onSuperLike={handleSuperLike} onReport={handleReport} onMessage={handleMessage} isMatch={isMatch} />
        </div>
      )}
    </div>
  );
};

export default ProfileClientPage;
