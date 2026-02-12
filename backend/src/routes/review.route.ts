import { createReview, getReviews } from '#controllers';
import { authenticate, validateBodyZod } from '#middlewares';
import { ReviewInputSchema } from '#schemas';
import { Router } from 'express';

const reviewRouter = Router();

reviewRouter
  .route('/:recipeId')
  .post(authenticate, validateBodyZod(ReviewInputSchema), createReview)
  .get(getReviews);

export default reviewRouter;
