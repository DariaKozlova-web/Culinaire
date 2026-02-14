import { cld } from "@/utils";
import { NavLink } from "react-router";

import type { Chef } from "../types/chef";

interface Props {
  chef: Chef;
}

const ChefCard = ({ chef }: Props) => {
  return (
    <article className="group w-full max-w-70 rounded-2xl bg-(--bg-card) p-5 text-center shadow-(--shadow-card) transition hover:shadow-(--shadow-card-hover) sm:p-6 md:max-w-none">
      {/* Avatar */}
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28">
        <img
          src={cld(chef.image, { w: 224, h: 336, mode: "fill" })}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={`Photo of ${chef.name}`}
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3 className="mb-1 font-[Philosopher] text-lg font-bold">{chef.name}</h3>

      <p className="mb-4 text-sm text-(--text-muted)">
        Head Chef at {chef.restaurant.name}
        <br />
        {chef.city}
      </p>
      <NavLink
        to={`/chef/${chef.url}`}
        className="text-sm font-semibold text-(--accent-olive) transition group-hover:text-(--accent-wine)"
      >
        View more
      </NavLink>
    </article>
  );
};

export default ChefCard;
