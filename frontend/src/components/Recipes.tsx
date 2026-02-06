import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import { getFavoriteRecipes, getRandomRecipes } from "../data/recipes";
import type { Recipe } from "../types/recipe";
import RecipeCard from "./RecipeCard";

const Recipes = ({ favoritesOnly }: { favoritesOnly?: boolean }) => {
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
  }, []);

  return (
    <section className="py-24">
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
          <p className="text-center text-(--text-muted)">Loading...</p>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-10 md:grid-cols-3">
            {featured.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}

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
