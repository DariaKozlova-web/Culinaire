import { Category } from '#models';
import { deleteCategoryFolder } from '#utils';
import { categoryInputSchema, categoryUpdateSchema, categorySchema } from '#schemas';
import { type RequestHandler } from 'express';
import { z } from 'zod/v4';

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryUpdateDTO = z.infer<typeof categoryUpdateSchema>;
type categoryDTO = z.infer<typeof categorySchema>;

export const getAllCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

export const getCategoryById: RequestHandler<{ id: string }, categoryDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });

  res.json(category);
};

export const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (
  req,
  res
) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

export const updateCategoryById: RequestHandler<
  { id: string },
  categoryDTO,
  categoryUpdateDTO
> = async (req, res) => {
  const {
    params: { id },
    body
  } = req;

  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });

  const { url: _ignoredUrl, image, ...safeBody } = body;

  category.set({
    ...safeBody
  });

  if (image) {
    category.image = image;
  }

  await category.save();

  res.json(category);
};

export const deleteCategoryById: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const category = await Category.findById(id);

  if (!category) {
    throw new Error('Category not found', { cause: { status: 404 } });
  }

  const slug = category.url;

  // 1) Removing from Mongo
  await Category.findByIdAndDelete(id);

  // 2) Clean Cloudinary (don't interfere with deleting the category, even if Cloudinary crashes)
  try {
    await deleteCategoryFolder(slug);
  } catch (e) {
    console.error('Cloudinary cleanup failed:', e);
  }

  res.json({ message: 'Category deleted' });
};

export const getRandomCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 3, 24));

  // 1) take random IDs
  const randomIds = await Category.aggregate([
    { $sample: { size: limit } },
    { $project: { _id: 1 } }
  ]);

  const ids = randomIds.map((x: any) => x._id);

  // 2) get documents
  const categories = await Category.find({ _id: { $in: ids } });

  // (optional) keep "random" order as in ids
  const map = new Map(categories.map(r => [String(r._id), r]));
  const ordered = ids
    .map((id: any) => map.get(String(id)))
    .filter((item): item is NonNullable<typeof item> => !!item);

  res.json(ordered);
};
