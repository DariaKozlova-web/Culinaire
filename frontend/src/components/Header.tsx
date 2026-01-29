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
            <MoonIcon className="h-4 w-4"/>
            {/* <svg className="h-4 w-4" viewBox="0 0 21 21">
              <path
                d="M10.5762 0.757812H10.8906C11.1989 0.757812 11.476 0.946566 11.5889 1.2334C11.7016 1.5204 11.6273 1.84772 11.4014 2.05762C10.2453 3.13192 9.50177 4.57722 9.30078 6.14258C9.09981 7.70802 9.45443 9.29443 10.3018 10.626C11.1491 11.9575 12.4363 12.9497 13.9395 13.4307C15.4426 13.9115 17.0665 13.8511 18.5293 13.2588C18.8096 13.1453 19.1309 13.211 19.3438 13.4258C19.5566 13.6406 19.619 13.9629 19.5029 14.2422C18.8255 15.8719 17.7184 17.287 16.2998 18.3369C14.8811 19.3868 13.2039 20.0326 11.4473 20.2041C9.69073 20.3756 7.92015 20.0671 6.3252 19.3115C4.73024 18.5559 3.37048 17.381 2.39062 15.9131C1.41073 14.4451 0.847813 12.7385 0.761719 10.9756C0.67564 9.21286 1.06935 7.45971 1.90137 5.90332C2.73357 4.34681 3.97345 3.04519 5.4873 2.1377C7.00112 1.23025 8.73308 0.750426 10.498 0.75Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
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
