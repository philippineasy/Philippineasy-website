import FAQSchema from '@/components/shared/FAQSchema';
import { cn } from '@/lib/utils';

/**
 * FaqAccordion — editorial FAQ section from the validated design canvas.
 *
 * A centred 760px column: eyebrow + accented H2, then a hairline-separated list
 * of native <details>/<summary> accordions (no JS), an optional muted footnote,
 * and an optional FAQPage JSON-LD (reuses <FAQSchema> so the schema logic is
 * never duplicated). Token-driven and dark-mode ready.
 *
 * When `withSchema` is used, this component emits the FAQPage schema itself — so
 * the SAME `faqs` list feeds both the visible accordion and the structured data.
 * Never render this with `withSchema` AND a standalone <FAQSchema> on one page.
 */

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  faqs: FaqItem[];
  footnote?: string;
  withSchema?: boolean;
  className?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'faq';

export const FaqAccordion = ({
  eyebrow,
  title,
  titleAccent,
  faqs,
  footnote,
  withSchema = false,
  className,
}: FaqAccordionProps) => {
  if (!faqs || faqs.length === 0) return null;

  const headingId = `faq-${slugify(titleAccent ? `${title}-${titleAccent}` : title)}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn('mx-auto w-full max-w-[760px] px-4', className)}
    >
      {withSchema && (
        <FAQSchema faqs={faqs.map((item) => ({ question: item.q, answer: item.a }))} />
      )}

      {/* Header — eyebrow + accented display heading (.pe-h2) */}
      <div className="text-center">
        {eyebrow && (
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h2
          id={headingId}
          className="mt-3 text-[clamp(1.625rem,3vw,2.125rem)] font-bold text-foreground"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          {title}
          {titleAccent && (
            <>
              {' '}
              {/* Signature amber accent word — matches the CardGrid / CTABand
                  section headings elsewhere on the page. */}
              <span className="text-accent">{titleAccent}</span>
            </>
          )}
        </h2>
      </div>

      {/* List — hairline top rule, then each item bounded by a hairline bottom */}
      <div className="mt-9 border-t-[0.5px] border-border">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="group border-b-[0.5px] border-border"
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-1 py-4 text-[15px] font-semibold text-foreground transition-colors marker:hidden [&::-webkit-details-marker]:hidden hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <span>{item.q}</span>
              {/* Discreet chevron — rotates 180° on open, no JS */}
              <svg
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180 motion-reduce:transition-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p
              className="pl-5 pr-1 pt-0 pb-[18px] text-[14.5px] text-muted-foreground"
              style={{ lineHeight: 1.65 }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>

      {footnote && (
        <p className="mt-6 text-center text-[13px] leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      )}
    </section>
  );
};
