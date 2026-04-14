// ---------------------------------------------------------------------------
// Email service — backward-compatible wrapper
// Delegates to the new email system in src/emails/
// ---------------------------------------------------------------------------
import { sendItineraryReadyEmail } from '@/emails/senders/itinerary';

interface ItineraryEmailData {
  to: string;
  userName?: string;
  itineraryTitle: string;
  destination: string;
  days: number;
  variant: string;
  generationId: string;
  telegramMessage?: string;
}

export async function sendItineraryEmail(data: ItineraryEmailData) {
  return sendItineraryReadyEmail(data);
}
