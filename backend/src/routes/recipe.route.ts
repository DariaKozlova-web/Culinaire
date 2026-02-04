import { Router } from 'express';
import {
  createRecipe,
  deleteRecipeById,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  getRandomRecipes
} from '#controllers';
import {
  recipeFormMiddleware,
  cloudUploaderRecipe,
  validateBodyZod
} from '#middlewares';
import { recipeInputSchema } from '#schemas';

const recipeRouter = Router();

recipeRouter.get('/random', getRandomRecipes);

recipeRouter
  .route('/')
  .get(getAllRecipes)
  .post(
  recipeFormMiddleware,
  validateBodyZod(recipeInputSchema),
  cloudUploaderRecipe,
  createRecipe
);

recipeRouter
  .route('/:id')
  .get(getRecipeById)
  .put(recipeFormMiddleware, validateBodyZod(recipeInputSchema), cloudUploaderRecipe,  updateRecipeById)
  .delete(deleteRecipeById);

export default recipeRouter;