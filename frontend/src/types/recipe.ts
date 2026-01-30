export interface Recipe {
  id: string;
  title: string;
  image: string;
  category?: string;
  chefId: string;
  description: string;
  cookTime?: string;
  level?: "Easy" | "Medium" | "Hard";
  cuisine: string;
  service?: string;
  tag: string;
}