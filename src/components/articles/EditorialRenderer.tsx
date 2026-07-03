import React from 'react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import { generateSlug } from '@/lib/utils';

const sanitize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'iframe', 'mark', 'del', 'ins', 'sup', 'sub',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'frameborder', 'allow', 'allowfullscreen', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

interface Block {
  type: string;
  data: any;
}

type Props = {
  content: { blocks: Block[]; time?: number; version?: string };
  /** Titre de l'article, utilisé pour construire un alt de secours sur les
   * images sans légende (ex. "Illustration — Visa Philippines"). Optionnel :
   * si absent, on retombe sur un alt générique 'Illustration'. */
  articleTitle?: string;
};

// Retire la convention **accent** utilisée dans les titres (cf. ArticleHero)
// avant de la réutiliser en texte brut pour un attribut alt.
const stripTitleAccent = (title: string) => title.replace(/\*\*([^*]+)\*\*/g, '$1');

// Hash links inside paragraph/list HTML get the editorial link style.
// Bold / italic remain as-is.
const PARAGRAPH_PROSE = [
  '[&_a]:text-accent [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-accent/30 hover:[&_a]:decoration-accent',
  '[&_a]:transition-colors',
  '[&_b]:font-semibold [&_strong]:font-semibold',
  '[&_i]:italic [&_em]:italic',
  '[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.95em] [&_code]:font-mono',
].join(' ');

