import CategoryCard from "./CategoryCard";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getAllCategories } from "../data/categories";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getAllCategories();
        if (alive) setCategories(data);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Failed to load categories");
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
          <p className="text-center text-(--text-muted)">Loading...</p>
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
            className="inline-flex h-12 items-center justify-center rounded-xl bg-(--accent-olive) px-7 text-sm font-semibold text-white transition-colors hover:bg-(--accent-wine)"
          >
            View all recipes
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Categories;