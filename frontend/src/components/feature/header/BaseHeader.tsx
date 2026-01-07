import { useState, useEffect } from "react";
import { Drone } from "lucide-react";
import type { JSX } from "react";
// import type {User} from '../../../types/auth/user';
import {
  useAuthorizationStore,
  useGetUser,
} from "../../../store/authorization";
import { Roles } from "../../../types/auth/user_role";
import { Link } from "react-router-dom";
import { AuthService } from "../../../services/authorization_service";

export default function Header(): JSX.Element {
  const user = useGetUser();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const { actions } = useAuthorizationStore();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();
      actions.setUser(currentUser || undefined);
    };
    checkAuth();
  }, [actions]);

  const getDashboardLink = () => {
    if (!user) return "/";

    if (user.roles.includes(Roles.ADMIN)) {
      return "/admin/dashboard";
    }
    if (user.roles.includes(Roles.OPERATOR)) {
      return "/operator/dashboard";
    }
    if (user.roles.includes(Roles.CLIENT)) {
      return "/client/dashboard";
    }
    return "/";
  };

  const getDashboardLabel = () => {
    if (!user) return "";

    if (user.roles.includes(Roles.ADMIN)) {
      return "Panel Admina";
    }
    if (user.roles.includes(Roles.OPERATOR)) {
      return "Panel Operatora";
    }
    if (user.roles.includes(Roles.CLIENT)) {
      return "Panel Zleceniodawcy";
    }
    return "";
  };

  const getProfileLink = () => {
    if (!user) return "/";
    if (user.roles.includes(Roles.OPERATOR)) return "/operator/profile";
    if (user.roles.includes(Roles.CLIENT)) return "/client/profile";
    if (user.roles.includes(Roles.ADMIN)) return "/admin/profile";
    return "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2 self-center font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white">
                <Drone className="size-4" />
              </div>
              <span className="text-xl">Droneo</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {!user ? (
              <>
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Strona Główna
                </a>
                <a
                  href="#kontakt"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Kontakt
                </a>
              </>
            ) : (
              <a
                href={getDashboardLink()}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {getDashboardLabel()}
              </a>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>Witaj, {user.user_name}</span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to={getProfileLink()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-user-line mr-2"></i>
                      Mój Profil
                    </Link>
                    <button
                      onClick={() => {
                        window.location.href = "/logout";
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login?action=login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/login?action=register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
