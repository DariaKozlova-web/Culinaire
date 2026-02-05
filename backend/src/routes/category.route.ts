import { Router } from 'express';
import { validateBodyZod, categoryFormMiddleware, cloudUploaderCategory } from '#middlewares';
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  getRandomCategories
} from '#controllers';
import { categoryInputSchema, categoryUpdateSchema } from '#schemas';

const categoryRouter = Router();

categoryRouter.get('/random', getRandomCategories);

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
    validateBodyZod(categoryUpdateSchema),
    updateCategoryById
  )
  .delete(deleteCategoryById);

export default categoryRouter;
