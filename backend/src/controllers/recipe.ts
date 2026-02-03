import { Recipe } from '#models';
import { recipeInputSchema } from '#schemas';
import { deleteRecipeFolder } from '#utils';
import { type RequestHandler } from 'express';
import { z } from 'zod/v4';

type RecipeInputDTO = z.infer<typeof recipeInputSchema>;

export const getAllRecipes: RequestHandler = async (_req, res) => {
  const recipes = await Recipe.find()
    .populate('categoryId')
    .populate('chefId')
    .sort({ createdAt: -1 });

  res.json(recipes);
};

export const getRecipeById: RequestHandler<{ id: string }> = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('categoryId').populate('chefId');

  if (!recipe) {
    throw new Error('Recipe not found', { cause: { status: 404 } });
  }

  res.json(recipe);
};

export const createRecipe: RequestHandler = async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.status(201).json(recipe);
};

export const updateRecipeById: RequestHandler<{ id: string }> = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw new Error('Recipe not found', { cause: { status: 404 } });

  const body = req.body as any;

  // If the instructions arrived without images, leave the old links.
  const mergedInstructions = Array.isArray(body.instructions)
    ? body.instructions.map((step: any, i: number) => ({
        ...step,
        image: step.image ?? recipe.instructions?.[i]?.image ?? ''
      }))
    : recipe.instructions;

  recipe.set({
    ...body,
    instructions: mergedInstructions
  });

  await recipe.save();
  res.json(recipe);
};


// export const deleteRecipeById: RequestHandler<{ id: string }> = async (req, res) => {
//   const recipe = await Recipe.findByIdAndDelete(req.params.id);

//   if (!recipe) {
//     throw new Error('Recipe not found', { cause: { status: 404 } });
//   }

//   res.json({ message: 'Recipe deleted' });
// };

export const deleteRecipeById: RequestHandler<{ id: string }> = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    throw new Error('Recipe not found', { cause: { status: 404 } });
  }

  const slug = recipe.url;

  // 1) Removing from Mongo
  await recipe.deleteOne();

  // 2) Clean Cloudinary (don't interfere with deleting the recipe, even if Cloudinary crashes)
  try {
    await deleteRecipeFolder(slug);
  } catch (e) {
    console.error('Cloudinary cleanup failed:', e);
  }

  res.json({ message: 'Recipe deleted' });
};
