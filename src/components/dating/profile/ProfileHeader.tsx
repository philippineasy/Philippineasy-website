'use client';

import { DatingProfile } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface ProfileHeaderProps {
  profile: DatingProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="relative h-96 md:h-[500px] w-full">
      <img
        src={profile.profile_picture_url || '/default-avatar.webp'}
        alt={profile.username || 'Photo de profil'}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold">
          {profile.username}, {profile.age}
        </h1>
        <p className="text-lg md:text-xl mt-1 text-gray-300">{profile.city}</p>
        <div className="mt-3 flex items-center space-x-4">
          {profile.plan === 'premium' && (
            <span className="bg-yellow-400 text-white px-3 py-1 text-xs md:text-sm rounded-full font-semibold">
              Premium
            </span>
          )}
          <span className="flex items-center bg-green-500 text-white px-3 py-1 text-xs md:text-sm rounded-full font-semibold">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Vérifié
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
