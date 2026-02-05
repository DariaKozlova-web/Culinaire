import { updateProfile } from '#controllers';
import {
  authenticate,
  cloudUploaderCategory,
  profileFormMiddleware,
  validateBodyZod
} from '#middlewares';
import { profileInputSchema } from '#schemas';
import { Router } from 'express';

const profileRouter = Router();

profileRouter
  .route('/')
  .put(
    authenticate,
    profileFormMiddleware,
    cloudUploaderCategory,
    validateBodyZod(profileInputSchema),
    updateProfile
  );

export default profileRouter;
