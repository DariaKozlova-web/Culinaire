import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-(--bg-main) text-(--text-body)">
      {/* Scroll always to top on route change */}
      <ScrollToTop />

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        theme="colored"
      />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer always at the bottom */}
      <Footer />
    </div>
  );
}