import { useState, useEffect } from "react";
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
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="Droneo"
                className="h-50 object-contain object-center translate-y-3 -translate-x-1 cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {!user && (
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Strona Główna
              </a>
            )}
            {user && user.roles.includes(Roles.ADMIN) && (
              <a
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Panel Admina
              </a>
            )}
            {user && user.roles.includes(Roles.OPERATOR) && (
              <>
                <a
                  href="/operator/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Panel Operatora
                </a>
                <a
                  href="/client/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Panel Zleceniodawcy
                </a>
                <a
                  href="/operator/calendar"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Kalendarz
                </a>
                <a
                  href="/operator/professional-profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profil Zawodowy
                </a>
              </>
            )}
            {user &&
              user.roles.includes(Roles.CLIENT) &&
              !user.roles.includes(Roles.OPERATOR) && (
                <>
                  <a
                    href="/client/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Panel Zleceniodawcy
                  </a>
                  <a
                    href="/client/calendar"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Kalendarz
                  </a>
                </>
              )}
            {!user && (
              <a
                href="/#kontakt"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Kontakt
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
                    <Link
                      to="/change-password"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-lock-password-line mr-2"></i>
                      Zmień hasło
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
