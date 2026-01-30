import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const categoryInputSchema = z.object({
  name: z.string('Title must be a string').min(1, 'Title is required'),
  url: z.string('URL must be a string').min(1, 'URL is required'),
  image: z.string('Image must be a string').min(1, 'Image is required')
});

export const categorySchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...categoryInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
