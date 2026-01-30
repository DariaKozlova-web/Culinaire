import type { Chef } from "../types/chef";
import lecler from "../assets/images/Anna-Leclerc.png";
import moretti from "../assets/images/Luca-Moretti.png";
import weis from "../assets/images/Klara-Weiss.png";
import whitmore from "../assets/images/James-Whitmore.png";


export const chefsMock: Chef[] = [
  {
    id: "1",
    name: "Anna Leclerc",
    restaurant: {
      name: "Maison du Goût",
    },
    city: "Berlin",
    avatar: lecler,
  },
  {
    id: "2",
    name: "Luca Moretti",
    restaurant: {
      name: "Ristorante Aurelio",
    },
    city: "München",
    avatar: moretti,
  },
  {
    id: "3",
    name: "Klara Weiss",
    restaurant: {
      name: "Wald & Feuer",
    },
    city: "Hamburg",
    avatar: weis,
  },
  {
    id: "4",
    name: "James Whitmore",
    restaurant: {
      name: "The Iron Crown"
    },
    city: "Berlin",
    avatar: whitmore,
  },
];
