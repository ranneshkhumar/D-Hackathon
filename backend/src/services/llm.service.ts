import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

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
  private static providers: Array<{
    index: number;
    apiKey: string;
    client: GoogleGenerativeAI;
    health: ProviderHealth;
  }> = (() => {
    if (!config.GEMINI_API_KEY) return [];
    const keys = config.GEMINI_API_KEY.split(',').map(k => k.trim()).filter(Boolean);
    console.log(`[LLMService] Initializing health manager for ${keys.length} API key client(s).`);
    return keys.map((key, index) => {
      const masked = key.length > 12 
        ? `${key.substring(0, 8)}...${key.substring(key.length - 6)}`
        : '***';
      return {
        index,
        apiKey: key,
        client: new GoogleGenerativeAI(key),
        health: {
          index,
          apiKeyMasked: masked,
          status: 'ACTIVE',
          lastSuccess: null,
          retryAfter: null,
          failureCount: 0,
          lastError: null
        }
      };
    });
  })();

  private static clientIndex = 0;

  /**
   * Exposes detailed health indicators for all configured providers.
   */
  static getProvidersHealth(): ProviderHealth[] {
    return this.providers.map(p => ({ ...p.health }));
  }

  /**
   * Selection algorithm that filters for active providers and rotates indices.
   */
  private static getClient(): { client: GoogleGenerativeAI; index: number } | null {
    const total = this.providers.length;
    if (total === 0) return null;

    const now = new Date();

    // Reset rate-limited or exhausted providers if the cooling timer has elapsed
    for (const p of this.providers) {
      if ((p.health.status === 'RATE_LIMITED' || p.health.status === 'EXHAUSTED') && p.health.retryAfter && now >= p.health.retryAfter) {
        console.log(`[LLMService] Cooling window elapsed for provider index ${p.index}. Resetting to ACTIVE.`);
        p.health.status = 'ACTIVE';
        p.health.retryAfter = null;
      }
    }

    // Find the next available ACTIVE provider
    for (let i = 0; i < total; i++) {
      const idx = (this.clientIndex + i) % total;
      const provider = this.providers[idx];

      if (provider.health.status === 'ACTIVE') {
        this.clientIndex = (idx + 1) % total;
        return { client: provider.client, index: idx };
      }
    }

    console.warn('[LLMService] No active LLM providers are available. Redirecting to Sandbox fallback mode.');
    return null;
  }

  /**
   * Updates state flags on successful prompt execution.
   */
  private static handleSuccess(index: number) {
    const provider = this.providers[index];
    if (provider) {
      provider.health.status = 'ACTIVE';
      provider.health.lastSuccess = new Date();
      provider.health.lastError = null;
      provider.health.failureCount = 0;
    }
  }

  /**
   * Analyzes error messages to classify invalid keys, rate limits, and day/project exhaustion.
   */
  private static handleFailure(index: number, error: any) {
    const provider = this.providers[index];
    if (!provider) return;

    provider.health.failureCount += 1;
    const errorStr = error instanceof Error ? error.message : String(error);
    provider.health.lastError = errorStr;

    // 1. Detect invalid API key or authentication/IP block failure
    const isAuthError = 
      errorStr.includes('API key not valid') || 
      errorStr.includes('API key blocked') || 
      errorStr.includes('API_KEY_INVALID') || 
      errorStr.includes('unauthorized') || 
      errorStr.includes('key is invalid') ||
      error?.status === 400 || 
      error?.status === 401 || 
      error?.status === 403;

    if (isAuthError) {
      provider.health.status = 'INVALID';
      provider.health.retryAfter = null;
      console.error(`[LLMService] Provider index ${index} marked as INVALID due to auth error: ${errorStr}`);
      return;
    }

    // 2. Detect rate limit (429) conditions
    const isRateLimit = errorStr.includes('429') || error?.status === 429;
    if (isRateLimit) {
      const isDailyExhaustion = 
        errorStr.includes('quota exceeded') || 
        errorStr.includes('limit: 0') || 
        errorStr.includes('exhausted') || 
        errorStr.includes('daily');

      const now = new Date();
      if (isDailyExhaustion) {
        // Daily or project quota exhausted: suspend provider for 24 hours
        provider.health.status = 'EXHAUSTED';
        provider.health.retryAfter = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        console.error(`[LLMService] Provider index ${index} marked as EXHAUSTED. Locked until: ${provider.health.retryAfter.toISOString()}`);
      } else {
        // Per-minute rate limit hit: cool down for 60 seconds
        provider.health.status = 'RATE_LIMITED';
        provider.health.retryAfter = new Date(now.getTime() + 60 * 1000);
        console.warn(`[LLMService] Provider index ${index} marked as RATE_LIMITED. Locked until: ${provider.health.retryAfter.toISOString()}`);
      }
    }
  }

  /**
   * General text completion service wrapping Gemini with provider health routing
   */
  static async ask(prompt: string, systemInstruction?: string): Promise<string | null> {
    const providerInfo = this.getClient();
    if (!providerInfo) {
      return null;
    }

    const { client, index } = providerInfo;
    console.log(`[LLMService] ask() routing to client index: ${index}`);

    try {
      const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      this.handleSuccess(index);
      return text;
    } catch (error) {
      this.handleFailure(index, error);
      // Recursively fall back to the next eligible client
      return this.ask(prompt, systemInstruction);
    }
  }

  /**
   * JSON generation wrapper for structured agent findings with provider health routing
   */
  static async askJson<T>(prompt: string, systemInstruction?: string): Promise<T | null> {
    const providerInfo = this.getClient();
    if (!providerInfo) {
      return null;
    }

    const { client, index } = providerInfo;
    console.log(`[LLMService] askJson() routing to client index: ${index}`);

    try {
      const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      this.handleSuccess(index);
      return JSON.parse(text) as T;
    } catch (error) {
      this.handleFailure(index, error);
      // Recursively fall back to the next eligible client
      return this.askJson<T>(prompt, systemInstruction);
    }
  }
}
