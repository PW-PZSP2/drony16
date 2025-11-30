import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import {AuthService} from "./services/authorization_service";
import { Roles } from "./types/auth/user_role";
import LogoutPage from "./pages/LogoutPage";

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
        },
        {
            path: "/logout",
            element: <LogoutPage />
        }

    ]);
}

async function clientProtectedLoader() {    
    const current_user = await AuthService.getCurrentUser();
    if (!current_user || !current_user.roles.includes(Roles.CLIENT)) {
        throw new Response("Unauthorized", { status: 401 });
    }

}

async function operatorProtectedLoader() {
    const current_user = await AuthService.getCurrentUser();
    if (!current_user || !current_user.roles.includes(Roles.OPERATOR)) {
        throw new Response("Unauthorized", { status: 401 });
    }
}

async function adminProtectedLoader() {
    const current_user = await AuthService.getCurrentUser();
    if (!current_user || !current_user.roles.includes(Roles.ADMIN)) {
        throw new Response("Unauthorized", { status: 401 });
    }
}