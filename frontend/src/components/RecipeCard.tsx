import { NavLink } from "react-router";
import type { Recipe } from "../types/recipe";

interface Props {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => {
  const chefLabel =
    typeof recipe.chefId === "string"
      ? "Unknown"
      : (recipe.chefId?.name ?? recipe.chefId?._id ?? "Unknown");

  const imageSrc =
    typeof recipe.image === "string" && recipe.image.trim()
      ? recipe.image
      : "https://placehold.co/600x400?text=No+image";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-(--bg-card) p-4 shadow-[0_0_40px_rgba(0,0,0,0.4)] transition hover:shadow-[0_0_55px_rgba(0,0,0,0.6)]">
      {/* Image */}
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={imageSrc}
          alt={recipe.title}
          className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Meta */}
      <p className="mb-1 text-xs text-(--text-muted)">
        By Chef {chefLabel} · {recipe.cuisine}
      </p>

      <h3 className="mb-2 font-[Philosopher] text-lg font-bold text-(--text-title)">
        {recipe.title}
      </h3>

      {/* Description: fix the height (3 lines) */}
      <p className="line-clamp-3 text-sm text-(--text-muted)">
        {recipe.description}
      </p>

      {/* Footer pinned */}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3">

          {/* {recipe.tag ? (
            <span className="inline-block rounded-full bg-(--accent-wine) px-3 py-1 text-xs text-white">
              {recipe.tag}
            </span>
          ) : (
            <span />
          )} */}
          <span className="inline-block rounded-full border border-(--accent-olive) px-3 py-1 text-xs text-(--accent-olive)">
            {recipe.level ?? "—"}
          </span>


          <NavLink
            to={`/recipe/${recipe.url}`}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-(--accent-olive) transition hover:text-(--accent-wine)"
          >
            View recipe <span aria-hidden>→</span>
          </NavLink>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;