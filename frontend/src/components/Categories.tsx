import CategoryCard from "./CategoryCard";
import { categoriesMock } from "./categories.mock";
import { NavLink } from "react-router";

const Categories = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-10 text-3xl font-bold text-center text-(--text-title)">
          Categories
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesMock.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
  <NavLink
    to="/recipes"
    className="
      inline-flex h-12 items-center justify-center
      rounded-xl
      bg-(--accent-olive)
      px-7
      text-sm font-semibold text-white
      transition-colors
      hover:bg-(--accent-wine)
    "
  >
    View all recipes
  </NavLink>
</div>

      </div>
    </section>
  );
};

export default Categories;