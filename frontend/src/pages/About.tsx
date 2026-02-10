import { NavLink } from "react-router";

// ✅ Replace with your image:
// import aboutImage from "../assets/images/about-hero.jpg";
import aboutImage from "../assets/images/about-hero-1.jpg";

export default function About() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pt-12 md:px-8 md:pt-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold text-(--text-title) md:text-5xl">
              About Culinaire
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-(--text-muted) md:text-base">
              Culinaire is a web platform for elevated home cooking — for people
              who want to cook beautiful, restaurant-style meals at home. We
              built it because great chef recipes are often hard to find in one
              clear and well-structured place.
            </p>
          </div>

          <div className="md:justify-self-end">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={aboutImage}
                alt="About Culinaire"
                className="h-80 w-full object-cover md:h-112 md:w-130"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-black/10 dark:border-white/10" />
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-14">
        {/* PROBLEM + IDEA (polished) */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-(--text-title) md:text-4xl">
            Why Culinaire exists
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-(--text-muted) md:text-base">
            We wanted refined recipes to feel simple, clear, and inspiring — not
            messy or overwhelming.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Problem */}
          <div className="ui-surface p-10">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-(--accent-wine)" />
            <h3 className="text-center text-2xl font-semibold text-(--text-title)">
              The problem
            </h3>
            <p className="mt-5 text-center text-sm leading-6 text-(--text-body) md:text-base">
              Many recipe sites feel chaotic: too many ads, unclear steps, and
              no structure. You often find either very basic meals or
              professional-level recipes without guidance.
            </p>

            <ul className="mx-auto mt-6 max-w-md space-y-2 text-sm text-(--text-body) md:text-base">
              <li>• hard to follow steps</li>
              <li>• missing planning tools</li>
              <li>• not enough chef context</li>
            </ul>
          </div>

          {/* Idea */}
          <div className="ui-surface p-10">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-(--accent-olive)" />
            <h3 className="text-center text-2xl font-semibold text-(--text-title)">
              Our idea
            </h3>
            <p className="mt-5 text-center text-sm leading-6 text-(--text-body) md:text-base">
              Culinaire combines restaurant-level inspiration with a clean, calm
              structure: ingredients, clear steps, and chef information — so
              home cooks can create impressive dishes without stress.
            </p>

            <ul className="mx-auto mt-6 max-w-md space-y-2 text-sm text-(--text-body) md:text-base">
              <li>• step-by-step clarity</li>
              <li>• chef + restaurant details</li>
              <li>• favorites, notes, and future shoplist</li>
            </ul>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="ui-surface p-8">
            <h2 className="text-2xl font-semibold text-(--text-title)">
              The problem
            </h2>
            <p className="mt-4 text-sm leading-6 text-(--text-body) md:text-base">
              Many recipe websites feel messy. You often find very basic recipes
              or very complex professional ones. Clear step-by-step guidance and
              planning tools are missing.
            </p>
          </div>

          <div className="ui-surface p-8">
            <h2 className="text-2xl font-semibold text-(--text-title)">
              Our idea
            </h2>
            <p className="mt-4 text-sm leading-6 text-(--text-body) md:text-base">
              Culinaire combines refined cuisine with clean structure:
              ingredients, clear steps, and helpful chef info — so home cooks
              can create impressive dishes without stress.
            </p>
          </div>
        </div> */}

        <div className="ui-surface mt-12 p-10">
          {/* Section title */}
          <h2 className="text-center text-2xl font-semibold text-(--text-title) md:text-3xl">
            Who is Culinaire for?
          </h2>

          {/* Columns */}
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
            {/* Home cooks */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-(--accent-olive)">
                For home cooks
              </h3>

              <ul className="mt-4 space-y-2 text-sm text-(--text-body) md:text-base">
                <li>Structured recipes with clear steps</li>
                <li>Easy browsing and smart filtering</li>
                <li>Favorites and personal notes</li>
              </ul>
            </div>

            {/* Chefs */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-(--accent-olive)">
                For chefs
              </h3>

              <ul className="mt-4 space-y-2 text-sm text-(--text-body) md:text-base">
                <li>Each recipe is linked to a chef profile</li>
                <li>Restaurant details visible to users</li>
                <li>More visibility for local cuisine</li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="ui-surface mt-10 p-8">
          <h2 className="text-2xl font-semibold text-(--text-title)">
            Who is Culinaire for?
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-(--accent-olive)">
                For home cooks
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-(--text-body) md:text-base">
                <li>• structured recipes with clear steps</li>
                <li>• easy browsing and filtering</li>
                <li>• favorites / notes (login-based)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-(--accent-olive)">
                For chefs
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-(--text-body) md:text-base">
                <li>• each recipe is linked to a chef profile</li>
                <li>• users see the chef and the restaurant</li>
                <li>• local restaurants can get noticed by new guests</li>
              </ul>
            </div>
          </div>
        </div> */}
        {/* CTA */}
        <div className="ui-surface mt-12 p-10 text-center">
          <h2 className="text-2xl font-semibold text-(--text-title) md:text-3xl">
            Are you a chef?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-(--text-body) md:text-base">
            Share your recipes, show your style, and help people discover your
            restaurant.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold tracking-wide text-(--accent-olive) md:text-base">
            Share your vision · Inspire home cooks · Get noticed
          </p>

          <div className="mt-7 flex justify-center">
            {/* Option A: route */}
            <NavLink
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent-olive) px-8 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
            >
              Contact us
            </NavLink>
          </div>
        </div>

        {/* Option B: mailto (use instead of NavLink)
            <a
              href="mailto:culinaire.project@example.com?subject=Culinaire%20—%20Chef%20Collaboration"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent-olive) px-8 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
            >
              Contact us
            </a>
            */}
      </section>
    </div>
  );
}
