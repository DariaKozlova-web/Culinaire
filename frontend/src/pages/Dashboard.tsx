import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar";

const Dashboard = () => {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-12">
      <DashboardSidebar />

      <section className="flex-1 rounded-2xl bg-(--bg-main) p-8 shadow-sm">
        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;