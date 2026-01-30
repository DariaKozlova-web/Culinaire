import { NavLink } from "react-router";
import { useTheme } from "../contexts/themeContext";

const CTASection = () => {
  const { theme } = useTheme();

  const radialOverlay =
    theme === "light"
      ? "radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 65%)"
      : "radial-gradient(circle at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 65%)";

  return (
    <section
      className="relative pb-28"
      style={{
        background: `
          ${radialOverlay},
          var(--gradient-cta)
        `,
      }}
    >
      {/* Divider */}
         <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl  pt-24 px-4 md:px-8">

        {/* Content */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-(--text-title)">
            Bring Fine Dining Home
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-sm text-(--text-muted)">
            Join Culinaire and start cooking elegant, chef-crafted dishes in your
            own kitchen.
          </p>

          <NavLink
            to="/register"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-(--accent-olive)
              px-8
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              ease-out
              hover:-translate-y-0.5
              hover:bg-(--accent-wine)
            "
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default CTASection;