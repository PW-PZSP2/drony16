import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AuthService } from "./services/authorization_service";
import { Roles } from "./types/auth/user_role";
import LogoutPage from "./pages/LogoutPage";
import ClientDashboard from "./pages/ClientDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CalendarPage from "./pages/CalendarPage";

export function buildRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,

      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "client",
          loader: clientProtectedLoader,
          children: [
            {
              path: "dashboard",
              element: <ClientDashboard />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "calendar",
              element: <CalendarPage />,
            },
          ],
        },
        {
          path: "operator",
          loader: operatorProtectedLoader,
          children: [
            {
              path: "dashboard",
              element: <OperatorDashboard />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "calendar",
              element: <CalendarPage />,
            },
          ],
        },
        {
          path: "admin",
          loader: adminProtectedLoader,
          children: [
            {
              path: "dashboard",
              element: <AdminDashboard />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/logout",
      element: <LogoutPage />,
    },
    {
      path: "/change-password",
      element: <ChangePasswordPage />,
    },
  ]);
}

async function clientProtectedLoader() {
  const current_user = await AuthService.getCurrentUser();
  if (
    !current_user ||
    !current_user.roles.includes(Roles.OPERATOR) ||
    current_user.roles.includes(Roles.CLIENT)
  ) {
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
