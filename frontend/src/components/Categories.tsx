import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import FadeLoader from "react-spinners/FadeLoader";

import { getRandomCategories } from "../data/categories";
import type { Category } from "../types/category";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getRandomCategories();
        if (alive) setCategories(data);
      } catch (e) {
        if (alive)
          setError(
            e instanceof Error ? e.message : "Failed to load categories",
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-(--text-title) md:mb-10 md:text-4xl">
          Categories
        </h2>

        {loading && (
          <div className="flex h-110 w-full scale-200 items-center justify-center">
            <FadeLoader color={"#f2c9a0"} />
          </div>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
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

export default Categories;
