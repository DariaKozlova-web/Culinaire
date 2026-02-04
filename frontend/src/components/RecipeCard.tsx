import { NavLink } from "react-router";
import type { Recipe } from "../types/recipe";

interface Props {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => {
  const chefLabel =
    typeof recipe.chefId === "string"
      ? recipe.chefId
      : recipe.chefId?.name ?? recipe.chefId?._id ?? "Unknown";

  const imageSrc =
    typeof recipe.image === "string" && recipe.image.trim().length > 0
      ? recipe.image
      : "https://placehold.co/600x400?text=No+image";

  return (
    <NavLink
      to={`/recipes/${recipe._id}`}
      className="group relative overflow-hidden rounded-2xl bg-(--bg-card) p-4 shadow-[0_0_40px_rgba(0,0,0,0.4)] transition hover:shadow-[0_0_55px_rgba(0,0,0,0.6)]"
    >
      {/* Image */}
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={imageSrc}
          alt={recipe.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Meta */}
      <p className="mb-1 text-xs text-(--text-muted)">
        By Chef {chefLabel} · {recipe.cuisine}
      </p>

      <h3 className="mb-2 font-[Philosopher] text-lg font-bold">
        {recipe.title}
      </h3>

      <p className="mb-4 text-sm text-(--text-muted)">
        {recipe.description}
      </p>

      {/* Tag  */}
      {recipe.tag && (
        <span className="inline-block rounded-full bg-(--accent-wine) px-3 py-1 text-xs text-white">
          {recipe.tag}
        </span>
      )}
    </NavLink>
  );
};

export default RecipeCard;