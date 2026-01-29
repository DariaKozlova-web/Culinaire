import { User } from "#models";
import type { profileInputSchema, profileSchema } from "#schemas";
import type { RequestHandler } from "express";
import type z4 from "zod/v4";

type ProfileReqBody = z4.infer<typeof profileInputSchema>;
type ProfileResBody = z4.infer<typeof profileSchema>;

export const getCurrentProfile: RequestHandler<ProfileResBody> = async (
  req,
  res,
) => {
  const userInDb = await User.findById(req.user?.id);
  if (!userInDb) throw new Error("User not found", { cause: 404 });
  res.json({ favorites: userInDb.favorites });
};

export const updateCurrentProfile: RequestHandler<
  ProfileResBody,
  ProfileReqBody
> = async (req, res) => {
  const userInDb = await User.findById(req.user?.id);
  if (!userInDb) throw new Error("User not found", { cause: 404 });
  userInDb.favorites = req.body.favorites;
  await userInDb.save();
  res.status(200).json({ favorites: userInDb.favorites! });
};
