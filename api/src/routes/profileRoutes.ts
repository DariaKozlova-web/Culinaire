import { getCurrentProfile, updateCurrentProfile } from "#controllers";
import { authenticate, validateZod } from "#middlewares";
import { profileInputSchema } from "#schemas";
import { Router } from "express";

const profileRoutes = Router();

profileRoutes
  .route("/")
  .get(getCurrentProfile)
  .put(validateZod(profileInputSchema), authenticate, updateCurrentProfile);

export default profileRoutes;
