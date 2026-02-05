import { updateProfile } from '#controllers';
import {
  authenticate,
  profileFormMiddleware,
  profileCloudUploader,
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
    profileCloudUploader,
    validateBodyZod(profileInputSchema),
    updateProfile
  );

export default profileRouter;
