'use client';

import { useState, useEffect } from 'react';
import { DatingProfile, Interest, DatingPhoto } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { getFullProfile } from '@/services/datingService';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePanelProps {
  userId: string;
}

const ProfilePanel = ({ userId }: ProfilePanelProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || !user) return;
      setLoading(true);
      
      const { profile: profileData } = await getFullProfile(userId, user.id);
      
      setProfile(profileData);
      setLoading(false);
    };

    fetchProfileData();
  }, [userId, user]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6 text-center text-gray-500">Impossible de charger le profil.</div>;
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 overflow-y-auto h-full bg-gray-50"
    >
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 shadow-lg">
        <Image
          src={profile.profile_picture_url || '/default-avatar.webp'}
          alt={profile.user?.username || 'Profile picture'}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold text-shadow">{profile.user?.username}, {profile.birth_date && calculateAge(profile.birth_date)}</h3>
          {profile.city && <p className="text-sm text-shadow-sm flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 h-3 w-3" />{profile.city}</p>}
        </div>
      </div>
      
      {profile.description && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-2">À propos</h4>
          <p className="text-md text-gray-800">{profile.description}</p>
        </div>
      )}

      {profile.interests && profile.interests.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">Centres d'intérêt</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: Interest) => (
              <div key={interest.id} className="bg-accent/10 text-accent-dark text-sm font-semibold px-3 py-1 rounded-full">
                {interest.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.photos && profile.photos.length > 0 && (
         <div className="mt-6">
          <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">Photos</h4>
          <div className="grid grid-cols-3 gap-2">
            {profile.photos.slice(0,3).map((photo: DatingPhoto) => (
              <div key={photo.id} className="relative w-full h-24 rounded-lg overflow-hidden shadow-sm">
                <Image src={photo.image_url} alt="User photo" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Link href={`/rencontre-philippines/profil/${userId}`} className="mt-8 inline-block w-full text-center px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition duration-300 font-bold shadow-lg">
        Voir le profil complet
      </Link>
    </motion.div>
  );
};

export default ProfilePanel;
