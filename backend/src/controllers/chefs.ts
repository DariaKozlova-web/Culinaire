import { Chef } from '#models';
import { chefInputSchema, chefSchema } from '#schemas';
import { type RequestHandler } from 'express';
import { z } from 'zod/v4';

type chefInputDTO = z.infer<typeof chefInputSchema>;
type chefDTO = z.infer<typeof chefSchema>;

export const getAllChefs: RequestHandler<{}, chefDTO[]> = async (req, res) => {
  const chefs = await Chef.find().sort({ createdAt: -1 });
  res.json(chefs);
};

export const createChef: RequestHandler<{}, chefDTO, chefInputDTO> = async (req, res) => {
  const { name, url, image, description, signature, restaurant } = req.body;

  const chef = await Chef.create({
    name,
    url,
    image,
    description,
    signature,
    restaurant
  });

  res.status(201).json(chef);
};

export const getChefById: RequestHandler<{ id: string }, chefDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const chef = await Chef.findById(id);
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  res.json(chef);
};

export const updateChefById: RequestHandler<{ id: string }, chefDTO, chefInputDTO> = async (
  req,
  res
) => {
  const {
    params: { id },
    body
  } = req;
  const { name, url, image, description, signature, restaurant } = body;

  const chef = await Chef.findById(id);
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  chef.name = name;
  chef.url = url;
  chef.image = image;
  chef.description = description;
  chef.signature = signature;
  chef.restaurant = restaurant;
  await chef.save();

  res.json(chef);
};

export const deleteChefById: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const chef = await Chef.findByIdAndDelete(id);
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  res.json({ message: 'Chef deleted' });
};
