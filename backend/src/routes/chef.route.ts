import { Router } from 'express';
import { validateBodyZod, chefFormMiddleware, cloudUploaderChef } from '#middlewares';
import {
  createChef,
  deleteChefById,
  getAllChefs,
  getChefById,
  updateChefById,
  getChefByURL,
  getRandomChefs,
  getRecipesByChefId
} from '#controllers';
import { chefInputSchema, chefUpdateSchema } from '#schemas';

const chefRouter = Router();

chefRouter
  .route('/')
  .get(getAllChefs)
  .post(chefFormMiddleware, cloudUploaderChef, validateBodyZod(chefInputSchema), createChef);

chefRouter.get('/random', getRandomChefs);

chefRouter.route('/slug/:slug').get(getChefByURL);

chefRouter.get('/:id/recipes', getRecipesByChefId);

chefRouter
  .route('/:id')
  .get(getChefById)
  .put(chefFormMiddleware, cloudUploaderChef, validateBodyZod(chefUpdateSchema), updateChefById)
  .delete(deleteChefById);

export default chefRouter;
