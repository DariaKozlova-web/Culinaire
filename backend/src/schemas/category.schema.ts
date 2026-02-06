import { z } from 'zod/v4';
import { Types } from 'mongoose';
import { coerceString } from '#utils';

export const categoryInputSchema = z.object({
  name: z.preprocess(coerceString, z.string().min(1, 'Name is required')),
  url: z.preprocess(coerceString, z.string().min(1, 'URL is required')),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .optional()
});

// ✅ update: url optional
export const categoryUpdateSchema = categoryInputSchema.extend({
  url: z.preprocess(coerceString, z.string().min(1, 'URL is required')).optional()
});

export const categorySchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...categoryInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
