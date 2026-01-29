import { z } from "zod/v4";
import { Types } from "mongoose";

export const profileInputSchema = z.strictObject({
  favorites: z
    .array(
      z.instanceof(Types.ObjectId, {
        message: "Each favorite recipe must be a valid ObjectId",
      }),
    )
    .optional(),
});

export const profileSchema = z.strictObject({
  ...profileInputSchema.shape,
});
