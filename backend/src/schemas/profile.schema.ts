import { coerceString } from '#utils';
import { z } from 'zod/v4';

export const profileInputSchema = z.object({
  name: z.preprocess(coerceString, z.string('Name must be a string').min(1, 'Name is required')),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .optional()
});
