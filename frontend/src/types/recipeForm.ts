export type RecipeLevel = "Easy" | "Medium" | "Advanced";

export type IngredientForm = {
  title: string;
  quantity: string;
  unit: string;
};

export type InstructionForm = {
  number: string;        // "1", "2", ...
  title: string;         // REQUIRED
  description: string;   // REQUIRED
  imageFile?: File | null; 
};

export type RecipeCreateForm = {
  title: string;
  url: string;
  categoryId: string;
  chefId: string;
  description: string;
  totalTime: string;
  level: RecipeLevel | "";
  cuisine: string;
  service: string;

  imageFile?: File | null;

  ingredients: IngredientForm[];
  instructions: InstructionForm[];
};