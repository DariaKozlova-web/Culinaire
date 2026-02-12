import { Types } from 'mongoose';
import { z } from 'zod/v4';

export const ReviewInputSchema = z.object({
  recipeId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export const ReviewOutputSchema = z.object({
  author: z.string(),
  avatarUrl: z.string().nullable().optional(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.date()
});
