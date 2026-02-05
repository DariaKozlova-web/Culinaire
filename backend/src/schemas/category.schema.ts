import { z } from 'zod/v4';
import { Types } from 'mongoose';

const coerceString = (val: unknown) => (Array.isArray(val) ? val[0] : val);

const parseJSONArray = (val: unknown) => {
  const v = coerceString(val);
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

const objectIdFromForm = (label: string) =>
  z.preprocess(
    val => coerceString(val),
    z
      .string({ message: `${label} is required` })
      .min(1, `${label} is required`)
      .refine(s => Types.ObjectId.isValid(s), { message: `Invalid ${label}` })
      .transform(s => new Types.ObjectId(s))
  );

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
