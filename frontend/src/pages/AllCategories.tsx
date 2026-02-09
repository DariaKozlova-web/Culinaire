import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import { deleteCategoryById, getAllCategories } from "../data/categories";
import type { Category } from "../types/category";

function AllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data: Category[] = await getAllCategories();
        if (!ignore) setCategories(data);
      } catch (e) {
        if (!ignore)
          setError(
            e instanceof Error ? e.message : "Failed to fetch categories",
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const onDelete = async (id: string) => {
    const ok = window.confirm(
      "Delete this category? This will also remove images from Cloudinary.",
    );
    if (!ok) return;

    try {
      setBusyId(id);
      await deleteCategoryById(id);
      setCategories((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete category");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl py-10">
        <div className="mb-6">
          <h1 className="text-center text-3xl font-semibold">All categories</h1>
          <p className="mt-2 text-center text-sm text-(--text-muted)">
            Edit or delete categories in the Culinaire database
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="ui-panel p-6">
          {loading ? (
            <div className="text-sm text-(--text-muted)">Loading…</div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-(--text-muted)">
              No categories yet.
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((r) => (
                <div
                  key={r._id}
                  className="ui-row flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{r.name}</div>
                    <div className="truncate text-xs text-(--text-muted)">
                      {r.url}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <NavLink
                      to={`/dashboard/categories/${r._id}/edit`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-(--accent-olive) px-4 text-sm font-medium text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
                    >
                      Edit
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => onDelete(r._id)}
                      disabled={busyId === r._id}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 px-4 text-sm font-medium transition hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10"
                    >
                      {busyId === r._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <NavLink
            to="/dashboard/create-category"
            className="text-sm font-semibold text-(--accent-olive) hover:text-(--accent-wine)"
          >
            + Create new category
          </NavLink>
        </div>
      </div>
    </div>
  );
}
export default AllCategories;
