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
    return <div className="flex justify-center items-center h-screen">Chargement du profil...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Profil non trouvé ou non validé.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProfileHeader profile={profile} />
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {!isOwnProfile && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-primary">{compatibility}%</h3>
                <p className="text-muted-foreground">de compatibilité</p>
              </div>
            )}

            {!isOwnProfile && (
              <div className="lg:hidden">
                <ActionBar onLike={handleLike} onSuperLike={handleSuperLike} onReport={handleReport} onMessage={handleMessage} isMatch={isMatch} />
              </div>
            )}

            {isOwnProfile && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Mon Tableau de Bord</h2>
                  <ul className="space-y-3">
                    <li><Link href="/rencontre-philippines/messages" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faComments} className="w-5 mr-3" /> Mes Conversations</Link></li>
                    <li><Link href="/rencontre-philippines/likes" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faHeart} className="w-5 mr-3" /> Qui m'a liké ?</Link></li>
                    <li><Link href="/rencontre-philippines/swipe" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faClone} className="w-5 mr-3" /> Mode Découverte</Link></li>
                    <li><Link href="/rencontre-philippines/profil/modifier" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faEdit} className="w-5 mr-3" /> Modifier mon profil</Link></li>
                    {isPremium ? (
                      <li><Link href="/rencontre-philippines/profil/abonnement" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faShieldAlt} className="w-5 mr-3" /> Mon Abonnement</Link></li>
                    ) : (
                      <li><Link href="/rencontre-philippines/premium" className="flex items-center text-accent hover:underline"><FontAwesomeIcon icon={faCrown} className="w-5 mr-3" /> Passer Premium</Link></li>
                    )}
                    <li><button className="flex items-center text-destructive hover:underline"><FontAwesomeIcon icon={faTrash} className="w-5 mr-3" /> Supprimer le profil</button></li>
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
