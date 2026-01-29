import CategoryCard from "./CategoryCard";
import { categoriesMock } from "./categories.mock";

const Categories = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-10 text-3xl font-bold text-center">
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
      </div>
    </section>
  );
};

export default Categories;