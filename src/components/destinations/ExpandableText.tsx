'use client';

import { useState, useRef, useLayoutEffect } from 'react';

interface ExpandableTextProps {
  text: string;
  /** Nombre de lignes max avant troncage (defaut 3) */
  lines?: number;
  /** Classe CSS supplementaire pour le texte */
  className?: string;
  /** Style inline pour le paragraphe (font-size, line-height, etc.) */
  style?: React.CSSProperties;
  /** Tag du conteneur texte (defaut p) */
  as?: 'p' | 'div';
}

/**
 * Tronque automatiquement un long texte avec un toggle "Voir plus / Réduire".
 *
 * - Si le texte tient en `lines` ou moins, aucun bouton n'apparait
 * - Sinon : line-clamp CSS jusqu'au clic sur le bouton
 * - useLayoutEffect mesure la hauteur reelle vs hauteur tronquee pour decider
 *
 * Utilise dans ItineraryDayCard pour eviter les "blocs a lire" denses :
 * activity.description + accommodation + meals quand ces strings sont longues.
 */
export function ExpandableText({
  text,
  lines = 3,
  className = '',
  style,
  as: Tag = 'p',
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    // Si la hauteur scroll > hauteur visible, c'est qu'il y a overflow
    setNeedsToggle(el.scrollHeight > el.clientHeight + 1);
  }, [text, lines]);

  const clampStyle: React.CSSProperties | undefined = expanded
    ? undefined
    : {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      };

  return (
    <>
      <Tag
        ref={textRef as React.RefObject<HTMLParagraphElement & HTMLDivElement>}
        className={className}
        style={{ ...style, ...clampStyle }}
      >
        {text}
      </Tag>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:underline"
          aria-expanded={expanded}
        >
          {expanded ? 'Réduire ↑' : 'Voir plus →'}
        </button>
      )}
    </>
  );
}
