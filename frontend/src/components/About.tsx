import { ClocheIcon } from "./icons/ClocheIcon";
import { ChefHatIcon } from "./icons/ChefHatIcon";
import { ShoppingCartIcon } from "./icons/ShoppingCartIcon";

const About = () => {
  return (
    <section
      id="why-culinaire"
      className="py-20"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-[var(--text-title)]">
            Why Culinaire
          </h2>

          {/* <p className="mx-auto max-w-xl text-[var(--text-muted)]">
            We bring fine dining philosophy into everyday home cooking —
            thoughtfully, accessibly, and beautifully.
          </p> */}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-10 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col max-w-77 items-center text-center gap-5">
            <ClocheIcon className="h-12 w-12 text-[var(--accent-olive)]" />

            <h3 className="text-lg font-semibold">
              Restaurant-Level Recipes
            </h3>

            <p className="text-sm text-[var(--text-muted)]">
              Curated fine-dining recipes created by professional chefs  - adapted for home kitchen
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col max-w-77 items-center text-center gap-5">
            <ChefHatIcon className="h-12 w-12 text-[var(--accent-olive)]" />

            <h3 className="text-lg font-semibold">
             Elevated, Yet Accessible
            </h3>

            <p className="text-sm text-[var(--text-muted)]">
              Clear step-by-step instructions that make complex dishes achievable - even for non-professionals
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col max-w-77 items-center text-center gap-5">
            <ShoppingCartIcon className="h-12 w-12 text-[var(--accent-olive)]" />

            <h3 className="text-lg font-semibold">
              Cook Smarter
            </h3>

            <p className="text-sm text-[var(--text-muted)]">
             Save favourites, adjust portions, and generate shopping lists - all in one place
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;