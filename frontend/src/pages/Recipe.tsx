import { FavoritesButton } from "@/components/FovoritesButton";
import Notes from "@/components/Notes";
import { Reviews } from "@/components/Reviews";
import { GlobIcon } from "@/components/icons/GlobIcon";
import { LevelIcon } from "@/components/icons/LevelIcon";
import { ServesIcon } from "@/components/icons/ServesIcon";
import { usePageMeta } from "@/hooks/useTitle";
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

export default function RecipePage() {
  const { user, authLoading } = useAuth();
  const isLoggedIn = !!user;

  const { slug } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const metaTitle = recipe?.title ? `${recipe.title}` : "Recipe";
  const metaDescription = recipe?.description?.trim()
    ? recipe.description
    : "Discover elevated home cooking recipes by professional chefs.";
  const metaImage = recipe?.image?.trim() ? recipe.image : "/og-default.png";

  usePageMeta({
    title: metaTitle,
    description: metaDescription,
    image: metaImage,
  });

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

            <FavoritesButton recipe={recipe} />

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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Ingredients */}
          <div>
            <h2 className="text-center text-3xl font-semibold text-(--text-title) md:text-left">
              Ingredients
            </h2>

            <ul className="mx-auto mt-8 max-w-xl justify-items-center space-y-3 text-sm md:mx-0 md:max-w-none md:justify-items-start md:text-base">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-(--text-title)">
                  {ing.title} —{" "}
                  <span className="text-(--text-body)">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center md:block">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!isLoggedIn || authLoading}
                className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl border border-(--accent-olive) px-7 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
                title={!isLoggedIn ? "Login required" : ""}
              >
                Download shoplist
              </button>
            </div>
          </div>

          {/* Chef + details */}
          <div className="lg:pl-10">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-start md:text-left">
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

            <div className="mt-10 space-y-6 md:mt-10">
              <div className="flex items-center justify-center gap-3 md:justify-start">
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

              <div className="flex items-center justify-center gap-3 md:justify-start">
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

              <div className="flex items-center justify-center gap-3 md:justify-start">
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

              <div className="flex items-center justify-center gap-3 md:justify-start">
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
        <Notes recipe={recipe} />
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 md:px-8">
        <Reviews recipeId={recipe._id} />
      </section>
    </div>
  );
}
