import { Router } from 'express';
import { validateBodyZod, categoryFormMiddleware, cloudUploaderCategory } from '#middlewares';
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
  .post(
    categoryFormMiddleware,
    cloudUploaderCategory,
    validateBodyZod(categoryInputSchema),
    createCategory
  );

categoryRouter
  .route('/:id')
  .get(getCategoryById)
  .put(
    categoryFormMiddleware,
    cloudUploaderCategory,
    validateBodyZod(categoryInputSchema),
    updateCategoryById
  )
  .delete(deleteCategoryById);

export default categoryRouter;
