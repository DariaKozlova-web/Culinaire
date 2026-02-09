import useAuth from "@/contexts/useAuth";
import { useTheme } from "../contexts/themeContext";
import logoDark from "../assets/images/logo-dark.svg";
import logoLight from "../assets/images/logo-light.svg";

export default function DashboardHome() {
  const { user } = useAuth();
   const { theme } = useTheme();

  const name = user?.name ? user.name : "there";
  const isAdmin = user?.roles?.includes("admin");

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
             <img
            src={theme === "light" ? `${logoLight}` : `${logoDark}`}
            alt="Culinaire"
            className="dashboard-logo mb-8 w-44 md:w-56"
            draggable={false}
          />
          
          <h1 className="text-3xl font-semibold text-(--text-title) md:text-4xl">
            Welcome to Culinaire{user ? `, ${name}` : ""}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-(--text-muted) md:text-base">
            {isAdmin
              ? "You can manage recipes, chefs and categories from the sidebar."
              : "You can manage your profile and favourites from the sidebar."}
          </p>
        </div>
      </div>
    </div>
  );
}