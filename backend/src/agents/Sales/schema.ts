import { z } from 'zod';

export const salesAgentOutputSchema = z.object({
  closeRate: z.number(),
  salesCycleDays: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
