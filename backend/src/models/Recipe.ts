import { Schema, model, Types } from 'mongoose';

export interface Instruction {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface Ingredient {
  title: string;
  quantity: string;
  unit: string;
}

export interface RecipeDocument {
  title: string;
  url: string;
  image: string;
  categoryId: Types.ObjectId;
  chefId: Types.ObjectId;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  totalTime: string;
  level: string;
  cuisine: string;
  service: string;
}

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    image: { type: String, required: true },

    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    chefId: { type: Schema.Types.ObjectId, ref: 'Chef', required: true },

    description: { type: String, required: true },

    ingredients: [
      {
        title: String,
        quantity: String,
        unit: String
      }
    ],

    instructions: [
      {
        number: String,
        title: String,
        description: String,
        image: String
      }
    ],

    totalTime: String,
    level: String,
    cuisine: String,
    service: String
  },
  { timestamps: true }
);


export default model<RecipeDocument>('Recipe', recipeSchema)