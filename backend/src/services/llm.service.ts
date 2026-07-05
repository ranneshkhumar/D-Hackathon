import { config } from '../config';
import ollama from 'ollama';

export interface ProviderHealth {
  index: number;
  apiKeyMasked: string;
  status: 'ACTIVE' | 'RATE_LIMITED' | 'EXHAUSTED' | 'INVALID';
  lastSuccess: Date | null;
  retryAfter: Date | null;
  failureCount: number;
  lastError: string | null;
}

export class LLMService {
  private static openRouterProvider: ProviderHealth = {
    index: 0,
    apiKeyMasked: config.OPENROUTER_API_KEY
      ? (config.OPENROUTER_API_KEY.length > 12
          ? `${config.OPENROUTER_API_KEY.slice(0, 8)}...${config.OPENROUTER_API_KEY.slice(-4)}`
          : 'CONFIGURED')
      : 'MISSING_KEY',
    status: 'ACTIVE',
    lastSuccess: null,
    retryAfter: null,
    failureCount: 0,
    lastError: null
  };

  private static ollamaProvider: ProviderHealth = {
    index: 1,
    apiKeyMasked: 'OLLAMA_LOCAL',
    status: 'ACTIVE',
    lastSuccess: null,
    retryAfter: null,
    failureCount: 0,
    lastError: null
  };

  /**
   * Exposes detailed health indicators for all configured providers.
   */
  static getProvidersHealth(): ProviderHealth[] {
    // Dynamically refresh masked key in case it was updated dynamically or recently loaded
    this.openRouterProvider.apiKeyMasked = config.OPENROUTER_API_KEY
      ? (config.OPENROUTER_API_KEY.length > 12
          ? `${config.OPENROUTER_API_KEY.slice(0, 8)}...${config.OPENROUTER_API_KEY.slice(-4)}`
          : 'CONFIGURED')
      : 'MISSING_KEY';
    return [
      { ...this.openRouterProvider },
      { ...this.ollamaProvider }
    ];
  }

  /**
   * Updates state flags on successful prompt execution.
   */
  private static updateSuccess(provider: 'openrouter' | 'ollama') {
    const p = provider === 'openrouter' ? this.openRouterProvider : this.ollamaProvider;
    p.status = 'ACTIVE';
    p.lastSuccess = new Date();
    p.lastError = null;
    p.failureCount = 0;
  }

  /**
   * Updates state flags on failure.
   */
  private static updateFailure(provider: 'openrouter' | 'ollama', error: any) {
    const p = provider === 'openrouter' ? this.openRouterProvider : this.ollamaProvider;
    p.failureCount += 1;
    p.status = 'INVALID';
    p.lastError = error instanceof Error ? error.message : String(error);
  }

