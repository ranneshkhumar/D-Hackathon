import { z } from 'zod';

export const financeAgentOutputSchema = z.object({
  profitMargin: z.number(),
  burnRate: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
