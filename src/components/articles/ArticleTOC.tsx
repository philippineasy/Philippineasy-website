'use client';

import { useEffect, useState } from 'react';
import { generateSlug } from '@/lib/utils';
import type { EditorJSBlock } from '@/types';

type Props = {
  blocks: EditorJSBlock[];
};

// Sticky-left TOC with scroll-spy + mobile collapsible.
// Per Article.md spec: lg:sticky lg:top-32, mobile collapsible <details>.
export function ArticleTOC({ blocks }: Props) {
  const headers = blocks.filter(
    (b) => b.type === 'header' && (b.data.level === 2 || b.data.level === 3)
  );

  const items = headers.map((h) => ({
    slug: generateSlug(h.data.text || ''),
    text: (h.data.text || '').replace(/<[^>]*>?/gm, ''),
    isH3: h.data.level === 3,
  }));

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = items
      .map((it) => document.getElementById(it.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    // Track which sections are currently in the upper viewport band.
    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visibility.set(e.target.id, e.intersectionRatio);
          } else {
            visibility.delete(e.target.id);
          }
        }
        if (visibility.size === 0) return;
        // Pick the topmost visible target (smallest top in DOM order)
        let bestId: string | null = null;
        for (const it of items) {
          if (visibility.has(it.slug)) {
            bestId = it.slug;
            break;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile collapsible (sticky top under header) */}
      <details
        className="lg:hidden mb-8 group rounded-xl border border-border/60 bg-muted/40 overflow-hidden"
        aria-label="Sommaire mobile"
      >
        <summary className="flex items-center justify-between cursor-pointer list-none px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-foreground select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span>Dans ce guide</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul className="list-none p-0 m-0 px-5 pb-4 pt-1 space-y-1 max-h-[60vh] overflow-y-auto">
          {items.map((it) => (
            <li key={it.slug} className={it.isH3 ? 'pl-4' : ''}>
              <a
                href={`#${it.slug}`}
                className={[
                  'block py-1.5 text-[14px] transition-colors',
                  it.isH3 ? 'text-muted-foreground text-[13px]' : 'text-foreground font-medium',
                  activeId === it.slug ? 'text-accent' : 'hover:text-accent',
                ].join(' ')}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </details>

      {/* Desktop sticky-left */}
      <nav
        aria-label="Table des matières"
        className="hidden lg:block lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">
          Dans ce guide
        </span>
        <ul className="space-y-1.5 text-[14px] leading-snug list-none p-0 m-0">
          {items.map((it) => {
            const active = activeId === it.slug;
            return (
              <li key={it.slug} className={it.isH3 ? 'pl-4' : ''}>
                <a
                  href={`#${it.slug}`}
                  className={[
                    'group block py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm',
                    it.isH3
                      ? `text-[13px] ${active ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`
                      : `font-medium ${active ? 'text-accent' : 'text-foreground hover:text-accent'}`,
                  ].join(' ')}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className={[
                      'border-l-2 pl-3 -ml-px block transition-colors',
                      active
                        ? 'border-accent'
                        : 'border-transparent group-hover:border-accent',
                    ].join(' ')}
                  >
                    {it.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
