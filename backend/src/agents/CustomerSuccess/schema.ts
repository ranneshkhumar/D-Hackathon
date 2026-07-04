import { z } from 'zod';

export const customerSuccessAgentOutputSchema = z.object({
  customerHealthScore: z.number(),
  npsScore: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
