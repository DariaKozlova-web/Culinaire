export interface Recipe {
  id: string;
  title: string;
  image?: File | null;
  category?: string;
  chefId: string;
  description: string;
  cookTime?: string;
  level?: "Easy" | "Medium" | "Advanced";
  cuisine: string;
  service?: string;
  tag: string;
}

export interface Ingredient {
  title: string;
  quantity: string;
  unit: string;
}

export interface Instruction {
  number: string;
  title: string;
  image?: File | null;
  description: string;
}