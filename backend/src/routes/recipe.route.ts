import { Router } from 'express';
import {
  createRecipe,
  deleteRecipeById,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  getRandomRecipes,
  getRecipeBySlug,
  getFavoriteRecipes,
  getShoplistById
} from '#controllers';
import {
  recipeFormMiddleware,
  cloudUploaderRecipe,
  validateBodyZod,
  authenticate
} from '#middlewares';
import { recipeInputSchema, recipeUpdateSchema } from '#schemas';

const recipeRouter = Router();

recipeRouter.get('/random', getRandomRecipes);

recipeRouter.get('/favorites', authenticate, getFavoriteRecipes);

recipeRouter.get('/:id/pdf', getShoplistById);

recipeRouter
  .route('/')
  .get(getAllRecipes)
  .post(
    recipeFormMiddleware,
    validateBodyZod(recipeInputSchema),
    cloudUploaderRecipe,
    createRecipe
  );

recipeRouter.route('/slug/:slug').get(getRecipeBySlug);

recipeRouter
  .route('/:id')
  .get(getRecipeById)
  .put(
    recipeFormMiddleware,
    validateBodyZod(recipeUpdateSchema),
    cloudUploaderRecipe,
    updateRecipeById
  )
  .delete(deleteRecipeById);

export default recipeRouter;
