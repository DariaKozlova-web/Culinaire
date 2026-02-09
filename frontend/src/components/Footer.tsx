import { NavLink, useNavigate } from "react-router";

import logoDark from "../assets/images/logo-dark-new.svg";
import logoLight from "../assets/images/logo-light-new.svg";
import { useTheme } from "../contexts/themeContext";
import useAuth from "../contexts/useAuth";
import { logout } from "../data";

const Footer = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const { theme } = useTheme();
  return (
    <footer className="bg-(--bg-footer)">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-4 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex flex-col items-start font-[Philosopher]">
              {/* <Logo className="h-16"/> */}
              <img
                src={theme === "light" ? logoLight : logoDark}
                className="h-16"
                alt="Culinaire"
              />
              <span
                className="mt-2 inline-block bg-clip-text font-bold text-xl text-transparent uppercase"
                style={{
                  background: "var(--gradient-logo)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Culinaire
              </span>
              <span className="text-sm">Elevated home cooking</span>
            </div>
            <p className="text-sm text-(--text-muted)">
              Fine-dining recipes by professional chefs, designed for home
              kitchens.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-medium">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  to="/recipes"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  Recipes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chefs"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  Chefs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  About Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 font-medium">Account</h4>
            <ul className="space-y-2 text-sm">
              {user?.roles?.some((role) => role === "user") && (
                <li>
                  <NavLink
                    to="/dashboard/favorites"
                    className="text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    Favorites
                  </NavLink>
                </li>
              )}
              {user?.roles?.some((role) => role === "user") && (
                <li>
                  <NavLink
                    to="/dashboard/my-profile"
                    className="text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    My profile
                  </NavLink>
                </li>
              )}
              {user && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    Log out
                  </button>
                </li>
              )}
              {!user && (
                <li>
                  <NavLink
                    to="/login"
                    className="text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    Log in
                  </NavLink>
                </li>
              )}
              {!user && (
                <li>
                  <NavLink
                    to="/register"
                    className="text-(--accent-olive) hover:text-(--accent-wine)"
                  >
                    Register
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  to="/privacy"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  Terms of Use
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-black/10 pt-6 text-center text-sm text-(--text-muted)">
          © 2026 Culinaire. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