function H2({ id, html }: { id: string; html: string }) {
  return (
    <h2
      id={id}
      className={[
        'mt-16 first:mt-0 mb-6 scroll-mt-32',
        'text-[clamp(1.625rem,3.2vw,2.125rem)] font-bold tracking-[-0.02em] leading-[1.15] text-ink text-balance',
        PARAGRAPH_PROSE,
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}

function H3({ id, html }: { id: string; html: string }) {
  return (
    <h3
      id={id}
      className={[
        'mt-10 mb-4 text-[22px] font-semibold tracking-[-0.01em] leading-snug text-ink scroll-mt-32',
        PARAGRAPH_PROSE,
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}

function Paragraph({ html }: { html: string }) {
  return (
    <p
      className={['mb-5 text-[17px] leading-[1.7] text-foreground/90 text-pretty', PARAGRAPH_PROSE].join(' ')}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}

function UnorderedList({ items }: { items: any[] }) {
  return (
    <ul className="my-6 space-y-2.5 list-none p-0">
      {items.map((item, i) => {
        const content = typeof item === 'object' && item.content ? item.content : item;
        return (
          <li
            key={i}
            className={[
              'pl-7 relative text-[17px] leading-[1.65] text-foreground/90',
              PARAGRAPH_PROSE,
              "before:content-['✓'] before:absolute before:left-0 before:top-0 before:text-accent before:font-bold before:text-[15px] before:w-5 before:h-5 before:flex before:items-center before:justify-center before:rounded-full before:bg-accent/12",
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: sanitize(content) }}
          />
        );
      })}
    </ul>
  );
}

function OrderedList({ items }: { items: any[] }) {
  return (
    <ol className="my-6 space-y-2.5 list-none p-0 counter-reset-list">
      {items.map((item, i) => {
        const content = typeof item === 'object' && item.content ? item.content : item;
        return (
          <li
            key={i}
            className={[
              'pl-9 relative text-[17px] leading-[1.65] text-foreground/90',
              PARAGRAPH_PROSE,
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/12 text-accent text-[12px] font-bold tabular-nums"
            >
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: sanitize(content) }} />
          </li>
        );
      })}
    </ol>
  );
}

function Quote({ text, caption }: { text: string; caption?: string }) {
  return (
    <blockquote className="my-8 rounded-r-2xl border-l-4 border-accent bg-accent/5 px-6 py-5">
      <div
        className={['text-[19px] leading-[1.55] text-ink italic font-medium', PARAGRAPH_PROSE].join(' ')}
        dangerouslySetInnerHTML={{ __html: sanitize(text) }}
      />
      {caption && (
        <cite className="mt-3 block text-[13px] uppercase tracking-[0.08em] text-muted-foreground not-italic">
          — {caption}
        </cite>
      )}
    </blockquote>
  );
}

function Table({ rows, withHeadings = true }: { rows: string[][]; withHeadings?: boolean }) {
  if (!rows || rows.length === 0) return null;
  const [headRow, ...bodyRows] = withHeadings ? rows : [null, ...rows];

  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full border-collapse text-[15px]">
        {headRow && (
          <thead>
            <tr className="bg-primary/5 border-b border-border/60">
              {headRow.map((cell, j) => (
                <th
                  key={j}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-ink text-[13px] uppercase tracking-[0.04em]"
                  dangerouslySetInnerHTML={{ __html: sanitize(cell) }}
                />
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, i) => (
            <tr
              key={i}
              className={[
                'border-b border-border/40 last:border-b-0',
                i % 2 === 1 ? 'bg-muted/30' : '',
              ].join(' ')}
            >
              {row!.map((cell, j) => (
                <td
                  key={j}
                  className={[
                    'px-4 py-3 align-top text-foreground/90',
                    PARAGRAPH_PROSE,
                  ].join(' ')}
                  dangerouslySetInnerHTML={{ __html: sanitize(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Delimiter() {
  return (
    <hr className="my-12 mx-auto w-24 border-0 border-t border-border/60" />
  );
}

function ImgBlock({
  url,
  caption,
  articleTitle,
}: {
  url: string;
  caption?: string;
  articleTitle?: string;
}) {
  const alt = caption || (articleTitle ? `Illustration — ${articleTitle}` : 'Illustration');
  return (
    <figure className="my-10">
      <div className="relative w-full rounded-[14px] overflow-hidden shadow-card-rest aspect-[16/10]">
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Embed({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-10">
      <div className="relative w-full rounded-[14px] overflow-hidden shadow-card-rest" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={caption || 'Vidéo intégrée'}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function EditorialRenderer({ content, articleTitle }: Props) {
  if (!content?.blocks) return null;

  const cleanArticleTitle = articleTitle ? stripTitleAccent(articleTitle) : undefined;

  return (
    <div className="editorial-content">
      {content.blocks.map((block: Block, idx: number) => {
        switch (block.type) {
          case 'header': {
            const text = block.data.text || '';
            const slug = generateSlug(text.replace(/<[^>]*>?/gm, ''));
            if (block.data.level === 2) {
              return <H2 key={idx} id={slug} html={text} />;
            }
            if (block.data.level === 3) return <H3 key={idx} id={slug} html={text} />;
            // Defensive : level 1 = H1 parasite (le seul H1 de la page doit etre
            // le titre de l'article via ArticleHero). On clamp tout level<=1 vers
            // H2 pour ne jamais emettre un 2e <h1> (audit SEO 2026-06-08 : article
            // investir avait 8 <h1> internes -> dilution topique + TOC casse).
            if (!block.data.level || block.data.level <= 1) {
              return <H2 key={idx} id={slug} html={text} />;
            }
            // h4/h5/h6 fallback
            const Tag = `h${block.data.level}` as 'h4' | 'h5' | 'h6';
            return (
              <Tag
                key={idx}
                id={slug}
                className="mt-8 mb-3 text-[18px] font-semibold text-ink"
                dangerouslySetInnerHTML={{ __html: sanitize(text) }}
              />
            );
          }
          case 'paragraph':
            return <Paragraph key={idx} html={block.data.text || ''} />;
          case 'list': {
            const items = block.data.items || [];
            return block.data.style === 'ordered'
              ? <OrderedList key={idx} items={items} />
              : <UnorderedList key={idx} items={items} />;
          }
          case 'quote':
            return <Quote key={idx} text={block.data.text || ''} caption={block.data.caption} />;
          case 'table':
            return <Table key={idx} rows={block.data.content || []} withHeadings={block.data.withHeadings !== false} />;
          case 'delimiter':
            return <Delimiter key={idx} />;
          case 'image':
            return (
              <ImgBlock
                key={idx}
                url={block.data.file?.url || ''}
                caption={block.data.caption}
                articleTitle={cleanArticleTitle}
              />
            );
          case 'embed':
            return <Embed key={idx} src={block.data.embed || ''} caption={block.data.caption} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
