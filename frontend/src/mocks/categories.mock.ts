import meat from "../assets/images/meat-category.jpg";
import fish from "../assets/images/fish-category.jpg";
import desserts from "../assets/images/desserts-category.jpg";
import soup from "../assets/images/soup-category.jpg";

import type { Category } from "../types/category";

export const categoriesMock: Category[] = [
  {
    id: "meat",
    title: "Meat Dishes",
    image: meat,
  },
  {
    id: "fish",
    title: "Fish & Seafood",
    image: fish,
  },
  {
    id: "desserts",
    title: "Desserts",
    image: desserts,
  },
  {
    id: "soup",
    title: "Soup & Basics",
    image: soup,
  },
];