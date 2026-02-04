import { NavLink } from "react-router";

import type { Chef } from "../types/chef";

interface Props {
  chef: Chef;
}

const ChefCard = ({ chef }: Props) => {
  return (
    <NavLink
      to={`/chef/${chef.url}`}
      className="group rounded-2xl bg-(--bg-card) p-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.4)] transition hover:shadow-[0_0_55px_rgba(0,0,0,0.6)]"
    >
      {/* Avatar */}
      <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full">
        <img
          src={chef.image}
          alt={chef.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h3 className="mb-1 font-[Philosopher] text-lg font-bold">{chef.name}</h3>

      <p className="mb-4 text-sm text-(--text-muted)">
        Head Chef at {chef.restaurant.name}
        <br />
        {chef.city}
      </p>

      <span className="text-sm font-medium text-(--accent-olive) transition group-hover:text-(--accent-wine)">
        View more
      </span>
    </NavLink>
  );
};

export default ChefCard;
