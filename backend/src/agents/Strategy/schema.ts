import { z } from 'zod';

export const strategyAgentOutputSchema = z.object({
  primaryBottleneck: z.string(),
  secondaryBottleneck: z.string(),
  roadmap: z.array(z.string()),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number()
});
