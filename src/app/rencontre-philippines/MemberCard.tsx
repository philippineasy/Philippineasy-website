import Image from 'next/image';
import Link from 'next/link';
import type { DatingProfile } from '@/types';

/**
 * MemberCard — "Nos derniers membres inscrits" card (design_v4 canvas).
 *
 * Photo treatment (see RÈGLE PRODUIT in the mission):
 *  - DEFAULT (viewer not authorized): a full-colour signature gradient + the
 *    member initial. This replaces the old blurred photo — more elegant and
 *    RGPD-safe (the real photo is never shown/served to unauthorized viewers).
 *  - AUTHORIZED viewer (same gating as the page: premium or own profile): the
 *    real photo replaces the gradient, with the exact same bottom scrim.
 *
 * Gating for name / city / link is UNCHANGED: non-authorized viewers see
 * "Membre" / "Ville masquée" and the card is not a link — so the initial is
 * derived from the *displayed* name ("M") and leaks nothing.
 */

// Signature gradients — INTENTIONAL brand constants, identical in dark mode.
// Cycled by card index, mirroring the canvas order (blue, teal, amber, violet).
const MEMBER_GRADIENTS = [
  'linear-gradient(160deg, #3B5BDB, #1e40af)', // blue
  'linear-gradient(160deg, #0F766E, #134E4A)', // teal
  'linear-gradient(160deg, #B45309, #92400E)', // amber-brown
  'linear-gradient(160deg, #6D28D9, #4C1D95)', // violet
] as const;

// Bottom scrim — constant, tuned to keep white name/city legible on any photo
// or gradient (holds AA over the darkest signature duo).
const SCRIM = 'linear-gradient(to top, rgba(10,20,50,0.72), rgba(10,20,50,0.05) 55%, transparent)';

interface MemberCardProps {
  profile: DatingProfile;
  index: number;
  canView: boolean;
  isNew: boolean;
}

export const MemberCard = ({ profile, index, canView, isNew }: MemberCardProps) => {
  const gradient = MEMBER_GRADIENTS[index % MEMBER_GRADIENTS.length];

  const baseName = canView && profile.username ? profile.username : 'Membre';
  const initial = (baseName.trim().charAt(0) || 'M').toUpperCase();

  const displayName =
    canView && profile.username
      ? `${profile.username}${profile.age ? `, ${profile.age}` : ''}`
      : 'Membre';
  const displayCity = canView ? profile.city : 'Ville masquée';

  const showPhoto = canView && Boolean(profile.profile_picture_url);
  const interests = (profile.interests ?? []).slice(0, 3);

  const media = (
    <div
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden"
      style={showPhoto ? undefined : { background: gradient }}
    >
      {showPhoto ? (
        <Image
          src={profile.profile_picture_url as string}
          alt={profile.username ? `Photo de ${profile.username}` : 'Photo de profil'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <span aria-hidden="true" className="relative text-[44px] font-bold text-white/95">
          {initial}
        </span>
      )}

      {isNew && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-accent-foreground shadow-sm">
          Nouveau
        </span>
      )}

      {/* Bottom scrim + name/age + city (constant gradient). */}
      <div
        className="absolute inset-x-0 bottom-0 px-4 py-3.5 text-white"
        style={{ background: SCRIM }}
      >
        <span className="block text-[17px] font-bold leading-tight tracking-[-0.01em]">
          {displayName}
        </span>
        <span className="text-[12.5px] text-white/85">{displayCity}</span>
      </div>
    </div>
  );

  const footer = (
    <div className="px-4 py-3.5">
      <div className="flex min-h-[26px] flex-wrap gap-1.5">
        {interests.map((interest) => (
          <span
            key={interest.id}
            className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {interest.name}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center justify-between text-[13px] font-semibold text-primary">
        <span>{canView ? 'Voir le profil' : 'Inscription requise'}</span>
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </div>
    </div>
  );

  const card = (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
      {media}
      {footer}
    </article>
  );

  if (canView) {
    return (
      <Link
        href={`/rencontre-philippines/profil/${profile.user_id}`}
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {card}
      </Link>
    );
  }

  return <div className="group block">{card}</div>;
};

export default MemberCard;
