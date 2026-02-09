import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar";
import { ChevronLeftIcon } from "../components/icons/ChevronLeftIcon";
import { CloseIcon } from "../components/icons/CloseIcon";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      {/* Mobile arrow (OVER content, no padding) */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="
          fixed left-3 top-24 z-80
          inline-flex h-10 w-10 items-center justify-center
          rounded-xl border border-(--accent-olive)
          bg-(--bg-main)/80 text-(--accent-olive)
          shadow-sm backdrop-blur
          transition-colors active:scale-[0.98]
          hover:border-(--accent-wine) hover:text-(--accent-wine)
          lg:hidden
        "
        aria-label="Open dashboard menu"
        title="Menu"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Content: no extra padding */}
        <section className="flex-1">
          <Outlet />
        </section>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-90 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard menu"
          />

          <div className="absolute left-0 top-0 h-full w-[86%] max-w-[320px] bg-(--bg-main) p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium uppercase text-(--text-title)">
                Menu
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="
                  inline-flex h-10 w-10 items-center justify-center
                  rounded-xl border border-(--accent-olive)
                  text-(--accent-olive)
                  transition-colors active:scale-[0.98]
                  hover:border-(--accent-wine) hover:text-(--accent-wine)
                "
                aria-label="Close menu"
                title="Close"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;