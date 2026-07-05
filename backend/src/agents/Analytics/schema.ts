import { z } from 'zod';

export const analyticsAgentOutputSchema = z.object({
  healthScore: z.number(),
  growthScore: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
