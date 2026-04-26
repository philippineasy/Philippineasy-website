import { generateSlug } from '@/lib/utils';
import type { EditorJSBlock } from '@/types';

type Props = {
  blocks: EditorJSBlock[];
};

// Sticky-left TOC (per Article.md spec). On mobile, becomes a simple
// stacked list above the content. Numbering on H2s comes naturally
// from the editorial titles ("1. Pourquoi...") and shouldn't be
// duplicated by an <ol> counter, so we use <ul>.
export function ArticleTOC({ blocks }: Props) {
  const headers = blocks.filter(
    (b) => b.type === 'header' && (b.data.level === 2 || b.data.level === 3)
  );
  if (headers.length === 0) return null;

  return (
    <nav
      aria-label="Table des matières"
      className="lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2"
    >
      <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Dans ce guide
      </span>
      <ul className="space-y-1.5 text-[14px] leading-snug list-none p-0 m-0">
        {headers.map((h, i) => {
          const slug = generateSlug(h.data.text);
          const isH3 = h.data.level === 3;
          return (
            <li
              key={`${slug}-${i}`}
              className={isH3 ? 'pl-4' : ''}
            >
              <a
                href={`#${slug}`}
                className={[
                  'group block py-1 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm',
                  isH3
                    ? 'text-muted-foreground hover:text-accent text-[13px]'
                    : 'text-foreground hover:text-accent font-medium',
                ].join(' ')}
              >
                <span className="border-l-2 border-transparent group-hover:border-accent pl-3 -ml-px block transition-colors">
                  {h.data.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
