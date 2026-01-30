import type { Recipe } from "../types/recipe";
import beefWellington from "../assets/images/beef-wellington-main.jpg";
import vichyssoise from "../assets/images/vichyssoise-main.jpg";
import pavlova from "../assets/images/pavlova-main.jpg";

export const recipesMock: Recipe[] = [
  {
    id: "1",
    title: "Beef Wellington",
    description:
      "A refined British classic with tender beef, mushrooms, and crisp puff pastry",
    image: beefWellington,
    chefId: "James Whitmore",
    cuisine: "British Cuisine",
    tag: "Classic",
  },
  {
    id: "2",
    title: "Vichyssoise",
    description:
      "Classic French chilled leek and potato soup with a smooth, creamy texture.",
    image: vichyssoise,
    chefId: "Klara Weiss",
    cuisine: "French Cuisine",
    tag: "Classic",
  },
  {
    id: "3",
    title: "Pavlova",
    description:
      "Light meringue dessert with crisp shell, soft center, and fresh fruit.",
    image: pavlova,
    chefId: "Klara Weiss",
    cuisine: "Australian Cuisine",
    tag: "Classic",
  },
];