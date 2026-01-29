import { NavLink } from "react-router";

import logoLight from "../assets/images/logo-light.svg";

const Footer = () => {
  return (
    <footer className="mt-24 bg-[var(--bg-footer)]">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-4 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex flex-col items-start font-[Philosopher]">
              <img src={logoLight} alt="Culinaire" className="h-16" />
              <span
                className="mt-2 inline-block bg-clip-text font-bold text-transparent uppercase"
                style={{
                  background: "var(--gradient-logo)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Culinaire
              </span>
              <span className="text-sm">Elevated home cooking</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Fine-dining recipes by professional chefs, designed for home
              kitchens.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-medium">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/recipes" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Recipes</NavLink>
              </li>
              <li>
                <NavLink to="/chefs" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Chefs</NavLink>
              </li>
              <li>
                <NavLink to="/about" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>About Us</NavLink>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 font-medium">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/login" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Login</NavLink>
              </li>
              <li>
                <NavLink to="/register" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Register</NavLink>
              </li>
              <li>
                <NavLink to="/favourites" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Favourites</NavLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/privacy" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/terms" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Terms of Use</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className='text-[var(--accent-olive)] hover:text-[var(--accent-wine)]'>Contact</NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-black/10 pt-6 text-center text-sm text-[var(--text-muted)]">
          © 2026 Culinaire. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
