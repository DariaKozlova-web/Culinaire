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
          <h1 className="mb-6 text-4xl font-bold text-(--text-title) sm:text-5xl">
            <span className="uppercase">Culinaire</span>
            <br />
            Elevated home cooking
          </h1>
          <p className="mb-8 max-w-70 font-semibold text-(--text-title)">
            Discover classic fine-dining recipes adapted for home kitchens.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <NavLink
              to="/recipes"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-(--accent-olive) px-7 text-sm font-semibold text-white transition-colors hover:bg-(--accent-wine) sm:w-auto"
            >
              Explore recipes
            </NavLink>

            <button
              onClick={scrollToWhy}
              className="bg-(--btn-ghost-bg) inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-(--accent-olive) px-7 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine) sm:w-auto"
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
