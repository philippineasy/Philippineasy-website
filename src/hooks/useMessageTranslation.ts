'use client';

import { useCallback, useState } from 'react';

export type TranslateTarget = 'fr' | 'en' | 'tl';

export interface TranslationResult {
  translation: string;
  detected: string | null;
}

export interface TranslateError {
  type: 'quota' | 'unavailable';
  limit?: number;
}

const LANGUAGE_LABELS: Record<string, string> = {
  fr: 'français',
  en: 'anglais',
  tl: 'tagalog',
  ceb: 'cebuano',
  es: 'espagnol',
  de: 'allemand',
  it: 'italien',
  pt: 'portugais',
  zh: 'chinois',
  ja: 'japonais',
  ko: 'coréen',
};

export const getLanguageLabel = (code: string | null): string => {
  if (!code) return 'l’original';
  return LANGUAGE_LABELS[code.toLowerCase()] || code.toUpperCase();
};

async function requestTranslation(text: string, target: TranslateTarget): Promise<TranslationResult> {
  let response: Response;
  try {
    response = await fetch('/api/dating/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target }),
    });
  } catch {
    const err: TranslateError = { type: 'unavailable' };
    throw err;
  }

  if (response.status === 429) {
    const data = await response.json().catch(() => ({}));
    const err: TranslateError = { type: 'quota', limit: typeof data?.limit === 'number' ? data.limit : undefined };
    throw err;
  }

  if (!response.ok) {
    const err: TranslateError = { type: 'unavailable' };
    throw err;
  }

  const data = await response.json().catch(() => null);
  if (!data || typeof data.translation !== 'string') {
    const err: TranslateError = { type: 'unavailable' };
    throw err;
  }

  return { translation: data.translation, detected: typeof data.detected === 'string' ? data.detected : null };
}

const isTranslateError = (value: unknown): value is TranslateError =>
  typeof value === 'object' && value !== null && 'type' in value;

/**
 * Cache + toggle state for inline message translations (received bubbles).
 * Keyed by message id: re-clicking "Traduire" on an already-fetched message
 * only toggles visibility — never re-fetches (no double calls).
 */
export const useMessageTranslation = () => {
  const [results, setResults] = useState<Record<number, TranslationResult>>({});
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [loadingMessageId, setLoadingMessageId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, TranslateError>>({});

  const toggleTranslation = useCallback(
    async (messageId: number, text: string) => {
      // Deja recupere : on toggle juste l'affichage, aucun nouvel appel.
      if (results[messageId]) {
        setVisible((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
        return;
      }

      setErrors((prev) => {
        if (!(messageId in prev)) return prev;
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      setLoadingMessageId(messageId);

      try {
        const result = await requestTranslation(text, 'fr');
        setResults((prev) => ({ ...prev, [messageId]: result }));
        setVisible((prev) => ({ ...prev, [messageId]: true }));
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          [messageId]: isTranslateError(err) ? err : { type: 'unavailable' },
        }));
      } finally {
        setLoadingMessageId(null);
      }
    },
    [results]
  );

  return {
    translations: results,
    visibleTranslations: visible,
    loadingMessageId,
    translationErrors: errors,
    toggleTranslation,
  };
};

/**
 * One-shot draft translation for the composer (EN / Tagalog chips). No
 * cache: every click re-translates whatever is currently in the textarea.
 */
export const useDraftTranslation = () => {
  const [translatingTo, setTranslatingTo] = useState<Exclude<TranslateTarget, 'fr'> | null>(null);
  const [draftError, setDraftError] = useState<TranslateError | null>(null);

  const translateDraft = useCallback(
    async (text: string, target: Exclude<TranslateTarget, 'fr'>): Promise<string | null> => {
      setDraftError(null);
      setTranslatingTo(target);
      try {
        const result = await requestTranslation(text, target);
        return result.translation;
      } catch (err) {
        setDraftError(isTranslateError(err) ? err : { type: 'unavailable' });
        return null;
      } finally {
        setTranslatingTo(null);
      }
    },
    []
  );

  return { translateDraft, translatingTo, draftError };
};
