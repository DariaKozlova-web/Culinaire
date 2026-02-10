import ChefCard from "@/components/ChefCard";
import { getAllChefs } from "@/data/chefs";
import type { Chef } from "@/types/chef";
import { useEffect, useState } from "react";

function Chefs() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const chefs = await getAllChefs();

        if (!ignore) {
          setChefs(chefs);
        }
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Failed to fetch");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="text-sm text-(--text-muted)">Loading chefs…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-12">
        <h1 className="text-center text-4xl font-semibold text-(--text-title) md:text-5xl">
          Chefs
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-(--text-muted) md:text-base">
          Discover professional chefs and the stories behind their signature
          dishes.
        </p>

        <div className="mt-10 border-t border-(--border-soft)" />
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        {chefs.length === 0 ? (
          <p className="text-center text-sm text-(--text-muted)">
            No chefs found.
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-4">
            {chefs.map((c) => (
              <ChefCard key={c._id} chef={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Chefs;
