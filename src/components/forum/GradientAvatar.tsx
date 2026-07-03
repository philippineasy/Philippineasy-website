import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * GradientAvatar — member avatar with a signature-gradient + initial fallback.
 *
 * Replaces the old `ui-avatars.com?background=random` dependency across the
 * forum: no external request, no random colour flicker, and RGPD-friendly. When
 * a real `src` is provided it is shown (next/image, object-cover); otherwise a
 * deterministic brand gradient (picked from the name, so a member keeps the same
 * colour) carries the uppercase initial. Sizing / ring / shape come from the
 * caller via `className` so it drops into existing avatar slots unchanged.
 */

// Signature gradients — INTENTIONAL brand constants, identical in dark mode.
// Mirrors the palette used by the rencontre MemberCard (blue, teal, amber, violet).
const AVATAR_GRADIENTS = [
  'linear-gradient(160deg, #3B5BDB, #1e40af)', // blue
  'linear-gradient(160deg, #0F766E, #134E4A)', // teal
  'linear-gradient(160deg, #B45309, #92400E)', // amber-brown
  'linear-gradient(160deg, #6D28D9, #4C1D95)', // violet
] as const;

// Deterministic pick from the name so a given member always keeps their colour.
const pickGradient = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

interface GradientAvatarProps {
  src?: string | null;
  name?: string | null;
  /** Outer span sizing + shape, e.g. 'h-11 w-11 rounded-full ring-1 ring-border'. */
  className?: string;
  /** next/image `sizes` hint (match the rendered pixel size). */
  imgSizes?: string;
  /** Initial font size, e.g. 'text-[15px]'. */
  textClassName?: string;
}

export const GradientAvatar = ({
  src,
  name,
  className,
  imgSizes = '44px',
  textClassName = 'text-[15px]',
}: GradientAvatarProps) => {
  const label = (name ?? '').trim();
  const initial = (label.charAt(0) || '?').toUpperCase();
  const hasPhoto = Boolean(src);

  return (
    <span
      className={cn(
        'relative flex flex-shrink-0 items-center justify-center overflow-hidden',
        className
      )}
      style={hasPhoto ? undefined : { background: pickGradient(label || '?') }}
      aria-hidden="true"
    >
      {hasPhoto ? (
        <Image src={src as string} alt="" fill sizes={imgSizes} className="object-cover" />
      ) : (
        <span className={cn('font-bold leading-none text-white/95', textClassName)}>{initial}</span>
      )}
    </span>
  );
};

export default GradientAvatar;
