import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { ClockIcon } from "../components/icons/ClockIcon";
import { LocationIcon } from "../components/icons/LocationIcon";
import { getChefByURL } from "../data/chefs";
import type { Chef as ChefType } from "../types/chef";

function Chef() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [chefData, setChefData] = useState<ChefType | null>(null);

  useEffect(() => {
    const fetchChefData = async () => {
      if (!slug) return;

      setLoading(true);

      try {
        const data = await getChefByURL(slug);
        setChefData(data);
      } catch (error: unknown) {
        const message = (error as { message: string }).message;
        console.log("An error occurred while fetching the chef", message);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [slug]);

  if (loading) return "Loading...";
  if (!chefData) return "No chef data found.";

  return (
    <div>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20 lg:grid-cols-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-(--border-soft) md:aspect-auto md:h-120 lg:col-span-2">
              {chefData.image ? (
                <img
                  src={chefData.image}
                  alt={chefData.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
            <div className="flex items-center text-center md:col-span-1 md:text-left lg:col-span-3">
              <div className="w-full">
                <h1 className="mb-6 text-4xl font-bold text-(--text-title) md:text-5xl">
                  {chefData.name}
                </h1>
                <strong className="mb-4 block font-[Philosopher] text-2xl font-medium text-(--accent-olive)">
                  {chefData.cuisine}
                </strong>
                <p className="mx-auto max-w-md font-semibold text-(--text-title) md:mx-0">
                  {chefData.description}
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
            {chefData.story.map((item: string, index: number) => (
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
              {chefData.signature}
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
                  {chefData.restaurant.name}
                </strong>
                <div className="flex items-center justify-center md:justify-start">
                  <LocationIcon className="mr-2 h-8 w-auto text-(--accent-olive)" />
                  {chefData.restaurant.address}
                </div>
              </div>
              <div className="text-center md:col-span-1 md:text-left lg:col-span-2">
                <strong className="block font-medium text-(--accent-olive) uppercase">
                  Opening hours
                </strong>
                <ul className="inline-block text-left md:block">
                  <li className="mt-2 flex items-center">
                    <ClockIcon className="mr-2 h-6 w-6 text-(--accent-olive)" />
                    {chefData.restaurant.openingHours}
                  </li>
                  <li className="mt-2 flex items-center">
                    <ClockIcon className="mr-2 h-6 w-6 text-(--accent-olive)" />
                    {chefData.restaurant.closed}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h4 className="mb-4 font-[Philosopher] text-4xl font-bold text-(--text-title)">
              Recipes by {chefData.name}
            </h4>
            Recipes by {chefData.name} coming soon...
          </div>
        </div>
      </section>
    </div>
  );
}

export default Chef;
