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
  authenticate,
  isAdmin
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
    authenticate,
    isAdmin,
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
    authenticate,
    isAdmin,
    recipeFormMiddleware,
    validateBodyZod(recipeUpdateSchema),
    cloudUploaderRecipe,
    updateRecipeById
  )
  .delete(authenticate, isAdmin, deleteRecipeById);

export default recipeRouter;
