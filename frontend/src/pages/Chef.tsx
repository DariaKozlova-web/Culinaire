import { usePageMeta } from "@/hooks/useTitle";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import RecipeCard from "../components/RecipeCard";
import { ClockIcon } from "../components/icons/ClockIcon";
import { LocationIcon } from "../components/icons/LocationIcon";
import { getChefBySlug, getRecipesByChefId } from "../data/chefs";
import type { Chef as ChefType } from "../types/chef";
import type { Recipe as RecipeType } from "../types/recipe";

function Chef() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [chef, setChef] = useState<ChefType | null>(null);
  const [recipes, setRecipes] = useState<RecipeType[] | null>(null);

  // fetch chef
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        if (!slug) throw new Error("Chef slug is missing");

        const data = await getChefBySlug(slug);
        if (!ignore) setChef(data);

        if (data && data._id) {
          const recipes = await getRecipesByChefId(data._id);
          setRecipes(recipes);
        }
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to fetch chef");
          setChef(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const metaTitle = chef?.name ? `${chef.name}` : "Chef";
  const metaDescription = chef?.description?.trim()
    ? chef.description
    : "Meet professional chefs and explore their signature approach.";
  const metaImage = chef?.image?.trim() ? chef.image : "/og-default.png";

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

  if (error || !chef) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Chef not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20 lg:grid-cols-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-(--border-soft) md:aspect-auto md:h-120 lg:col-span-2">
              {chef.image && (
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex items-center text-center md:col-span-1 md:text-left lg:col-span-3">
              <div className="w-full">
                <h1 className="mb-6 text-4xl font-bold text-(--text-title) md:text-5xl">
                  {chef.name}
                </h1>
                <strong className="mb-4 block font-[Philosopher] text-2xl font-medium text-(--accent-olive)">
                  {chef.cuisine}
                </strong>
                <p className="mx-auto max-w-md font-semibold text-(--text-title) md:mx-0">
                  {chef.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-(--text-title)">
              About the Chef
            </h2>
            {chef.story.map((item: string, index: number) => (
              <p
                key={index}
                className="mx-auto mb-6 max-w-[75%] text-(--text-title)"
              >
                {item}
              </p>
            ))}
            <strong className="my-4 block text-2xl font-medium text-(--accent-wine) uppercase">
              Signature Approach
            </strong>
            <p className="mx-auto max-w-xl font-[Philosopher] text-2xl font-medium text-(--text-title)">
              {chef.signature}
            </p>
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-(--text-title)">
              Restaurant Details
            </h2>
            <div className="ui-surface grid grid-cols-1 gap-10 rounded-xl px-8 py-10 md:grid-cols-2 md:gap-20 md:px-16 lg:grid-cols-5 lg:gap-25 lg:px-24">
              <div className="text-center md:col-span-1 md:text-left lg:col-span-3">
                <strong className="mb-2 block font-[Philosopher] text-2xl font-bold text-(--text-title)">
                  {chef.restaurant.name}
                </strong>
                <div className="flex items-center justify-center md:justify-start">
                  <LocationIcon className="mr-2 h-8 w-auto text-(--accent-olive)" />
                  {chef.restaurant.address}
                </div>
              </div>
              <div className="text-center md:col-span-1 md:text-left lg:col-span-2">
                <strong className="block font-medium text-(--accent-olive) uppercase">
                  Opening hours
                </strong>
                <ul className="inline-block text-left md:block">
                  <li className="mt-2 flex items-center">
                    <ClockIcon className="mr-2 h-6 w-6 text-(--accent-olive)" />
                    {chef.restaurant.openingHours}
                  </li>
                  <li className="mt-2 flex items-center">
                    <ClockIcon className="mr-2 h-6 w-6 text-(--accent-olive)" />
                    {chef.restaurant.closed}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-14 md:pb-18">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-[Philosopher] text-4xl font-bold text-(--text-title)">
              Recipes by {chef.name}
            </h2>
          </div>

          {loading && (
            <p className="text-center text-(--text-muted)">Loading...</p>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}

          {recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, idx) => (
                <div
                  key={recipe._id}
                  className={
                    idx === 2
                      ? "sm:col-span-2 sm:flex sm:justify-center lg:col-span-1 lg:block"
                      : ""
                  }
                >
                  <div className={idx === 2 ? "sm:max-w-md lg:max-w-none" : ""}>
                    <RecipeCard recipe={recipe} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Recipes by {chef.name} coming soon...</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Chef;
