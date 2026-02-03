import weis from "../assets/images/Klara-Weiss.png";
import moretti from "../assets/images/Luca-Moretti.png";
import lecler from "../assets/images/anna-leclerc.png";
import whitmore from "../assets/images/james-whitmore.png";
import type { Chef } from "../types/chef";

export const chefsMock: Chef[] = [
  {
    id: "1",
    name: "Anna Leclerc",
    restaurant: {
      name: "Maison du Goût",
    },
    city: "Berlin",
    avatar: lecler,
    url: "anna-leclerc",
  },
  {
    id: "2",
    name: "Luca Moretti",
    restaurant: {
      name: "Ristorante Aurelio",
    },
    city: "München",
    avatar: moretti,
    url: "luca-moretti",
  },
  {
    id: "3",
    name: "Klara Weiss",
    restaurant: {
      name: "Wald & Feuer",
    },
    city: "Hamburg",
    avatar: weis,
    url: "klara-weiss",
  },
  {
    id: "4",
    name: "James Whitmore",
    restaurant: {
      name: "The Iron Crown",
    },
    city: "Berlin",
    avatar: whitmore,
    url: "james-whitmore",
  },
];
