import { coerceString, parseJSONArray } from '#utils';
import { z } from 'zod/v4';

export const profileInputSchema = z.object({
  name: z
    .preprocess(coerceString, z.string('Name must be a string').min(1, 'Name is required'))
    .optional(),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .optional(),
  favorites: z.preprocess(parseJSONArray, z.array(z.string())).optional()
});
