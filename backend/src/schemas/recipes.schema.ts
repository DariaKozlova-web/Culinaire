import { z } from "zod";

/* -------- Ingredients -------- */
export const ingredientSchema = z.object({
  title: z.string().min(1, "Ingredient title is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
});

/* -------- Cooking Steps -------- */
export const cookingStepSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1, "Step title is required"),
  description: z.string().min(1, "Step description is required"),
  image: z.string().optional(),
});

/* -------- Recipe -------- */
export const createRecipeSchema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  image: z.string().url("Invalid image URL").optional(),
  description: z.string().min(1, "Description is required"),

  categoryId: z.string().min(1, "Category is required"),
  chefId: z.string().min(1, "Chef is required"),

  totalTime: z.string().min(1, "Total time is required"),
  cuisine: z.string().min(1, "Cuisine is required"),
  difficulty: z.enum(["Easy", "Medium", "Advanced"]),
  servings: z.number().int().positive(),

  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient"),
  steps: z.array(cookingStepSchema).min(1, "At least one step"),
});

/* -------- Types -------- */
export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;