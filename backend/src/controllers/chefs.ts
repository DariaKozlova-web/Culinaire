import { Chef, Recipe } from '#models';
import { deleteChefFolder } from '#utils';
import { chefInputSchema, chefUpdateSchema, chefSchema, recipeInputSchema } from '#schemas';
import { type RequestHandler } from 'express';
import { z } from 'zod/v4';

type chefInputDTO = z.infer<typeof chefInputSchema>;
type chefUpdateDTO = z.infer<typeof chefUpdateSchema>;
type chefDTO = z.infer<typeof chefSchema>;
type RecipeDTO = z.infer<typeof recipeInputSchema>;

export const getAllChefs: RequestHandler<{}, chefDTO[]> = async (req, res) => {
  const chefs = await Chef.find().sort({ createdAt: -1 });
  res.json(chefs);
};

export const getChefById: RequestHandler<{ id: string }, chefDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const chef = await Chef.findById(id);
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  res.json(chef);
};

export const getRecipesByChefId: RequestHandler<{ id: string }, RecipeDTO[]> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const recipes = await Recipe.find({ chefId: id });

  if (!recipes || recipes.length === 0) {
    res.status(200).json([]);
    return;
  }

  res.json(recipes);
};

export const getRandomChefs: RequestHandler = async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 4, 24));
  const chefs = await Chef.aggregate([{ $sample: { size: limit } }]);
  res.json(chefs);
};

export const getChefByURL: RequestHandler<{ slug: string }, chefDTO> = async (req, res) => {
  const {
    params: { slug }
  } = req;

  const chef = await Chef.findOne({ url: slug });
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  res.json(chef);
};

export const createChef: RequestHandler<{}, chefDTO, chefInputDTO> = async (req, res) => {
  const chef = await Chef.create(req.body);
  res.status(201).json(chef);
};

export const updateChefById: RequestHandler<{ id: string }, chefDTO, chefUpdateDTO> = async (
  req,
  res
) => {
  const {
    params: { id },
    body
  } = req;

  const chef = await Chef.findById(id);
  if (!chef) throw new Error('Chef not found', { cause: 404 });

  const { url: _ignoredUrl, image, ...safeBody } = body;

  chef.set({
    ...safeBody
  });

  if (image) {
    chef.image = image;
  }

  await chef.save();

  res.json(chef);
};

export const deleteChefById: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const chef = await Chef.findById(id);

  if (!chef) {
    throw new Error('Chef not found', { cause: { status: 404 } });
  }

  const slug = chef.url;

  // 1) Removing from Mongo
  await Chef.findByIdAndDelete(id);

  // 2) Clean Cloudinary (don't interfere with deleting the category, even if Cloudinary crashes)
  try {
    await deleteChefFolder(slug);
  } catch (e) {
    console.error('Cloudinary cleanup failed:', e);
  }

  res.json({ message: 'Chef deleted' });
};
