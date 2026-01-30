import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

export default function MainLayout() {
  return (
    <>
      <ToastContainer position="bottom-left" autoClose={1500} theme="colored" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
