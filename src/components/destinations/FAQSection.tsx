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
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="text-2xl font-bold text-slate-900">Questions fréquentes</h2>
      <div className="mt-5 space-y-3">
        {faq.map((entry, idx) => (
          <details
            key={idx}
            className="group rounded-xl border border-slate-200 bg-white p-4 [&>summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-2 font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{entry.question}</span>
              <span className="text-xl text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-slate-700">{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
