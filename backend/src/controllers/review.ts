import { Review, User } from '#models';
import type { ReviewInputSchema, ReviewOutputSchema } from '#schemas';
import type { RequestHandler } from 'express';
import type { Document, Types } from 'mongoose';
import type { z } from 'zod/v4';

type ReviewInputDTO = z.infer<typeof ReviewInputSchema>;
type ReviewOutputDTO = z.infer<typeof ReviewOutputSchema>;

export const createReview: RequestHandler<
  { recipeId: string },
  ReviewOutputDTO,
  ReviewInputDTO
> = async (req, res) => {
  const { recipeId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.id;

  const newReview = await Review.create({
    userId,
    recipeId,
    rating,
    comment
  });

  const outReview = await addAuthorData(userId, newReview);

  res.status(201).json(outReview);
};

export const getReviews: RequestHandler<{ recipeId: string }, ReviewOutputDTO[]> = async (
  req,
  res
) => {
  const { recipeId } = req.params;
  const reviews = await Review.find({ recipeId });

  const outReviews = await Promise.all(
    reviews.map(review => addAuthorData(review.userId.toString(), review))
  );
  res.json(outReviews);
};

async function addAuthorData(
  userId: string,
  newReview: Document<
    unknown,
    {},
    { createdAt: NativeDate } & {
      rating: number;
      comment: string;
      recipeId: Types.ObjectId;
      userId: Types.ObjectId;
    },
    {}
  > & { createdAt: NativeDate } & {
    rating: number;
    comment: string;
    recipeId: Types.ObjectId;
    userId: Types.ObjectId;
  } & { _id: Types.ObjectId } & { __v: number }
) {
  const user = await User.findById(userId).select(['name', 'image']).lean();

  const outReview = {
    ...newReview,
    author: user!.name,
    avatarUrl: user!.image
  };
  return outReview;
}
