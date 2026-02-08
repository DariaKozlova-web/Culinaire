import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { deleteRecipeById, getAllRecipes } from "../data/recipes";
import type { Recipe } from "../types/recipe";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        if (!ignore) setRecipes(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Failed to fetch recipes");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this recipe? This will also remove images from Cloudinary.");
    if (!ok) return;

    try {
      setBusyId(id);
      await deleteRecipeById(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete recipe");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl py-10">
        <div className="mb-6">
          <h1 className="text-center text-3xl font-semibold">All recipes</h1>
          <p className="mt-2 text-center text-sm text-(--text-muted)">
            Edit or delete recipes in the Culinaire database
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
          ) : recipes.length === 0 ? (
            <div className="text-sm text-(--text-muted)">No recipes yet.</div>
          ) : (
            <div className="space-y-3">
              {recipes.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between gap-4 ui-row px-5 py-4"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{r.title}</div>
                    <div className="truncate text-xs text-(--text-muted)">{r.url}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <NavLink
                      to={`/dashboard/recipes/${r._id}/edit`}
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
             to="/dashboard/create-recipe"
             className="text-sm font-semibold text-(--accent-olive) hover:text-(--accent-wine)"
           >
             + Create new recipe
           </NavLink>
         </div>
      </div>
    </div>
  );
}




// import { useEffect, useMemo, useState } from "react";
// import { NavLink } from "react-router";
// import { deleteRecipeById, getAllRecipes } from "../data/recipes";
// import type { Recipe } from "../types/recipe";

// export default function AllRecipes() {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState<string | null>(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let ignore = false;

//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const data = await getAllRecipes();
//         if (!ignore) setRecipes(data);
//       } catch (e) {
//         if (!ignore)
//           setError(e instanceof Error ? e.message : "Failed to fetch recipes");
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   const countLabel = useMemo(() => {
//     if (loading) return "Loading…";
//     if (recipes.length === 0) return "0 recipes";
//     if (recipes.length === 1) return "1 recipe";
//     return `${recipes.length} recipes`;
//   }, [loading, recipes.length]);

//   const onDelete = async (id: string) => {
//     const ok = window.confirm(
//       "Delete this recipe? This will also remove images from Cloudinary."
//     );
//     if (!ok) return;

//     try {
//       setBusyId(id);
//       setError("");
//       await deleteRecipeById(id);
//       setRecipes((prev) => prev.filter((r) => r._id !== id));
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to delete recipe");
//     } finally {
//       setBusyId(null);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-center text-3xl font-semibold text-(--text-title)">
//             All recipes
//           </h1>
//           <p className="mt-2 text-center text-sm text-(--text-muted)">
//             Edit or delete recipes in the Culinaire database
//           </p>

//           <div className="mt-4 flex justify-center">
//             <span className="inline-flex items-center rounded-full border border-black/10 bg-white/40 px-4 py-1.5 text-xs text-(--text-muted) dark:border-white/10 dark:bg-transparent">
//               {countLabel}
//             </span>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* Panel */}
//         <div className="rounded-3xl border border-black/10 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-transparent md:p-6">
//           {loading ? (
//             <div className="py-10 text-center text-sm text-(--text-muted)">
//               Loading…
//             </div>
//           ) : recipes.length === 0 ? (
//             <div className="py-10 text-center text-sm text-(--text-muted)">
//               No recipes yet.
//             </div>
//           ) : (
//             <div className="grid gap-4 sm:grid-cols-2">
//               {recipes.map((r) => {
//                 const isBusy = busyId === r._id;

//                 return (
//                   <div
//                     key={r._id}
//                     className="
//                       group
//                       rounded-2xl border border-black/10 bg-white/50
//                       p-5 shadow-[0_8px_28px_rgba(0,0,0,0.06)]
//                       transition
//                       hover:shadow-[0_10px_36px_rgba(0,0,0,0.10)]
//                       dark:border-white/10 dark:bg-transparent
//                     "
//                   >
//                     {/* Title + slug */}
//                     <div className="min-w-0">
//                       <div className="truncate text-base font-semibold text-(--text-title)">
// {r.title}
//                       </div>
//                       <div className="mt-1 truncate text-xs text-(--text-muted)">
//                         /recipe/{r.url}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="mt-5 flex items-center justify-between gap-3">
//                       <NavLink
//                         to={`/dashboard/recipes/${r._id}/edit`}
//                         className="
//                           inline-flex h-10 items-center justify-center rounded-xl
//                           border border-(--accent-olive) px-4 text-sm font-semibold
//                           text-(--accent-olive) transition
//                           hover:border-(--accent-wine) hover:text-(--accent-wine)
//                         "
//                         title="Edit recipe"
//                       >
//                         Edit
//                       </NavLink>

//                       <button
//                         type="button"
//                         onClick={() => onDelete(r._id)}
//                         disabled={isBusy}
//                         className="
//                           inline-flex h-10 items-center justify-center rounded-xl
//                           border border-black/10 px-4 text-sm font-semibold
//                           text-(--text-title) transition
//                           hover:border-(--accent-wine) hover:text-(--accent-wine)
//                           disabled:cursor-not-allowed disabled:opacity-60
//                           dark:border-white/10
//                         "
//                         title="Delete recipe"
//                       >
//                         {isBusy ? "Deleting…" : "Delete"}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Optional: back to create */}
//         <div className="mt-8 flex justify-center">
//           <NavLink
//             to="/dashboard/create-recipe"
//             className="text-sm font-semibold text-(--accent-olive) hover:text-(--accent-wine)"
//           >
//             + Create new recipe
//           </NavLink>
//         </div>
//       </div>
//     </div>
//   );
// }



