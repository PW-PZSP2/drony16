import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

export function buildRouter() {
    
    return createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorPage />,

            children: [
                {
                    index: true, element: <HomePage />
                },
                {
                    path: "client",
                    loader: clientProtectedLoader,
                    children: [
                        {
                            path: "dashboard",
                            element: <div>Client Dashboard</div>
                        }
                    ] 
                },
                {
                    path: "operator",
                    loader: operatorProtectedLoader,
                    children: [
                        {
                            path: "dashboard",
                            element: <div>Operator Dashboard</div>
                        }
                    ] 
                },
                {
                    path: "admin",
                    loader: adminProtectedLoader,   
                    children: [
                        {
                            path: "dashboard",
                            element: <div>Admin Dashboard</div>
                        }
                    ] 
                }


            ]
        },
        {
            path: "/login",
            element: <LoginPage />
        }

    ]);
}

async function clientProtectedLoader() {    
    return
}

async function operatorProtectedLoader() {
    return
}

async function adminProtectedLoader() {
    return
}