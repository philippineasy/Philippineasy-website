'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validateProfile, grantPremium, banUser } from './actions';

export const ProfilesClient = ({ profiles }: { profiles: any[] }) => {
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleAction = async (action: Function, ...args: any[]) => {
    setIsSubmitting(args[0]);
    await action(...args);
    setIsSubmitting(null);
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {profiles.map((profile: any) => (
        <tr key={profile.user_id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img className="h-10 w-10 rounded-full" src={profile.profile_picture_url || '/default-avatar.webp'} alt="" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{profile.profiles.username}</div>
                <div className="text-sm text-gray-500">{profile.email}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => handleAction(validateProfile, profile.user_id, !profile.is_validated)}
              disabled={isSubmitting === profile.user_id}
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                profile.is_validated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {profile.is_validated ? 'Validé' : 'En attente'}
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => handleAction(grantPremium, profile.user_id, profile.profiles.plan === 'premium' ? 'free' : 'premium')}
              disabled={isSubmitting === profile.user_id}
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                profile.profiles.plan === 'premium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {profile.profiles.plan}
            </button>
            {profile.profiles.stripe_subscription_id && <div className="text-xs text-gray-500 mt-1">Stripe</div>}
            {profile.profiles.premium_expires_at && (
              <div className="text-xs text-gray-500 mt-1">
                Expire le: {new Date(profile.profiles.premium_expires_at).toLocaleDateString('fr-FR')}
              </div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {profile.profiles.stripe_subscription_id ? (
              <span className="text-purple-600 font-semibold">Stripe</span>
            ) : profile.profiles.premium_expires_at ? (
              <span className="text-orange-600 font-semibold">Manuel</span>
            ) : (
              'N/A'
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {new Date(profile.created_at).toLocaleDateString('fr-FR')}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Link href={`/rencontre/profil/${profile.user_id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Voir</Link>
            <button
              onClick={() => handleAction(banUser, profile.user_id, !profile.profiles.is_banned)}
              disabled={isSubmitting === profile.user_id}
              className={`text-sm ${
                profile.profiles.is_banned ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'
              }`}
            >
              {profile.profiles.is_banned ? 'Débannir' : 'Bannir'}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};
