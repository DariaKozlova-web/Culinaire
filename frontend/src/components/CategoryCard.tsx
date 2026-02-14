import { cld } from "@/utils";
import { NavLink } from "react-router";

import type { Category } from "../types/category";

interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  const imgSrc =
    typeof category.image === "string" && category.image.trim()
      ? category.image
      : "https://placehold.co/600x800?text=No+image";

  return (
    <NavLink
      to={`/recipes?category=${category._id}`}
      className="group relative block w-full overflow-hidden rounded-2xl"
    >
      <div className="relative h-64 sm:h-72 lg:h-80">
        {/* Image */}
        <img
          src={cld(imgSrc, { w: 1000, mode: "limit" })}
          loading="lazy"
          decoding="async"
          alt={`Photo of ${category.name} category`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-(--bg-overlay-card) transition-opacity group-hover:opacity-70" />

        {/* Category badge */}
        <div className="absolute bottom-4 left-4">
          <span className="ui-badge">{category.name}</span>
        </div>
      </div>
    </NavLink>
  );
};

export default CategoryCard;
