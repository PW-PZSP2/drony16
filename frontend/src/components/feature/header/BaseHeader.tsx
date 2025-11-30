
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'operator' | 'admin';
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'client':
        return '/client-dashboard';
      case 'operator':
        return '/operator-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'client':
        return 'Panel Zleceniodawcy';
      case 'operator':
        return 'Panel Operatora';
      case 'admin':
        return 'Panel Admina';
      default:
        return '';
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.REACT_APP_NAVIGATE('/profile');
    setShowUserMenu(false);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.REACT_APP_NAVIGATE('/settings');
    setShowUserMenu(false);
  };

  const handleChangePasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.REACT_APP_NAVIGATE('/change-password');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600" style={{fontFamily: '"Pacifico", serif'}}>
              logo
            </a>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Strona Główna
            </a>
            {user && (
              <a 
                href={getDashboardLink()} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {getDashboardLabel()}
              </a>
            )}
            <a href="#kontakt" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Kontakt
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>Witaj, {user.name}</span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-user-line mr-2"></i>
                      Mój profil
                    </button>
                    <button
                      onClick={handleSettingsClick}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-settings-line mr-2"></i>
                      Ustawienia
                    </button>
                    <button
                      onClick={handleChangePasswordClick}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-lock-password-line mr-2"></i>
                      Zmiana hasła
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap cursor-pointer">
                  Zaloguj się
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
                  Zarejestruj się
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
