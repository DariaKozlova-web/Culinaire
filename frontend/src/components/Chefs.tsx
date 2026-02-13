import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import FadeLoader from "react-spinners/FadeLoader";

import { getRandomChefs } from "../data/chefs";
import type { Chef } from "../types/chef";
import ChefCard from "./ChefCard";

const Chefs = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getRandomChefs();
        if (alive) setChefs(data);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Failed to load chefs");
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
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-[Philosopher] text-3xl font-bold text-(--text-title) md:text-4xl">
            Meet Our Chefs
          </h2>
          <p className="mx-auto max-w-xl text-sm text-(--text-muted) md:text-base">
            Professional chefs sharing their signature dishes — straight from
            their restaurants to your home.
          </p>
        </div>

        {loading && (
          <div className="flex h-110 w-full scale-200 items-center justify-center">
            <FadeLoader color={"#f2c9a0"} />
          </div>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {chefs.map((chef) => (
              <ChefCard key={chef._id} chef={chef} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 flex justify-center">
        <NavLink
          to="/chefs"
          className="rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
        >
          View all chefs
        </NavLink>
      </div>
    </section>
  );
};

export default Chefs;
