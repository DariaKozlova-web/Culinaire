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
          src={imgSrc}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-(--bg-overlay-card) transition-opacity group-hover:opacity-70" />

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h3 className="text-center text-xl font-semibold text-(--text-title) md:text-2xl">
            {category.name}
          </h3>
        </div>
      </div>
    </NavLink>
  );
};

export default CategoryCard;