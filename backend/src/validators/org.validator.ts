import { z } from 'zod';

export const CreateOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  website: z.string().url('Invalid website URL format').optional().nullable(),
  industry: z.string().min(1, 'Industry is required')
});

export const AddMetricSchema = z.object({
  metricName: z.enum(['revenue', 'profit_margin', 'cac', 'ltv', 'churn_rate', 'conversion_rate']),
  value: z.number().nonnegative('Metric value must be a non-negative number'),
  period: z.enum(['monthly', 'quarterly', 'yearly']),
  timestamp: z.string().transform((str) => new Date(str))
});
