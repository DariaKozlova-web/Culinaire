import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const categoryInputSchema = z.object({
  name: z.string('Name must be a string').min(1, 'Name is required'),
  url: z.string('URL must be a string').min(1, 'URL is required'),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .default(
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    )
});

export const categorySchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...categoryInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
