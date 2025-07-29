'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import TinderCard from 'react-tinder-card';
import { DatingProfile, DatingQuestionAnswer } from '@/types';
import { likeUser, superLikeUser } from '@/services/datingService';
import Image from 'next/image';

interface SwipeDeckProps {
  profiles: DatingProfile[];
  currentUserAnswers: DatingQuestionAnswer[];
  currentUserInterests: any[];
}

const SwipeDeck = ({ profiles, currentUserAnswers, currentUserInterests }: SwipeDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(profiles.length - 1);

  const canSwipe = currentIndex >= 0;

  const [match, setMatch] = useState<DatingProfile | null>(null);

  const swiped = async (direction: string, userId: string, index: number) => {
    setCurrentIndex(index - 1);
    try {
      const data = await likeUser(userId, direction);
      if (data.match) {
        setMatch(profiles[index]);
      }
    } catch (error) {
      console.error("Failed to like user", error);
    }
  };

  const outOfFrame = (idx: number) => {
    // console.log(`${profiles[idx]?.username} left the screen!`);
  };

  const handleSuperLike = async (userId: string) => {
    try {
      await superLikeUser(userId);
      // Maybe show some confirmation
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-w-md mx-auto flex flex-col items-center justify-center">
      {match && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold">It's a Match!</h2>
            <p className="text-xl mt-2">Vous et {match.username} vous êtes mutuellement aimés.</p>
            <button onClick={() => setMatch(null)} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg">Continuer</button>
          </div>
        </div>
      )}
      <div className="relative w-full h-full">
        {profiles.map((profile, index) => (
          <TinderCard
            key={profile.user_id}
            onSwipe={(dir) => swiped(dir, profile.user_id, index)}
            onCardLeftScreen={() => outOfFrame(index)}
          preventSwipe={['up', 'down']}
          className="absolute"
        >
            <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-white">
              <Image 
                src={profile.profile_picture_url || '/default-avatar.webp'}
                alt={profile.username || 'Profile picture'}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-3xl font-bold">{profile.username}, {profile.age}</h3>
                <p className="text-gray-200 text-lg">{profile.city}</p>
                <p className="text-xl font-bold text-green-400">
                  Compatibilité : {profile.compatibility}%
                </p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button onClick={() => {}} className="bg-white rounded-full p-4 shadow-lg">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2.25a.75.75 0 01.75.75v1.502a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM10 18.25a.75.75 0 01.75-.75v-1.502a.75.75 0 01-1.5 0v1.502c0 .414.336.75.75.75zM15.606 4.394a.75.75 0 011.06 1.06l-1.06-1.06zM4.394 15.606a.75.75 0 011.06 1.06l-1.06-1.06zM18.25 10a.75.75 0 01-.75.75h-1.502a.75.75 0 010-1.5h1.502a.75.75 0 01.75.75zM3.75 10a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM10 12.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"/></svg>
        </button>
        <button onClick={() => canSwipe && handleSuperLike(profiles[currentIndex].user_id)} className="bg-white rounded-full p-4 shadow-lg">
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </button>
        <button onClick={() => {}} className="bg-white rounded-full p-4 shadow-lg">
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
        </button>
      </div>
      {!canSwipe && <p className="text-center text-gray-500 mt-4">Plus de profils à découvrir pour le moment.</p>}
    </div>
  );
};

export default SwipeDeck;
