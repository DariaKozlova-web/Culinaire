import { useEffect, useState } from "react";
import ChefCard from "./ChefCard";
import type { Chef } from "../types/chef";
import { getAllChefs } from "../data/chefs";

const Chefs = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getAllChefs();
        if (alive) setChefs(data);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load chefs");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[Philosopher] text-4xl text-(--text-title) font-bold">
            Meet Our Chefs
          </h2>
          <p className="mx-auto max-w-xl text-sm text-(--text-muted)">
            Professional chefs sharing their signature dishes — straight from
            their restaurants to your home.
          </p>
        </div>

        {loading && <p className="text-center text-(--text-muted)">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-10 md:grid-cols-4">
            {chefs.map((chef) => (
              <ChefCard key={chef._id} chef={chef} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Chefs;