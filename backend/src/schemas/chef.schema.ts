import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const chefInputSchema = z.object({
  name: z.string('Name must be a string').min(1, 'Name is required'),
  url: z.string('URL must be a string').min(1, 'URL is required'),
  image: z.string('Image must be a string').min(1, 'Image is required'),
  city: z.string('City must be a string').min(1, 'City is required'),
  cuisine: z.string('Cuisine must be a string').min(1, 'Cuisine is required'),
  description: z.string('Description must be a string').min(1, 'Description is required'),
  story: z
    .array(z.string().min(1, 'Each story entry must have text'))
    .min(1, 'Story must contain at least one entry'),
  signature: z.string('Signature must be a string').min(1, 'Signature is required'),
  restaurant: z.object({
    name: z.string('Restaurant name must be a string').min(1, 'Restaurant name is required'),
    address: z
      .string('Restaurant address must be a string')
      .min(1, 'Restaurant address is required'),
    openingHours: z
      .string('Opening hours time must be a string')
      .min(1, 'Opening hours address is required'),
    closed: z.string('Closed time must be a string').min(1, 'Closed time address is required')
  })
});

export const chefSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...chefInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
