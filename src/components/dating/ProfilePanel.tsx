'use client';

import { useState, useEffect } from 'react';
import { DatingProfile, Interest, DatingPhoto } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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
        <div className="h-48 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-6 w-1/2 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-4 w-1/3 bg-muted rounded-lg animate-pulse"></div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6 text-center text-muted-foreground">Impossible de charger le profil.</div>;
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
      className="p-6 overflow-y-auto h-full bg-muted"
    >
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 shadow-card">
        <Image
          src={profile.profile_picture_url || '/default-avatar.webp'}
          alt={profile.user?.username ? `Photo de ${profile.user.username}` : 'Photo de profil'}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
          <FontAwesomeIcon icon={faCheckCircle} className="text-[11px]" />
          Vérifié
        </span>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">{profile.user?.username}, {profile.birth_date && calculateAge(profile.birth_date)}</h3>
          {profile.city && <p className="text-sm text-white/90 flex items-center [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 h-3 w-3" />{profile.city}</p>}
        </div>
      </div>
      
      {profile.description && (
        <div className="mt-6">
          <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-2">À propos</h4>
          <p className="text-md text-foreground">{profile.description}</p>
        </div>
      )}

      {profile.interests && profile.interests.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-3">Centres d'intérêt</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: Interest) => (
              <div key={interest.id} className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                {interest.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.photos && profile.photos.length > 0 && (
         <div className="mt-6">
          <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-3">Photos</h4>
          <div className="grid grid-cols-3 gap-2">
            {profile.photos.slice(0,3).map((photo: DatingPhoto) => (
              <div key={photo.id} className="relative w-full h-24 rounded-lg overflow-hidden shadow-sm">
                <Image src={photo.image_url} alt="User photo" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Link href={`/rencontre-philippines/profil/${userId}`} className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        Voir le profil complet
      </Link>
    </motion.div>
  );
};

export default ProfilePanel;
