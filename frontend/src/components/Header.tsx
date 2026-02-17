import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";

import logoDark from "../assets/images/logo-dark-new.svg";
import logoLight from "../assets/images/logo-light-new.svg";
import { useTheme } from "../contexts/themeContext";
import useAuth from "../contexts/useAuth";
import { logout } from "../data";
import { BurgerIcon } from "./icons/BurgerIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";
import { UserIcon } from "./icons/UserIcon";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMobileOpen(false);
    navigate("/");
  };

  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/chefs", label: "Chefs" },
    { to: "/recipes", label: "Recipes" },
    { to: "/about", label: "About" },
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-60 border-b border-(--border-soft) bg-(--bg-main)/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 font-[Philosopher] text-lg"
          >
            <img
              src={theme === "light" ? `${logoLight}` : `${logoDark}`}
              alt="Culinaire - Elevated home cooking"
              className="h-12"
            />
            <span
              className="hidden bg-clip-text text-xl font-bold text-transparent uppercase sm:inline-block"
              style={{
                background: "var(--gradient-logo)",
                WebkitBackgroundClip: "text",
              }}
            >
              Culinaire
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? "font-semibold text-(--accent-wine)"
                      : "text-(--accent-olive) font-semibold hover:text-(--accent-wine)"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="User Avatar"
                      className="object-fit-cover h-5 w-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </NavLink>

                {/* Log out desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden cursor-pointer items-center gap-2 text-sm font-semibold text-(--accent-olive) transition-colors hover:text-(--accent-wine) md:flex"
                >
                  <LogoutIcon className="h-6 w-6" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="hidden text-sm font-semibold text-(--accent-olive) transition-colors hover:text-(--accent-wine) md:inline"
                >
                  Sign in
                </NavLink>

                <NavLink
                  to="/register"
                  className="hidden h-10 items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-2.5 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine) md:flex"
                >
                  Get Started
                </NavLink>
              </>
            )}

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--accent-olive) text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine) active:scale-[0.98] md:hidden"
              aria-label="Open menu"
              title="Menu"
            >
              <BurgerIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute top-0 right-0 h-full w-[86%] max-w-85 bg-(--bg-main) shadow-2xl">
            <div className="flex items-center justify-between border-b border-(--border-soft) px-4 py-3">
              <div className="pl-4 text-sm font-semibold text-(--text-title) uppercase">
                Menu
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--accent-olive) text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine) active:scale-[0.98]"
                aria-label="Close menu"
                title="Close"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-(--accent-olive) text-white"
                          : "text-(--text-title) hover:text-(--accent-wine)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 border-t border-(--border-soft)">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-(--accent-olive) transition-colors hover:text-(--accent-wine)"
                  >
                    <LogoutIcon className="h-6 w-6" />
                    Log out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm text-(--text-title) transition-colors hover:text-(--accent-wine)"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl border border-(--accent-olive) px-4 py-3 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
                    >
                      Get Started
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
