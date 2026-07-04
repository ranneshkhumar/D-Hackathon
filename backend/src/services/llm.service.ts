import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

export class LLMService {
  private static genAI = config.GEMINI_API_KEY ? new GoogleGenerativeAI(config.GEMINI_API_KEY) : null;

  /**
   * General text completion service wrapping Gemini
   */
  static async ask(prompt: string, systemInstruction?: string): Promise<string> {
    console.log(`[LLMService] ask() called (API Key Configured: ${!!this.genAI})`);
    
    if (!this.genAI) {
      return `[LLM Fallback Response] Processed: ${prompt.substring(0, 50)}...`;
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        systemInstruction
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[LLMService] Error during call:', error);
      throw new Error(`LLM Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * JSON generation wrapper for structured agent findings
   */
  static async askJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
    console.log(`[LLMService] askJson() called (API Key Configured: ${!!this.genAI})`);
    
    if (!this.genAI) {
      return {} as T;
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('[LLMService] JSON Generation Error:', error);
      throw new Error(`LLM JSON Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
