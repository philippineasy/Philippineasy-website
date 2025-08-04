'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { supabase } from '@/utils/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faCrown } from '@fortawesome/free-solid-svg-icons';

interface ViewerProfile {
  id: string;
  username: string;
  age: number;
  profile_picture_url: string;
}

const ProfileViewers = () => {
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [viewers, setViewers] = useState<ViewerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchViewers = async () => {
        // Fetch the last 5 unique viewers
        const { data, error } = await supabase.rpc('get_profile_viewers', { p_user_id: user.id, p_limit: 5 });

        if (data) {
          setViewers(data);
        }
        setLoading(false);
      };
      fetchViewers();
    }
  }, [user]);

  if (loading || premiumLoading) {
    return <div className="bg-white rounded-lg shadow-lg p-6 text-center">Chargement des visiteurs...</div>;
  }

  if (viewers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FontAwesomeIcon icon={faEye} className="mr-3 text-gray-400" />
          Qui a vu mon profil ?
        </h2>
        <p className="text-muted-foreground text-center py-4">Personne n'a encore visité votre profil.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faEye} className="mr-3 text-gray-400" />
        Qui a vu mon profil ?
      </h2>
      <div className="space-y-3">
        {viewers.map((viewer, index) => (
          <Link 
            key={viewer.id} 
            href={isPremium ? `/rencontre/profil/${viewer.id}` : '/rencontre/premium'}
            className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="relative">
              <img 
                src={viewer.profile_picture_url || '/default-avatar.webp'}
                alt="Visiteur" 
                className={`w-12 h-12 rounded-full object-cover ${!isPremium ? 'blur-sm' : ''}`}
              />
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <FontAwesomeIcon icon={faLock} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <p className={`font-bold ${!isPremium ? 'text-transparent bg-gray-300 rounded-md' : 'text-gray-800'}`}>
                {isPremium ? `${viewer.username}, ${viewer.age}` : 'Utilisateur Premium'}
              </p>
              <p className="text-sm text-muted-foreground">A vu votre profil</p>
            </div>
          </Link>
        ))}
      </div>
      {!isPremium && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
           <p className="text-sm text-muted-foreground mb-3">Passez Premium pour voir qui s'intéresse à vous !</p>
          <Link href="/rencontre/premium" className="w-full inline-block bg-gradient-to-r from-accent to-yellow-400 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md">
            <FontAwesomeIcon icon={faCrown} className="mr-2" />
            Découvrir qui vous a vu
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileViewers;
