import { z } from 'zod';

export const marketingAgentOutputSchema = z.object({
  channels: z.array(z.string()),
  cacEstimate: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
