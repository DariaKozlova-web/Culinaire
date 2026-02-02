import { NavLink } from "react-router";

const adminMenu = [
  { label: "All categories", to: "categories" },
  { label: "All chefs", to: "chefs" },
  { label: "All recipes", to: "recipes" },
  { label: "Create category", to: "create-category" },
  { label: "Create chef", to: "create-chef" },
  { label: "Create recipe", to: "create-recipe" },
];

const userMenu = [
  { label: "My profile", to: "my-profile" },
  { label: "Favourites", to: "favourites" },
];

const DashboardSidebar = () => {
  const isAdmin = true;
  const isUser = true;

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-6">
        {isAdmin && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
              Admin
            </p>

            <ul className="space-y-1">
              {adminMenu.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-(--accent-olive) text-white"
                          : "text-(--text-muted) hover:text-(--accent-wine)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isUser && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
              Account
            </p>

            <ul className="space-y-1">
              {userMenu.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-(--accent-olive) text-white"
                          : "text-(--text-muted) hover:text-(--accent-wine)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;