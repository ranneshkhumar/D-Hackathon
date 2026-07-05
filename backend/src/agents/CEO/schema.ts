import { z } from 'zod';

export const ceoAgentOutputSchema = z.object({
  summary: z.string(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
