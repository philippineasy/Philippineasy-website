'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faCrown } from '@fortawesome/free-solid-svg-icons';

interface ViewerProfile {
  // Non-premium callers only ever receive `{ masked: true }` placeholders
  // from /api/dating/viewers (server-side gating) — every other field is
  // then optional.
  id?: string;
  username?: string;
  age?: number;
  profile_picture_url?: string;
  masked?: boolean;
}

const ProfileViewers = () => {
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [viewers, setViewers] = useState<ViewerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchViewers = async () => {
        try {
          const response = await fetch('/api/dating/viewers');
          if (response.ok) {
            const data = await response.json();
            setViewers(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchViewers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading || premiumLoading) {
    return <div className="bg-card rounded-lg shadow-lg p-6 text-center">Chargement des visiteurs...</div>;
  }

  if (viewers.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <FontAwesomeIcon icon={faEye} className="mr-3 text-muted-foreground/60" />
          Qui a vu mon profil ?
        </h2>
        <p className="text-muted-foreground text-center py-4">Personne n'a encore visité votre profil.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
        <FontAwesomeIcon icon={faEye} className="mr-3 text-muted-foreground/60" />
        Qui a vu mon profil ?
      </h2>
      <div className="space-y-3">
        {viewers.map((viewer, index) => {
          // Source of truth is the payload itself: the API only ever sends
          // real fields to a premium caller, so `masked` is authoritative
          // even if the client-side isPremium hook is momentarily stale.
          const canView = isPremium && !viewer.masked;
          return (
            <Link
              key={viewer.id ?? `masked-${index}`}
              href={canView ? `/rencontre-philippines/profil/${viewer.id}` : '/rencontre-philippines/premium'}
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted"
            >
              <div className="relative">
                <img
                  src={(canView && viewer.profile_picture_url) || '/default-avatar.webp'}
                  alt="Visiteur"
                  className={`w-12 h-12 rounded-full object-cover ${!canView ? 'blur-sm' : ''}`}
                />
                {!canView && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <FontAwesomeIcon icon={faLock} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-bold ${!canView ? 'text-transparent bg-muted rounded-md' : 'text-foreground'}`}>
                  {canView ? `${viewer.username}, ${viewer.age}` : 'Utilisateur Premium'}
                </p>
                <p className="text-sm text-muted-foreground">A vu votre profil</p>
              </div>
            </Link>
          );
        })}
      </div>
      {!isPremium && (
        <div className="mt-4 pt-4 border-t border-border text-center">
           <p className="text-sm text-muted-foreground mb-3">Passez Premium pour voir qui s'intéresse à vous !</p>
          <Link href="/rencontre-philippines/premium" className="w-full inline-block bg-accent text-accent-foreground font-bold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors shadow-md">
            <FontAwesomeIcon icon={faCrown} className="mr-2" />
            Découvrir qui vous a vu
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileViewers;
