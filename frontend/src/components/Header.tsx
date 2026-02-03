import { NavLink, useNavigate } from "react-router";

import logoDark from "../assets/images/logo-dark.svg";
import logoLight from "../assets/images/logo-light.svg";
import { useTheme } from "../contexts/themeContext";
import useAuth from "../contexts/useAuth";
import { logout } from "../data";
import { LogoutIcon } from "./icons/LogoutIcon";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";
import { UserIcon } from "./icons/UserIcon";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-(--bg-main)/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-[Philosopher] text-lg"
        >
          <img
            src={theme === "light" ? `${logoLight}` : `${logoDark}`}
            alt="Culinaire"
            className="h-10"
          />
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
                      ? "font-medium text-(--accent-wine)"
                      : "text-(--accent-olive) hover:text-(--accent-wine)"
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
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--accent-olive) transition-colors hover:text-(--accent-wine)"
          >
            {theme === "light" ? (
              <MoonIcon className="h-4 w-4" />
            ) : (
              <SunIcon className="h-4 w-4" />
            )}
          </button>

          {user ? (
            <>
              {/* User avatar */}
              <NavLink
                to="/dashboard"
                className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--accent-olive) transition-colors hover:text-(--accent-wine)"
              >
                <UserIcon className="h-5 w-5" />
              </NavLink>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 text-sm text-(--accent-olive) transition-colors hover:text-(--accent-wine)"
              >
                <LogoutIcon className="h-5 w-5" />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hidden text-sm text-(--accent-olive) transition-colors hover:text-(--accent-wine) md:inline"
              >
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className="flex h-10 items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-2.5 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
