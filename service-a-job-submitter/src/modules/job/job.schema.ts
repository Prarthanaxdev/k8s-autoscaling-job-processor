import { z } from 'zod';

export const jobSchema = z.object({
  type: z.number(),
  payload: z.object({
    name: z.string(),
  }),
});

export type JobData = z.infer<typeof jobSchema>;
