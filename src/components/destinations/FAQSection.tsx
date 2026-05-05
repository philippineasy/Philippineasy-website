import type { FAQEntry } from '@/types/destinationItineraries';

interface FAQSectionProps {
  faq: FAQEntry[];
}

export function FAQSection({ faq }: FAQSectionProps) {
  if (!faq || faq.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <span
        className="block text-[12px] font-bold uppercase text-primary mb-2"
        style={{ letterSpacing: '0.10em' }}
      >
        ✦ Questions fréquentes
      </span>
      <h2
        id="faq-heading"
        className="text-ink font-semibold mb-6"
        style={{
          fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        Vos questions, nos réponses terrain
      </h2>

      <div className="space-y-2.5 max-w-3xl">
        {faq.map((entry, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="group rounded-2xl bg-card border-[0.5px] border-border overflow-hidden transition-all duration-200 hover:border-primary/30 open:border-primary/30 open:shadow-card-rest"
          >
            <summary
              className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
            >
              <span
                className="font-semibold text-ink flex-1 pr-2"
                style={{
                  fontSize: '15.5px',
                  letterSpacing: '-0.005em',
                  lineHeight: 1.4,
                }}
              >
                {entry.question}
              </span>
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-all duration-200 group-open:rotate-45 group-open:bg-primary group-open:text-white bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <div
              className="px-5 pb-5 -mt-1 text-[14.5px] text-muted-foreground"
              style={{ lineHeight: 1.65 }}
            >
              {entry.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
