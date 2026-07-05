import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'ai_business_growth_operating_system_default_secret_key',
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'openrouter',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  OPENROUTER_MAX_TOKENS: Number(process.env.OPENROUTER_MAX_TOKENS || 2048),
  OPENROUTER_TEMPERATURE: Number(process.env.OPENROUTER_TEMPERATURE || 0.7),
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'gemma4:latest',
  OLLAMA_TIMEOUT: Number(process.env.OLLAMA_TIMEOUT || 120000)
};

// Simple diagnostic check on initialization
if (!config.DATABASE_URL) {
  console.warn('[CONFIG WARNING] DATABASE_URL is not set. Database operations will fail.');
}
console.log(`[CONFIG] AI growth operating system is configured using provider: ${config.LLM_PROVIDER.toUpperCase()}`);
if (config.LLM_PROVIDER === 'openrouter') {
  console.log(`[CONFIG] OpenRouter settings: Model=${config.OPENROUTER_MODEL}, MaxTokens=${config.OPENROUTER_MAX_TOKENS}, Temperature=${config.OPENROUTER_TEMPERATURE}`);
} else {
  console.log(`[CONFIG] Ollama settings: Model=${config.OLLAMA_MODEL}, Timeout=${config.OLLAMA_TIMEOUT}ms`);
}
