import { Outlet } from "react-router-dom"
import { JSX } from "react/jsx-runtime";

export default function RootLayout (): JSX.Element {
    return (
        <>
            <h1>Topbar</h1>
            <Outlet />
            <footer>Footer</footer>
        </>

    );
}