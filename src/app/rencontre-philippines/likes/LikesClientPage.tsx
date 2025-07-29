'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { Lock } from 'lucide-react';
import { getLikers } from '@/services/datingService';

interface LikerProfile {
  user_id: string;
  username: string;
  age: number;
  city: string;
  profile_picture_url: string;
}

const LikesClientPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [likers, setLikers] = useState<LikerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikers = async () => {
      if (user) {
        setLoading(true);
        try {
          const data = await getLikers();
          setLikers(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    if (!premiumLoading && !authLoading) {
      fetchLikers();
    }
  }, [user, authLoading, premiumLoading]);

  if (loading || premiumLoading || authLoading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  const renderProfileCard = (profile: LikerProfile) => {
    const canViewProfile = isPremium;
    const Wrapper = canViewProfile ? Link : 'div';
    
    const wrapperProps: any = {};
    if (canViewProfile) {
      wrapperProps.href = `/rencontre-philippines/profil/${profile.user_id}`;
    }

    return (
      <Wrapper key={profile.user_id} {...wrapperProps}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
          <div className="relative w-full h-64">
            <Image
              src={profile.profile_picture_url || '/default-avatar.webp'}
              alt={profile.username || 'Profile picture'}
              layout="fill"
              objectFit="cover"
              className={`group-hover:scale-110 transition-transform duration-500 ${!canViewProfile ? 'blur-md' : ''}`}
            />
            {!canViewProfile && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className={`text-2xl font-bold ${!canViewProfile ? 'text-transparent bg-gray-400/50 rounded-md' : ''}`}>
                {canViewProfile ? `${profile.username}, ${profile.age}` : 'Utilisateur mystère'}
              </h3>
              <p className={`text-gray-200 ${!canViewProfile ? 'text-transparent bg-gray-400/50 rounded-md mt-1' : ''}`}>
                {canViewProfile ? profile.city : 'Ville secrète'}
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Ils ont aimé votre profil</h1>
      {likers.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Personne n'a encore liké votre profil. Continuez à explorer !</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {likers.map(profile => renderProfileCard(profile))}
        </div>
      )}
      {!isPremium && likers.length > 0 && (
        <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-xl">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Dévoilez ces profils !</h2>
          <p className="mt-2 text-lg text-gray-600">Passez Premium pour voir qui s'intéresse à vous et discuter sans limites.</p>
          <Link href="/rencontre-philippines/premium" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg shadow-lg">
            Passer Premium
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikesClientPage;
