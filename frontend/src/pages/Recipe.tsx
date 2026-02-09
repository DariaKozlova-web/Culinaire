import { GlobIcon } from "@/components/icons/GlobIcon";
import { LevelIcon } from "@/components/icons/LevelIcon";
import { ServesIcon } from "@/components/icons/ServesIcon";
import { updateProfile } from "@/data/profile";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";

import { ClockIcon } from "../components/icons/ClockIcon";
import useAuth from "../contexts/useAuth";
import { getRecipeBySlug, getShoplistById } from "../data/recipes";
import type { PopulatedChef, Recipe } from "../types/recipe";

type ChefPopulated = Exclude<PopulatedChef, string>;

function isChefPopulated(val: PopulatedChef): val is ChefPopulated {
  return typeof val === "object" && val !== null && "_id" in val;
}

type SavedNote = {
  id: string;
  text: string;
  createdAt: number;
};

function makeNoteKey(recipeId: string) {
  return `culinaire:notes:${recipeId}`;
}

export default function RecipePage() {
  const { user, authLoading, setUser } = useAuth();
  const isLoggedIn = !!user;

  const { slug } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // favorites
  const [isInFavorites, setIsInFavorites] = useState(false);

  // notes
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [savingNote, setSavingNote] = useState(false);

  // fetch recipe
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!slug) throw new Error("Recipe slug is missing");

        const data = await getRecipeBySlug(slug);
        if (!ignore) setRecipe(data);
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to fetch recipe");
          setRecipe(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

  // load notes from localStorage when recipe changes
  useEffect(() => {
    if (!recipe?._id) return;

    try {
      const raw = localStorage.getItem(makeNoteKey(recipe._id));
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      setSavedNotes(Array.isArray(parsed) ? (parsed as SavedNote[]) : []);
    } catch {
      setSavedNotes([]);
    }
  }, [recipe?._id]);

  useEffect(() => {
    if (!recipe) return;
    if (user && user.favorites?.includes(recipe._id)) {
      setIsInFavorites(true);
    } else {
      setIsInFavorites(false);
    }
  }, [recipe, user]);

  const persistNotes = (recipeId: string, notes: SavedNote[]) => {
    localStorage.setItem(makeNoteKey(recipeId), JSON.stringify(notes));
  };

  const onFavoritesClick = async () => {
    if (!user || !recipe) return;
    let favorites = user.favorites || [];
    if (isInFavorites) {
      favorites = favorites.filter((id) => id !== recipe._id);
    } else {
      favorites.push(recipe._id);
    }
    const formData = new FormData();
    formData.append("favorites", JSON.stringify(favorites));
    const updatedUser = await updateProfile(formData);
    setUser(updatedUser);
  };

  const onSaveNote = () => {
    if (!recipe?._id) return;
    if (!isLoggedIn || authLoading) return;
    if (!note.trim()) return;

    try {
      setSavingNote(true);

      const newNote: SavedNote = {
        id: crypto.randomUUID(),
        text: note.trim(),
        createdAt: Date.now(),
      };

      const next = [newNote, ...savedNotes];
      setSavedNotes(next);
      persistNotes(recipe._id, next);
      setNote("");
    } finally {
      setSavingNote(false);
    }
  };

  const onDeleteNote = (id: string) => {
    if (!recipe?._id) return;
    const next = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(next);
    persistNotes(recipe._id, next);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="text-sm text-(--text-muted)">Loading...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Recipe not found"}
        </div>
      </div>
    );
  }

  // chef safe access
  const chef = isChefPopulated(recipe.chefId) ? recipe.chefId : null;

  const chefName = chef?.name ?? "";
  const chefImage = typeof chef?.image === "string" ? chef.image : "";
  const chefCity = chef?.city ?? "";
  const chefRestaurantName = chef?.restaurant?.name ?? "";
  const chefUrl = chef?.url ?? "";

  const handleDownload = async () => {
    if (!recipe._id) return;
    setLoading(true);
    try {
      const response = await getShoplistById(recipe._id);

      if (!response.ok) throw new Error("Server error when creating PDF");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Shoplist_${recipe.url}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("PDF creating error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pt-12 md:px-8 md:pt-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold text-(--text-title) md:text-5xl">
              {recipe.title}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-(--text-muted) md:text-base">
              {recipe.description}
            </p>

            <button
              type="button"
              disabled={!isLoggedIn || authLoading}
              onClick={onFavoritesClick}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-(--accent-olive) px-8 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
              title={
                !isLoggedIn
                  ? "Login required"
                  : isInFavorites
                    ? "Remove from favorites"
                    : "Add to favorites"
              }
            >
              {isInFavorites ? "Remove from favorites" : "Add to favorites"}
            </button>

            {!isLoggedIn && (
              <p className="mt-3 text-xs text-(--text-muted)">
                Login to add favorites, shoplist and notes.
              </p>
            )}
          </div>

          <div className="md:justify-self-end">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={recipe.image || ""}
                alt={recipe.title}
                className="h-80 w-full object-cover md:h-112 md:w-130"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-(--border-soft)" />
      </section>

      {/* INGREDIENTS + CHEF/DETAILS */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Ingredients */}
          <div>
            <h2 className="text-3xl font-semibold text-(--text-title)">
              Ingredients
            </h2>

            <ul className="mt-8 space-y-3 text-sm md:text-base">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-(--text-title)">
                  {ing.title} —{" "}
                  <span className="text-(--text-body)">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!isLoggedIn || authLoading}
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-(--accent-olive) px-7 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
              title={!isLoggedIn ? "Login required" : "Add to shoplist"}
            >
              Add to shoplist
            </button>
          </div>

          {/* Chef + details */}
          <div className="lg:pl-10">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-(--border-soft)">
                {chefImage ? (
                  <img
                    src={chefImage}
                    alt={chefName || "Chef"}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div>
                <div className="text-lg font-semibold text-(--text-title)">
                  {chefName || "Chef"}
                </div>

                <div className="mt-1 text-sm text-(--text-muted)">
                  {chefRestaurantName ? (
                    <>
                      Head Chef at {chefRestaurantName}
                      {chefCity ? ` · ${chefCity}` : ""}
                    </>
                  ) : chefCity ? (
                    <>Chef · {chefCity}</>
                  ) : (
                    <>Chef</>
                  )}
                </div>

                {chefUrl ? (
                  <NavLink
                    to={`/chef/${chefUrl}`}
                    className="mt-3 inline-block text-sm font-semibold text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    View more
                  </NavLink>
                ) : null}
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center text-(--accent-olive)">
                  <GlobIcon className="h-6 w-6" />
                </span>
                <div className="text-sm text-(--text-title) md:text-base">
                  <span className="font-semibold">Cuisine:</span>{" "}
                  <span className="text-(--text-body)">
                    {recipe.cuisine || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center text-(--accent-olive)">
                  <ClockIcon className="h-6 w-6" />
                </span>
                <div className="text-sm text-(--text-title) md:text-base">
                  <span className="font-semibold">Total time:</span>{" "}
                  <span className="text-(--text-body)">
                    {recipe.totalTime || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center text-(--accent-olive)">
                  <ServesIcon className="h-6 w-6" />
                </span>
                <div className="text-sm text-(--text-title) md:text-base">
                  <span className="font-semibold">Serves:</span>{" "}
                  <span className="text-(--text-body)">
                    {recipe.service || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center text-(--accent-olive)">
                  <LevelIcon className="h-6 w-6" />
                </span>
                <div className="text-sm text-(--text-title) md:text-base">
                  <span className="font-semibold">Level:</span>{" "}
                  <span className="text-(--text-body)">
                    {recipe.level || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-7xl px-0 pb-10 md:px-0">
        <div className="px-4 md:px-8">
          <div className="border-t border-(--border-soft)" />
        </div>

        <div className="mt-10 space-y-14">
          {recipe.instructions.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
                  <div
                    className={`px-4 md:px-8 ${
                      isEven ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <h3 className="mt-2 text-xl font-semibold text-(--accent-olive) md:text-2xl">
                      Step {step.number} — {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-(--text-body) md:text-base">
                      {step.description}
                    </p>
                  </div>

                  <div className={`${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div
                      className={[
                        "overflow-hidden",
                        isEven
                          ? "rounded-l-[999px] rounded-r-none"
                          : "rounded-l-none rounded-r-[999px]",
                      ].join(" ")}
                    >
                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="h-65 w-full object-cover md:h-87"
                        />
                      ) : (
                        <div className="h-55 w-full bg-(--border-soft) md:h-65" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NOTES */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 md:px-8">
        <h2 className="text-center text-3xl font-semibold text-(--text-title)">
          Your Notes
        </h2>

        <div className="mx-auto mt-8 max-w-xl">
          {savedNotes.length > 0 && (
            <div className="mb-5 space-y-3">
              {savedNotes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-(--border-soft) bg-transparent px-4 py-3 text-sm text-(--text-body)"
                >
                  <div>
                    <div className="whitespace-pre-wrap">{n.text}</div>
                    <div className="mt-2 text-xs text-(--text-muted)">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteNote(n.id)}
                    disabled={!isLoggedIn || authLoading}
                    className="shrink-0 rounded-xl border border-(--border-soft) px-3 py-2 text-xs font-semibold text-(--text-title) transition hover:border-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
                    title={!isLoggedIn ? "Login required" : "Delete note"}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              isLoggedIn ? "Write your notes here..." : "Login to write notes"
            }
            disabled={!isLoggedIn || authLoading}
            className="ui-input min-h-35 px-4 py-3 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onSaveNote}
              disabled={
                !isLoggedIn || authLoading || !note.trim() || savingNote
              }
              className="inline-flex items-center justify-center rounded-xl border border-(--border-soft) px-6 py-2.5 text-sm font-semibold text-(--text-title) transition hover:border-(--accent-olive) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNote ? "Saving..." : "Save note"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
