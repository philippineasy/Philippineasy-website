import type { FAQEntry } from '@/types/destinationItineraries';
import { FaqAccordion } from '@/components/sections';

interface FAQSectionProps {
  faq: FAQEntry[];
}

/**
 * Destination-itinerary FAQ. Thin adapter over the canvas <FaqAccordion>: same
 * data and same FAQPage schema as before, restyled to the shared pattern. The
 * caller still provides the outer padded section wrapper.
 */
export function FAQSection({ faq }: FAQSectionProps) {
  if (!faq || faq.length === 0) return null;

  return (
    <FaqAccordion
      eyebrow="Questions fréquentes"
      title="Vos questions, nos réponses"
      titleAccent="terrain"
      faqs={faq.map((entry) => ({ q: entry.question, a: entry.answer }))}
      withSchema
    />
  );
}
