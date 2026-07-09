import { createHash } from 'crypto';

/**
 * Secret du webhook Telegram, dérivé du bot token (sha256 → 48 hex).
 * Passé à setWebhook comme secret_token ; Telegram le renvoie dans le header
 * X-Telegram-Bot-Api-Secret-Token. Aucune variable d'environnement en plus.
 */
export function deriveWebhookSecret(botToken: string): string {
  return createHash('sha256').update(`pe-chat:${botToken}`).digest('hex').slice(0, 48);
}
