import { z } from 'zod/v4';

export const profileInputSchema = z.object({
  name: z.string('Name must be a string').min(1, 'Name is required'),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .nullable()
});
