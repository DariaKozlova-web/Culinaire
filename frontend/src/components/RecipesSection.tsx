import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import { getFavoriteRecipes, getRandomRecipes } from "../data/recipes";
import type { Recipe } from "../types/recipe";
import RecipeCard from "./RecipeCard";
import FadeLoader from "react-spinners/FadeLoader";

const RecipesSection = ({ favoritesOnly }: { favoritesOnly?: boolean }) => {
  const [featured, setFeatured] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = favoritesOnly
          ? await getFavoriteRecipes()
          : await getRandomRecipes(3);
        if (alive) setFeatured(data);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Failed to load recipes");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [favoritesOnly]);

  return (
    <section className="py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[Philosopher] text-4xl font-bold text-(--text-title)">
            {favoritesOnly ? "My favorite Recipes" : "Featured Recipes"}
          </h2>

          <p className="mx-auto max-w-xl text-sm text-(--text-muted)">
            Discover signature dishes from professional chefs — refined,
            seasonal and beautifully plated.
          </p>
        </div>

        {loading && (
          <div className="flex h-110 w-full scale-200 items-center justify-center">
            <FadeLoader color={"#f2c9a0"} />
          </div>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((recipe, idx) => (
              <div
                key={recipe._id}
                className={
                  idx === 2
                    ? "sm:col-span-2 sm:flex sm:justify-center lg:col-span-1 lg:block"
                    : ""
                }
              >
                <div className={idx===2? "sm:max-w-md lg:max-w-none":""}>
                  <RecipeCard recipe={recipe} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <NavLink
            to="/recipes"
            className="rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
          >
            View all recipes
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default RecipesSection;
