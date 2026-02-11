import RecipeCard from "@/components/RecipeCard";
import { getAllCategories } from "@/data/categories";
import { getAllRecipes } from "@/data/recipes";
import type { Category } from "@/types/category";
import type { Recipe } from "@/types/recipe";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { usePageMeta } from "@/hooks/useTitle";

function getCategoryIdFromRecipe(recipe: Recipe): string {
  const c = recipe.categoryId;
  if (!c) return "";
  if (typeof c === "string") return c;
  return c._id ? String(c._id) : "";
}

export default function Recipes() {
 usePageMeta({
    title: "Recipes",
    description:
      "Browse elevated recipes by cuisine, category, and chef. Save favorites, plan cooking, and follow step-by-step guidance designed for home kitchens.",
    image: "/og-default.png",
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // take the category from the URL
  const activeCategoryId = searchParams.get("category") ?? "";

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [allRecipes, allCategories] = await Promise.all([
          getAllRecipes(),
          getAllCategories(),
        ]);

        if (!ignore) {
          setRecipes(allRecipes);
          setCategories(allCategories);
        }
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Failed to fetch");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const topCategories = useMemo(() => categories.slice(0, 4), [categories]);

  const filteredRecipes = useMemo(() => {
    if (!activeCategoryId) return recipes;
    return recipes.filter(
      (r) => getCategoryIdFromRecipe(r) === activeCategoryId,
    );
  }, [recipes, activeCategoryId]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return "";
    const found = categories.find((c) => c._id === activeCategoryId);
    return found?.name ?? "";
  }, [activeCategoryId, categories]);

  const clearFilter = () => {
    searchParams.delete("category");
    setSearchParams(searchParams, { replace: true });
  };

  const setFilter = (id: string) => {
    setSearchParams({ category: id }, { replace: true });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="text-sm text-(--text-muted)">Loading recipes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title + filters */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-12">
        <h1 className="text-center text-4xl font-semibold text-(--text-title) md:text-5xl">
          Recipes
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-(--text-muted) md:text-base">
          {activeCategoryName
            ? `Showing recipes from: ${activeCategoryName}`
            : "Explore chef-crafted recipes and find your next favorite dish."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {topCategories.map((cat) => {
            const active = activeCategoryId === cat._id;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setFilter(cat._id)}
                className={
                  active
                    ? "cursor-pointer rounded-full bg-(--accent-olive) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
                    : "cursor-pointer rounded-full border border-(--accent-olive) px-5 py-2.5 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
                }
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="mt-10 border-t border-(--border-soft)" />
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-sm text-(--text-muted)">
            No recipes found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((r) => (
              <RecipeCard key={r._id} recipe={r} />
            ))}
          </div>
        )}

        {/* Button at bottom */}
        {activeCategoryId && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={clearFilter}
              className="cursor-pointer rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
            >
              View all recipes
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
