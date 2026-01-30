import { Category } from '#models';
import { categoryInputSchema, categorySchema } from '#schemas';
import { type RequestHandler } from 'express';
import { z } from 'zod/v4';

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryDTO = z.infer<typeof categorySchema>;

export const getAllCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

export const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (
  req,
  res
) => {
  const { name, url, image } = req.body;

  const category = await Category.create({
    name: name,
    url: url,
    image: image
  });

  res.status(201).json(category);
};

export const getCategoryById: RequestHandler<{ id: string }, categoryDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });

  res.json(category);
};

export const updateCategoryById: RequestHandler<
  { id: string },
  categoryDTO,
  categoryInputDTO
> = async (req, res) => {
  const {
    params: { id },
    body
  } = req;
  const { name, url, image } = body;

  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });

  category.name = name;
  category.url = url;
  category.image = image;
  await category.save();

  res.json(category);
};

export const deleteCategoryById: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error('Category not found', { cause: 404 });

  res.json({ message: 'Category deleted' });
};
