import { Router } from 'express';
import { validateBodyZod } from '#middlewares';
import {
  createChef,
  deleteChefById,
  getAllChefs,
  getChefById,
  updateChefById,
  getChefByURL,
  getRandomChefs
} from '#controllers';
import { chefInputSchema } from '#schemas';

const chefRouter = Router();

chefRouter.route('/').get(getAllChefs).post(validateBodyZod(chefInputSchema), createChef);

chefRouter.get('/random', getRandomChefs);

chefRouter.route('/url/:url').get(getChefByURL);

chefRouter
  .route('/:id')
  .get(getChefById)
  .put(validateBodyZod(chefInputSchema), updateChefById)
  .delete(deleteChefById);

export default chefRouter;
