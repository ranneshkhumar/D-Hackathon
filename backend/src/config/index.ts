import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'ai_business_growth_operating_system_default_secret_key',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};

// Simple diagnostic check on initialization
if (!config.DATABASE_URL) {
  console.warn('[CONFIG WARNING] DATABASE_URL is not set. Database operations will fail.');
}
if (!config.GEMINI_API_KEY) {
  console.warn('[CONFIG WARNING] GEMINI_API_KEY is not set. AI agent requests will run in fallback demonstration mode.');
}