  /**
   * General text completion service wrapping OpenRouter API or Ollama depending on configuration
   */
  static async ask(prompt: string, systemInstruction?: string): Promise<string | null> {
    const provider = config.LLM_PROVIDER === 'ollama' ? 'ollama' : 'openrouter';

    if (provider === 'openrouter') {
      console.log(`[LLMService] [OpenRouter] ask() routing to Model: ${config.OPENROUTER_MODEL}`);
      
      if (!config.OPENROUTER_API_KEY) {
        const errMsg = 'OPENROUTER_API_KEY is not configured in backend .env';
        console.warn(`[LLMService] [OpenRouter] ${errMsg}`);
        this.updateFailure('openrouter', new Error(errMsg));
        throw new Error(errMsg);
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://github.com/ranneshkhumar/D-Hackathon',
            'X-Title': 'Aegis OS'
          },
          body: JSON.stringify({
            model: config.OPENROUTER_MODEL,
            messages: [
              ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
              { role: 'user', content: prompt }
            ],
            max_tokens: config.OPENROUTER_MAX_TOKENS,
            temperature: config.OPENROUTER_TEMPERATURE
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText}`);
        }

        const data = await response.json() as any;
        const text = data.choices?.[0]?.message?.content || null;
        
        this.updateSuccess('openrouter');
        return text;
      } catch (error) {
        console.error('[LLMService] [OpenRouter] ask() failed:', error);
        this.updateFailure('openrouter', error);
        throw error;
      }
    } else {
      console.log(`[LLMService] [Ollama] ask() routing to Model: ${config.OLLAMA_MODEL}`);
      try {
        const ollamaPromise = ollama.chat({
          model: config.OLLAMA_MODEL,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ]
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Ollama request timed out after ${config.OLLAMA_TIMEOUT}ms`)), config.OLLAMA_TIMEOUT)
        );

        const response = await Promise.race([ollamaPromise, timeoutPromise]);
        const text = response.message.content;
        this.updateSuccess('ollama');
        return text;
      } catch (error) {
        console.error('[LLMService] [Ollama] ask() failed:', error);
        this.updateFailure('ollama', error);
        throw error;
      }
    }
  }

  /**
   * JSON generation wrapper for structured agent findings using OpenRouter or Ollama
   */
  static async askJson<T>(prompt: string, systemInstruction?: string): Promise<T | null> {
    const provider = config.LLM_PROVIDER === 'ollama' ? 'ollama' : 'openrouter';

    if (provider === 'openrouter') {
      console.log(`[LLMService] [OpenRouter] askJson() routing to Model: ${config.OPENROUTER_MODEL}`);

      if (!config.OPENROUTER_API_KEY) {
        const errMsg = 'OPENROUTER_API_KEY is not configured in backend .env';
        console.warn(`[LLMService] [OpenRouter] ${errMsg}`);
        this.updateFailure('openrouter', new Error(errMsg));
        throw new Error(errMsg);
      }

      try {
        // Append a JSON instruction to the system instruction to be safe
        const jsonSystemInstruction = `${systemInstruction || ''}\nYou must return a valid, parsable JSON object matching the requested schema. Do not output conversational text outside the JSON.`;
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://github.com/ranneshkhumar/D-Hackathon',
            'X-Title': 'Aegis OS'
          },
          body: JSON.stringify({
            model: config.OPENROUTER_MODEL,
            messages: [
              { role: 'system', content: jsonSystemInstruction },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: config.OPENROUTER_MAX_TOKENS,
            temperature: config.OPENROUTER_TEMPERATURE
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText}`);
        }

        const data = await response.json() as any;
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
          throw new Error('OpenRouter API returned an empty completion content.');
        }

        const parsed = this.cleanAndParseJson<T>(text);
        this.updateSuccess('openrouter');
        return parsed;
      } catch (error) {
        console.error('[LLMService] [OpenRouter] askJson() failed:', error);
        this.updateFailure('openrouter', error);
        throw error;
      }
    } else {
      console.log(`[LLMService] [Ollama] askJson() routing to Model: ${config.OLLAMA_MODEL}`);
      try {
        const ollamaPromise = ollama.chat({
          model: config.OLLAMA_MODEL,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ],
          format: 'json'
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Ollama request timed out after ${config.OLLAMA_TIMEOUT}ms`)), config.OLLAMA_TIMEOUT)
        );

        const response = await Promise.race([ollamaPromise, timeoutPromise]);
        const text = response.message.content;
        const parsed = this.cleanAndParseJson<T>(text);
        this.updateSuccess('ollama');
        return parsed;
      } catch (error) {
        console.error('[LLMService] [Ollama] askJson() failed:', error);
        this.updateFailure('ollama', error);
        throw error;
      }
    }
  }

  /**
   * Helper utility to scrub markdown backticks and parse the JSON string safely.
   */
  private static cleanAndParseJson<T>(text: string): T {
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      const match = cleanText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      if (match) {
        cleanText = match[1].trim();
      }
    }
    return JSON.parse(cleanText) as T;
  }
}
