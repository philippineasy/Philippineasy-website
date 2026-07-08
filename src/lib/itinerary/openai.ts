// ---------------------------------------------------------------------------
// Client OpenAI minimal (fetch direct, pas de SDK) pour la génération
// d'itinéraires. JSON mode forcé + retry simple sur erreurs transitoires.
// ---------------------------------------------------------------------------

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

interface CallOptions {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Timeout du fetch en ms. */
  timeoutMs?: number;
}

interface OpenAIResult<T> {
  data: T;
  finishReason: string;
  outputTokens: number;
}

/**
 * Appelle OpenAI en JSON mode et parse la réponse.
 * Retry unique sur 429/5xx/réseau (backoff 2s). Throw OpenAIError sinon.
 */
export async function callOpenAIJson<T>(opts: CallOptions): Promise<OpenAIResult<T>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIError('OPENAI_API_KEY manquante — configurer la variable d\'environnement');
  }

  const body = JSON.stringify({
    model: opts.model || 'gpt-4.1',
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 16000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120_000);
      const res = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        // 429/5xx = transitoire, on retry. 4xx autre = définitif.
        if ((res.status === 429 || res.status >= 500) && attempt === 1) {
          lastError = new OpenAIError(`OpenAI ${res.status}: ${text.slice(0, 300)}`, res.status);
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        throw new OpenAIError(`OpenAI ${res.status}: ${text.slice(0, 300)}`, res.status);
      }

      const json = await res.json();
      const choice = json.choices?.[0];
      const content = choice?.message?.content;
      if (!content) throw new OpenAIError('Réponse OpenAI vide');

      let parsed: T;
      try {
        parsed = JSON.parse(content) as T;
      } catch {
        throw new OpenAIError('Réponse OpenAI non-JSON (probablement tronquée)');
      }

      return {
        data: parsed,
        finishReason: choice.finish_reason || 'unknown',
        outputTokens: json.usage?.completion_tokens ?? 0,
      };
    } catch (err) {
      if (err instanceof OpenAIError && err.status && err.status < 500 && err.status !== 429) throw err;
      lastError = err;
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new OpenAIError('Appel OpenAI échoué');
}
