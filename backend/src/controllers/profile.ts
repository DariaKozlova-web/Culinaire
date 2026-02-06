import { User } from '#models';
import type { meSchema, profileInputSchema } from '#schemas';
import { type RequestHandler } from 'express';
import type { z } from 'zod/v4';

type ProfileInputDTO = z.infer<typeof profileInputSchema>;
type ProfileDTO = z.infer<typeof meSchema>;

export const updateProfile: RequestHandler<{}, ProfileDTO, ProfileInputDTO> = async (req, res) => {
  const { id } = req.user!;
  const { name, image } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { name, image },
    { new: true, runValidators: true }
  ).lean();
  if (!user) throw new Error('User not found', { cause: { status: 404 } });
  res.status(200).json(user);
};
