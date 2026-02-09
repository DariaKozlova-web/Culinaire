import { NavLink } from "react-router";
import notFoundImg from "@/assets/images/404.png";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold text-(--text-title) md:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-(--text-muted) md:text-base">
            The page you’re looking for doesn’t exist or was moved. Try going back
            to the homepage.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent-olive) px-7 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
            >
              Go to Home
            </NavLink>

            <NavLink
              to="/recipes"
              className="inline-flex items-center justify-center rounded-xl border border-(--accent-olive) px-7 py-3 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine)"
            >
              Browse recipes
            </NavLink>
          </div>
        </div>

        <div className="md:justify-self-end">
            <img
              src={notFoundImg}
              alt="Not found illustration"
              className="h-auto w-full object-contain"
            />
        </div>
      </div>
    </section>
  );
}