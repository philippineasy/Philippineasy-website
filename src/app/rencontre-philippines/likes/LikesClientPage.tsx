'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { Lock, Heart } from 'lucide-react';
import { getLikers } from '@/services/datingService';

interface LikerProfile {
  user_id: string;
  username: string;
  age: number;
  city: string;
  profile_picture_url: string;
}

// Signature gradients — same brand constants as MemberCard, cycled by index.
// Shown (instead of a blurred photo) when the viewer isn't allowed to see the
// real photo: elegant, on-brand, and never serves the private image.
const MEMBER_GRADIENTS = [
  'linear-gradient(160deg, #3B5BDB, #1e40af)', // blue
  'linear-gradient(160deg, #0F766E, #134E4A)', // teal
  'linear-gradient(160deg, #B45309, #92400E)', // amber-brown
  'linear-gradient(160deg, #6D28D9, #4C1D95)', // violet
] as const;

// Bottom scrim — identical to MemberCard, keeps white text AA over any photo/duo.
const SCRIM = 'linear-gradient(to top, rgba(10,20,50,0.72), rgba(10,20,50,0.05) 55%, transparent)';

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
    return <div className="py-20 text-center text-muted-foreground">Chargement…</div>;
  }

  const renderProfileCard = (profile: LikerProfile, index: number) => {
    const canViewProfile = isPremium;
    const gradient = MEMBER_GRADIENTS[index % MEMBER_GRADIENTS.length];
    const showPhoto = canViewProfile && Boolean(profile.profile_picture_url);

    const media = (
      <div
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden"
        style={showPhoto ? undefined : { background: gradient }}
      >
        {showPhoto ? (
          <Image
            src={profile.profile_picture_url || '/default-avatar.webp'}
            alt={profile.username || 'Photo de profil'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          // Locked: signature gradient + lock glyph. No name exists for a hidden
          // liker, so a lock (rather than an initial) is the honest, non-leaking cue.
          <span
            aria-hidden="true"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm"
          >
            <Lock className="h-6 w-6 text-white/95" />
          </span>
        )}

        {/* Bottom scrim + name/age + city (constant gradient, AA-safe). */}
        <div className="absolute inset-x-0 bottom-0 px-4 py-3.5 text-white" style={{ background: SCRIM }}>
          <span className="block text-[17px] font-bold leading-tight tracking-[-0.01em]">
            {canViewProfile ? `${profile.username}, ${profile.age}` : 'Profil masqué'}
          </span>
          <span className="text-[12.5px] text-white/85">
            {canViewProfile ? profile.city : 'Ville masquée'}
          </span>
        </div>
      </div>
    );

    const footer = (
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-1 text-[11px] font-semibold text-pink-600 dark:text-pink-400">
          <Heart className="h-3 w-3 fill-current" />
          Vous a liké
        </span>
        <span className="flex items-center gap-1 text-[13px] font-semibold text-primary">
          {canViewProfile ? 'Voir' : 'Premium'}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </div>
    );

    const card = (
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {media}
        {footer}
      </article>
    );

    if (canViewProfile) {
      return (
        <Link
          key={profile.user_id}
          href={`/rencontre-philippines/profil/${profile.user_id}`}
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {card}
        </Link>
      );
    }

    return (
      <div key={profile.user_id} className="group block">
        {card}
      </div>
    );
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Votre communauté
          </span>
          <h1 className="mt-3 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
            Ils ont aimé <span className="text-accent">votre profil</span>
          </h1>
        </div>

        {likers.length === 0 ? (
          <p className="text-center text-[15px] leading-relaxed text-muted-foreground">
            Personne n&apos;a encore liké votre profil. Continuez à explorer&nbsp;!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {likers.map((profile, index) => renderProfileCard(profile, index))}
          </div>
        )}

        {!isPremium && likers.length > 0 && (
          <div className="relative mx-auto mt-14 max-w-[560px] rounded-2xl border-[1.5px] border-primary bg-card px-6 py-9 text-center shadow-md sm:px-8">
            <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
              Premium
            </span>
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold tracking-[-0.01em] text-foreground">
              Dévoilez ces profils
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Passez Premium pour voir qui s&apos;intéresse à vous et discuter sans limites.
            </p>
            <Link
              href="/rencontre-philippines/premium"
              className="group mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Passer Premium
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikesClientPage;
