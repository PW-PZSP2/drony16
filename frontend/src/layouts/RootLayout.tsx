import { Outlet, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useEffect } from "react";
import Header from "../components/feature/header/BaseHeader";
import Footer from "../components/feature/footer/BaseFooter";

export default function RootLayout(): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
