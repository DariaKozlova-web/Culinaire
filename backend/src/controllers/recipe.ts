import { Recipe } from '#models';
import { deleteRecipeFolder } from '#utils';
import { type RequestHandler } from 'express';


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

// IMPORTANT: We prohibit changing the URL
// We extract the URL and ignore it, update the rest
  const { url: _ignoredUrl, ...safeBody } = body;

  // If the instructions arrived without images, leave the old links.
  const mergedInstructions = Array.isArray(safeBody.instructions)
    ? safeBody.instructions.map((step: any, i: number) => ({
        ...step,
        image: step.image ?? recipe.instructions?.[i]?.image ?? ''
      }))
    : recipe.instructions;

  recipe.set({
    ...safeBody,
    instructions: mergedInstructions
  });

  await recipe.save();
  res.json(recipe);
};


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

export const getRandomRecipes: RequestHandler = async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 3, 24));

  // 1) take random IDs
  const randomIds = await Recipe.aggregate([{ $sample: { size: limit } }, { $project: { _id: 1 } }]);

  const ids = randomIds.map((x: any) => x._id);

  // 2) get documents + populate
  const recipes = await Recipe.find({ _id: { $in: ids } })
    .populate('categoryId')
    .populate('chefId');

  // (optional) keep "random" order as in ids
  const map = new Map(recipes.map(r => [String(r._id), r]));
  const ordered = ids.map((id: any) => map.get(String(id))).filter(Boolean);

  res.json(ordered);
};
