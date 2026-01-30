import { Router } from 'express';
import { validateBodyZod } from '#middlewares';
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById
} from '#controllers';
import { categoryInputSchema } from '#schemas';

const categoryRouter = Router();

categoryRouter
  .route('/')
  .get(getAllCategories)
  .post(validateBodyZod(categoryInputSchema), createCategory);

categoryRouter
  .route('/:id')
  .get(getCategoryById)
  .put(validateBodyZod(categoryInputSchema), updateCategoryById)
  .delete(deleteCategoryById);

export default categoryRouter;
