import { z } from 'zod/v4';
import { Types } from 'mongoose';
import { coerceString, parseJSONArray } from '#utils';

export const chefInputSchema = z.object({
  name: z.preprocess(coerceString, z.string().min(1, 'Name is required')),
  url: z.preprocess(coerceString, z.string().min(1, 'URL is required')),
  city: z.preprocess(coerceString, z.string().min(1, 'City is required')),
  cuisine: z.preprocess(coerceString, z.string().min(1, 'Cuisine is required')),
  description: z.preprocess(coerceString, z.string().min(1, 'Description is required')),
  story: z.preprocess(
    parseJSONArray,
    z.array(z.string().min(1)).min(1, 'At least one ingredient is required')
  ),
  signature: z.preprocess(coerceString, z.string().min(1, 'Signature is required')),
  restaurant: z.preprocess(
    parseJSONArray,
    z.object({
      name: z.string().min(1),
      address: z.string().min(1),
      openingHours: z.string().min(1),
      closed: z.string().min(1)
    })
  ),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .optional()
});

// ✅ update: url optional
export const chefUpdateSchema = chefInputSchema.extend({
  url: z.preprocess(coerceString, z.string().min(1, 'URL is required')).optional()
});

export const chefSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...chefInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
