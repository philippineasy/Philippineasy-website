'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { DatingProfile, Interest } from '@/types';
import { getProfiles, getInterests } from '@/services/datingService';
import { likeUser, superLikeUser } from '../profil/actions';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faStar, faFilter } from '@fortawesome/free-solid-svg-icons';
import SwipeFilters, { DatingFilters } from '@/components/dating/SwipeFilters';

interface SwipeClientPageProps {
  initialProfiles: DatingProfile[];
  hasMoreInitial: boolean;
}

const SwipeClientPage = ({ initialProfiles, hasMoreInitial }: SwipeClientPageProps) => {
  const [profiles, setProfiles] = useState<DatingProfile[]>(initialProfiles);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [loading, setLoading] = useState(false); // Initially false, as we have initialProfiles
  const { user } = useAuth();
  
  const [page, setPage] = useState(2); // Start fetching from page 2
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [activeFilters, setActiveFilters] = useState<DatingFilters | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);

  const canSwipe = profiles.length > 0;

  const childRefs: React.RefObject<any>[] = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map(() => React.createRef()),
    [profiles.length]
  );

  const fetchInitialData = async (filters: DatingFilters | null) => {
    setLoading(true);
    setPage(2); // Reset page count for new filter
    try {
      const [interests, profilesData] = await Promise.all([
        getInterests(),
        getProfiles(1, 20, filters, user?.id)
      ]);
      setAvailableInterests(interests);
      setProfiles(profilesData.profiles);
      setHasMore(profilesData.hasMore);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch interests on initial load, not profiles unless filters change
    getInterests().then(setAvailableInterests);
  }, []);

  useEffect(() => {
    if (activeFilters) {
      fetchInitialData(activeFilters);
    }
  }, [activeFilters]);

  const fetchMoreProfiles = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const profilesData = await getProfiles(page, 10, activeFilters, user?.id);
      if (profilesData.profiles.length > 0) {
        setProfiles(prev => [...profilesData.profiles, ...prev]); // Add new profiles to the bottom of the stack
        setPage(prev => prev + 1);
      }
      setHasMore(profilesData.hasMore);
    } catch (error) {
      console.error("Failed to fetch more profiles", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const swiped = async (direction: string, userId: string) => {
    console.log('swiping ' + direction + ' on ' + userId);
    
    try {
      if (direction === 'right') {
        await likeUser(userId);
      } else if (direction === 'up') {
        await superLikeUser(userId);
      }
    } catch (error) {
      console.error("Failed to record swipe", error);
    }

    // Check if we need to fetch more profiles
    if (profiles.length <= 5 && hasMore && !isFetchingMore) {
      fetchMoreProfiles();
    }
  };

  const outOfFrame = (userId: string) => {
    console.log(userId + ' left the screen!');
  };

  const swipe = async (dir: 'left' | 'right' | 'up') => {
    if (canSwipe) {
      await childRefs[profiles.length - 1].current.swipe(dir);
    }
  };

  const handleApplyFilters = (filters: DatingFilters) => {
    setActiveFilters(filters);
    if (window.innerWidth < 1024) { // On mobile, hide after applying
      setShowFilters(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Découverte</h1>
          {/* Filter button only on smaller screens */}
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="p-2 text-primary hover:text-primary/80 lg:hidden"
          >
            <FontAwesomeIcon icon={faFilter} className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full flex items-start justify-center px-4">
        <div className="w-full max-w-7xl flex lg:flex-row flex-col items-start justify-center gap-4">
          {/* Main Interaction Area (Card + Buttons) */}
          <div className="flex flex-col items-center justify-center lg:order-1 order-2">
            {/* Tinder Card Container */}
            <div className="relative w-[320px] h-[480px] sm:w-[350px] sm:h-[525px]">
              {loading ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-xl shadow-lg">
                  <p>Chargement des profils...</p>
                </div>
              ) : canSwipe ? (
                profiles.map((profile, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    key={profile.user_id}
                    onSwipe={(dir) => {
                      swiped(dir, profile.user_id);
                      setSwipeFeedback(null);
                    }}
                    onCardLeftScreen={() => {
                      setProfiles(prev => prev.slice(0, prev.length - 1));
                      setSwipeFeedback(null);
                      outOfFrame(profile.user_id);
                    }}
                    preventSwipe={['down']}
                    swipeRequirementType="position"
                    onSwipeRequirementFulfilled={(dir) => setSwipeFeedback(dir)}
                    onSwipeRequirementUnfulfilled={() => setSwipeFeedback(null)}
                  >
                    <div className="relative w-full h-full rounded-xl bg-black shadow-2xl overflow-hidden group">
                      {swipeFeedback && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div 
                            className={`p-4 rounded-lg text-white font-bold text-4xl
                              ${swipeFeedback === 'right' ? 'bg-green-500/70' : ''}
                              ${swipeFeedback === 'left' ? 'bg-red-500/70' : ''}
                              ${swipeFeedback === 'up' ? 'bg-blue-500/70' : ''}
                            `}
                          >
                            {swipeFeedback === 'right' && 'LIKE'}
                            {swipeFeedback === 'left' && 'NOPE'}
                            {swipeFeedback === 'up' && 'SUPER LIKE'}
                          </div>
                        </div>
                      )}
                      <img
                        className={`w-full h-full object-cover transition-opacity ${swipeFeedback ? 'opacity-80' : 'opacity-100'}`}
                        src={profile.profile_picture_url || '/default-avatar.webp'}
                        alt={profile.username || 'Profile'}
                      />
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <h3 className="text-2xl font-bold">{profile.username}, {profile.age}</h3>
                        <p className="text-base">{profile.city}</p>
                        {profile.description && <p className="text-sm mt-2 italic truncate group-hover:whitespace-normal">{profile.description}</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.interests?.slice(0, 3).map((interest) => (
                            <div key={interest.id} className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center gap-1">
                              <span>{interest.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TinderCard>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-xl shadow-lg p-8">
                  <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="text-xl font-semibold text-gray-700">Plus de profils pour le moment</h3>
                  <p className="text-center text-gray-500 mt-2">
                    Revenez plus tard ou essayez d'ajuster vos filtres pour découvrir plus de personnes !
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around w-full max-w-xs p-4 mt-2">
              <button onClick={() => swipe('left')} className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:bg-red-100 transition-colors text-red-500 text-3xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canSwipe || loading}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <button onClick={() => swipe('up')} className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-xl hover:bg-blue-100 transition-colors text-blue-500 text-4xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canSwipe || loading}>
                <FontAwesomeIcon icon={faStar} />
              </button>
              <button onClick={() => swipe('right')} className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:bg-green-100 transition-colors text-green-500 text-3xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canSwipe || loading}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
          </div>

          {/* Filters Panel - Conditional rendering for mobile, permanent for desktop */}
          <div className={`lg:order-2 order-1 lg:w-80 lg:h-auto lg:sticky lg:top-24 flex-shrink-0 bg-white p-4 rounded-lg shadow-lg lg:block ${showFilters ? 'block w-full mb-4' : 'hidden'}`}>
            <SwipeFilters onApplyFilters={handleApplyFilters} availableInterests={availableInterests} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SwipeClientPage;
