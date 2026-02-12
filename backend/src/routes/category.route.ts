import { Router } from 'express';
import {
  validateBodyZod,
  categoryFormMiddleware,
  cloudUploaderCategory,
  isAdmin,
  authenticate
} from '#middlewares';
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

categoryRouter
  .route('/')
  .get(getAllCategories)
  .post(
    authenticate,
    isAdmin,
    categoryFormMiddleware,
    cloudUploaderCategory,
    validateBodyZod(categoryInputSchema),
    createCategory
  );

categoryRouter.get('/random', getRandomCategories);

categoryRouter
  .route('/:id')
  .get(getCategoryById)
  .put(
    authenticate,
    isAdmin,
    categoryFormMiddleware,
    cloudUploaderCategory,
    validateBodyZod(categoryUpdateSchema),
    updateCategoryById
  )
  .delete(authenticate, isAdmin, deleteCategoryById);

export default categoryRouter;
