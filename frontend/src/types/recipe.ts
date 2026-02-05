export interface Ingredient {
  title: string;
  quantity: string;
  unit: string;
}

export interface Instruction {
  number: string;
  title: string;
  image?: string;
  description: string;
}

export type PopulatedChef =
  | string
  | {
      _id: string;
      name?: string;
      url?: string;
      image?: string;
      city?: string;
      restaurant?: {
        name?: string;
        address?: string;
        openingHours?: string;
        closed?: string;
      };
    };

export type PopulatedCategory =
  | string
  | { _id: string; title?: string; name?: string; url?: string };

export interface Recipe {
  _id: string;
  title: string;
  url: string;

  image?: string; // URL Cloudinary

  categoryId: PopulatedCategory;
  chefId: PopulatedChef;

  description: string;

  ingredients: Ingredient[];
  instructions: Instruction[];

  totalTime?: string;
  level?: "Easy" | "Medium" | "Advanced";
  cuisine: string;
  service?: string;

  tag?: string;
}

// export interface Recipe {
//   _id: string;
//   title: string;
//   image?: File | null;
//   category?: string;
//   chefId: string;
//   description: string;
//   cookTime?: string;
//   level?: "Easy" | "Medium" | "Advanced";
//   cuisine: string;
//   service?: string;
//   tag: string;
// }
// export interface Recipe {
//   _id: string;
//   title: string;
//   image?: string;
//   categoryId?: string | { _id: string; title?: string; name?: string };
//   chefId: string | { _id: string; name?: string; url?: string; image?: string };
//   description: string;
//   totalTime?: string;
//   level?: "Easy" | "Medium" | "Advanced";
//   cuisine: string;
//   service?: string;

// }

// export interface Ingredient {
//   title: string;
//   quantity: string;
//   unit: string;
// }

// export interface Instruction {
//   number: string;
//   title: string;
//   image?: File | null;
//   description: string;
// }
