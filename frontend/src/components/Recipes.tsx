import { NavLink } from "react-router";
import RecipeCard from "./RecipeCard";
import { recipesMock } from "../mocks/recipes.mock";
import { getRandomItems } from "../utils/getRandomItems";

const Recipes = () => {
  const featured = getRandomItems(recipesMock, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[Philosopher] text-4xl font-bold text-(--text-title)">
            Featured Recipes
          </h2>

          <p className="mx-auto max-w-xl text-sm text-(--text-muted)">
            Discover signature dishes from professional chefs — refined,
            seasonal and beautifully plated.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3">
          {featured.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <NavLink
            to="/recipes"
            className="rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-medium text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
          >
            View all recipes
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Recipes;