import ChefCard from "./ChefCard";
import { chefsMock } from "../mocks/chefs.mock";

const Chefs = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[Philosopher] text-4xl text-(--text-title) font-bold">
            Meet Our Chefs
          </h2>

          <p className="mx-auto max-w-xl text-sm text-(--text-muted)">
            Professional chefs sharing their signature dishes — straight from
            their restaurants to your home.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-4">
          {chefsMock.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chefs;