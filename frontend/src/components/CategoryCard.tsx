import { NavLink } from "react-router";
import type { Category } from "../types/category";

interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  return (
    <NavLink
      to={`/recipes?category=${category._id}`}
      className="
        group relative block h-80 w-65 overflow-hidden rounded-xl
      "
    >
      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="
          h-full w-full object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-(--bg-overlay-card)
          transition-opacity
          group-hover:opacity-70
        "
      />

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <h3 className="text-xl font-semibold text-(--text-title)">
          {category.name}
        </h3>
      </div>
    </NavLink>
  );
};

export default CategoryCard;