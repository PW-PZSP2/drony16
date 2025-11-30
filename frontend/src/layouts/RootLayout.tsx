import { Outlet } from "react-router-dom"
import type { JSX } from "react";
import Header from "../components/feature/header/BaseHeader";
import Footer from "../components/feature/footer/BaseFooter";

export default function RootLayout (): JSX.Element {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>

    );
}