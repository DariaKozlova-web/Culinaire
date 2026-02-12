import { z } from 'zod/v4';
import { Types } from 'mongoose';
import { coerceString, parseJSONArray } from '#utils';

const objectIdFromForm = (label: string) =>
  z.preprocess(
    val => coerceString(val),
    z
      .string({ message: `${label} is required` })
      .min(1, `${label} is required`)
      .refine(s => Types.ObjectId.isValid(s), { message: `Invalid ${label}` })
      .transform(s => new Types.ObjectId(s))
  );

export const recipeInputSchema = z.object({
  title: z.preprocess(coerceString, z.string().min(1, 'Title is required')),
  // url: z.preprocess(coerceString, z.string().min(1, 'URL is required')),
  url: z.preprocess(
    v => {
      const s = coerceString(v);
      return typeof s === 'string' ? s.trim().toLowerCase() : s;
    },
    z
      .string()
      .min(1, 'URL is required')
      .refine(s => !/\s/.test(s), { message: 'Slug must not contain space' })
  ),
  description: z.preprocess(coerceString, z.string().min(1, 'Description is required')),

  categoryId: objectIdFromForm('Category'),
  chefId: objectIdFromForm('Chef'),

  totalTime: z.preprocess(coerceString, z.string().min(1, 'Total time is required')),
  level: z.preprocess(coerceString, z.string().min(1, 'Level is required')),
  cuisine: z.preprocess(coerceString, z.string().min(1, 'Cuisine is required')),
  service: z.preprocess(coerceString, z.string().min(1, 'Service is required')),

  ingredients: z.preprocess(
    parseJSONArray,
    z
      .array(
        z.object({
          title: z.string().min(1),
          quantity: z.string().min(1),
          unit: z.string().min(1)
        })
      )
      .min(1, 'At least one ingredient is required')
  ),

  instructions: z.preprocess(
    parseJSONArray,
    z
      .array(
        z.object({
          number: z.string().min(1),
          title: z.string().min(1),
          description: z.string().min(1),
          image: z.string().url().optional()
        })
      )
      .min(1, 'At least one instruction is required')
  ),

  image: z.string().url().optional()
});

// ✅ update: url optional
export const recipeUpdateSchema = recipeInputSchema.extend({
  url: z.preprocess(coerceString, z.string().min(1, 'URL is required')).optional()
});
