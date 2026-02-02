import { Router } from 'express';
import { validateBodyZod } from '#middlewares';
import { createChef, deleteChefById, getAllChefs, getChefById, updateChefById } from '#controllers';
import { chefInputSchema } from '#schemas';

const chefRouter = Router();

chefRouter.route('/').get(getAllChefs).post(validateBodyZod(chefInputSchema), createChef);

chefRouter
  .route('/:id')
  .get(getChefById)
  .put(validateBodyZod(chefInputSchema), updateChefById)
  .delete(deleteChefById);

export default chefRouter;
