'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSearch, faStar, faTh, faClone } from '@fortawesome/free-solid-svg-icons';

import { DatingProfile, DatingQuestionAnswer, Interest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { HeroThematic } from '@/components/ui/HeroThematic';
import SwipeDeck from '@/components/dating/SwipeDeck';
import { checkHasProfile, getUserExtras, getProfiles } from '@/services/datingService';

const RencontreClientPage = () => {
  const [profiles, setProfiles] = useState<DatingProfile[]>([]);
  const [viewMode, setViewMode] = useState('grid');
  const [profileStatus, setProfileStatus] = useState({ hasProfile: false, isValidated: false, loading: true });
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserAnswers, setCurrentUserAnswers] = useState<DatingQuestionAnswer[]>([]);
  const [currentUserInterests, setCurrentUserInterests] = useState<Interest[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setProfileStatus(prev => ({ ...prev, loading: true }));
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
        setProfileStatus(prev => ({ ...prev, loading: false }));
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
      return profileStatus.isValidated ? `/rencontre-philippines/profil/${user.id}` : '/rencontre-philippines/en-attente';
    }
    return '/rencontre-philippines/inscription';
  };

  const getButtonText = () => {
    if (profileStatus.loading) return 'Chargement...';
    if (!user) return 'Connectez-vous pour créer votre profil';
    if (profileStatus.hasProfile) {
      return profileStatus.isValidated ? 'Voir mon profil' : 'Profil en attente de validation';
    }
    return 'Créer mon profil et trouver l\'amour';
  };

  const loadMoreProfiles = async () => {
    const nextPage = page + 1;
    setLoadingProfiles(true);
    try {
      const data = await getProfiles(nextPage, 8, null, user?.id);
      setProfiles(prev => [...prev, ...data.profiles]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <HeroThematic
        titlePart1="Nos"
        titlePart2="Rencontres"
        subtitle="Trouvez votre moitié aux Philippines"
        imageUrl="/imagesHero/couple rencontre aux Philippines.webp"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Bienvenue dans l'Espace Rencontre</h2>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Un lieu conçu pour des interactions authentiques et des connexions significatives.
          </p>
          <div className="mt-8">
            <Link href={getButtonLink()} className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105 text-lg shadow-lg">
              {getButtonText()}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 my-16">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Passez Premium pour une expérience complète</h3>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6 bg-gray-50 rounded-xl">
              <FontAwesomeIcon icon={faComments} className="text-5xl text-primary mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Messages Illimités</h4>
              <p className="text-gray-600">Discutez sans limites avec toutes les personnes qui vous intéressent.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <FontAwesomeIcon icon={faSearch} className="text-5xl text-primary mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Visibilité Accrue</h4>
              <p className="text-gray-600">Votre profil est mis en avant pour être vu par plus de membres.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <FontAwesomeIcon icon={faStar} className="text-5xl text-primary mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Accès Exclusif</h4>
              <p className="text-gray-600">Débloquez des fonctionnalités exclusives sur tout le site.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/rencontre-philippines/premium" className="inline-block bg-accent text-white font-bold py-4 px-10 rounded-full hover:bg-accent/90 transition-transform transform hover:scale-105 text-lg shadow-lg">
              Découvrir nos offres Premium
            </Link>
          </div>
        </div>

        <div className="bg-primary/10 border-l-4 border-primary text-primary-dark p-6 rounded-lg my-16">
          <h4 className="font-bold text-xl mb-2">Comment ça marche ?</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <p>👩‍🦰 **Pour les femmes :** L'expérience est **100% gratuite** ! Discutez, partagez et rencontrez sans aucune limite.</p>
            <p>👨‍🦱 **Pour les hommes :** L'inscription est gratuite et vous permet d'envoyer **2 messages par jour**. Pour des conversations illimitées, passez Premium !</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Nos derniers membres inscrits</h3>
          {profileStatus.hasProfile && (
            <Link href="/rencontre-philippines/swipe" className="bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105 text-lg shadow-lg">
              <FontAwesomeIcon icon={faClone} className="mr-2" />
              Mode Découverte
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {profiles.map(profile => {
              const canView = isPremium || (user && user.id === profile.user_id); // Can always view own profile
              const Wrapper = canView ? Link : 'div';
              const wrapperProps: any = canView ? { href: `/rencontre-philippines/profil/${profile.user_id}` } : {};

              return (
                <Wrapper key={profile.user_id} {...wrapperProps}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative w-full h-64">
                      <Image
                        src={profile.profile_picture_url || '/default-avatar.webp'}
                        alt={profile.username || 'Profile picture'}
                        layout="fill"
                        objectFit="cover"
                        className={`group-hover:scale-110 transition-transform duration-500 ${!canView ? 'blur-sm' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      {!canView && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                          <p className="text-white font-bold text-center text-lg">Inscrivez-vous pour voir les profils</p>
                        </div>
                      )}
                      {new Date(profile.created_at).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000 && (
                        <span className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">NOUVEAU</span>
                      )}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className={`text-2xl font-bold ${!canView ? 'text-transparent bg-gray-400/50 rounded-md' : ''}`}>
                          {canView ? `${profile.username}, ${profile.age}`: 'Utilisateur'}
                        </h3>
                        <p className={`text-gray-200 ${!canView ? 'text-transparent bg-gray-400/50 rounded-md mt-1' : ''}`}>
                          {canView ? profile.city : 'Ville secrète'}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(profile.interests ?? []).slice(0, 3).map((interest) => (
                          <div key={interest.id} className="bg-gray-200 rounded-full px-3 py-1 text-xs">
                            {interest.name}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                        {canView ? 'Voir le profil' : 'Inscription requise'}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        {loadingProfiles && <p className="text-center mt-8">Chargement des profils...</p>}
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}
        {!loadingProfiles && hasMore && (
          <div className="text-center mt-12">
            <button onClick={loadMoreProfiles} className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors">
              Voir plus de profils
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RencontreClientPage;
