import { NavLink } from "react-router";

import heroImg from "../assets/images/hero-bg2.png";

const Banner = () => {
  const scrollToWhy = () => {
    document
      .getElementById("why-culinaire")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative h-[90vh] min-h-150">
      {/* Background image */}
      <img
        src={heroImg}
        alt="Fine dining dish"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-(--bg-overlay)" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 md:px-8">
        <div className="max-w-xl">
          <h1 className="mb-6 text-5xl font-bold text-(--text-title) md:text-5xl">
            <span className="uppercase">Culinaire</span>
            <br />
            Elevated home cooking
          </h1>
          <p className="mb-8 max-w-70 font-semibold text-(--text-title)">
            Discover classic fine-dining recipes adapted for home kitchens.
          </p>

          <div className="flex gap-4">
            <NavLink
              to="/recipes"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-(--accent-olive) px-7 text-sm font-semibold text-white transition-colors hover:bg-(--accent-wine)"
            >
              Explore recipes
            </NavLink>

            <button
              onClick={scrollToWhy}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-(--accent-olive) px-7 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
            >
              How it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
