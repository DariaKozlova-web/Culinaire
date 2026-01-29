import { NavLink } from "react-router";

import logoutIcon from "../assets/icons/logout.svg";
import userIcon from "../assets/icons/userIcon.svg";
import logoLight from "../assets/images/logo-light.svg";
import { MoonIcon } from "./icons/MoonIcon";

const Header = () => {
  const isAuthenticated = true; // временно

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--bg-main)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-[Philosopher] text-lg"
        >
          <img src={logoLight} alt="Culinaire" className="h-10" />

          <span
            className="inline-block bg-clip-text font-bold text-transparent uppercase"
            style={{
              background: "var(--gradient-logo)",
              WebkitBackgroundClip: "text",
            }}
          >
            Culinaire
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {["/", "/recipes", "/about"].map((path, i) => {
            const labels = ["Home", "Recipes", "About"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? "font-medium text-[var(--accent-wine)]"
                      : "text-[var(--accent-olive)] hover:text-[var(--accent-wine)]"
                  } `
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            className="group flex h-9 w-9 items-center justify-center rounded-full text-[var(--accent-olive)] transition-colors hover:text-[var(--accent-wine)]"
          >
            <MoonIcon className="h-4 w-4" />
          </button>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="hidden text-sm text-[var(--accent-olive)] transition-colors hover:text-[var(--accent-wine)] md:inline"
              >
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className="flex h-10 items-center justify-center rounded-xl border border-[var(--accent-olive)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-olive)] transition-colors hover:border-[var(--accent-wine)] hover:text-[var(--accent-wine)]"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              {/* User avatar */}
              <NavLink
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
              >
                <img src={userIcon} alt="Profile" className="h-5 w-5" />
              </NavLink>

              {/* Log out */}
              <button className="flex items-center gap-2 text-sm text-[var(--accent-olive)] transition-colors hover:text-[var(--accent-wine)]">
                <img src={logoutIcon} alt="" className="h-4 w-4" />
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
