
import { useState } from 'react';
import Header from '../components/feature/header/BaseHeader';
import LoginModal from '../components/feature/auth/LoginModal';
import RegisterModal from '../components/feature/auth/RegisterModal';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleFindOperator = () => {
    setShowLogin(true);
  };

  const handleBecomeOperator = () => {
    setShowRegister(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogin = (userData: any) => {
    setShowLogin(false);
    // Przekierowanie jest już obsługiwane w LoginModal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%20aerial%20photography%20and%20surveying%20with%20modern%20drones%20flying%20over%20diverse%20landscapes%20including%20fields%2C%20construction%20sites%2C%20and%20urban%20areas%2C%20captured%20from%20drone%20perspective%20with%20clear%20blue%20sky%20background%2C%20high-tech%20equipment%2C%20commercial%20drone%20operations%2C%20photogrammetry%20and%20mapping%20services%2C%20professional%20aerial%20work%20documentation&width=1200&height=600&seq=hero-drones&orientation=landscape')`
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="w-full">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Połącz się z <span className="text-green-400">profesjonalnymi</span> operatorami dronów
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Platforma łącząca zleceniodawców potrzebujących usług dronowych z doświadczonymi operatorami. 
                Ortofotomapy, modele 3D, inspekcje i wiele więcej.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleFindOperator}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Znajdź Operatora
                </button>
                <button 
                  onClick={handleBecomeOperator}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zostań Operatorem
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://readdy.ai/api/search-image?query=Modern%20professional%20drone%20equipment%20setup%20with%20multiple%20quadcopter%20drones%2C%20camera%20gimbals%2C%20and%20surveying%20equipment%20arranged%20on%20clean%20white%20background%2C%20commercial%20grade%20UAV%20technology%2C%20aerial%20photography%20and%20mapping%20tools%2C%20professional%20drone%20operator%20workspace%2C%20high-tech%20aviation%20equipment%20display&width=600&height=500&seq=drone-equipment&orientation=portrait"
                alt="Profesjonalne drony"
                className="w-full h-96 object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dostępne Usługi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Szeroka gama profesjonalnych usług dronowych wykonywanych przez certyfikowanych operatorów
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-map-2-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Ortofotomapa</h3>
              <p className="text-gray-600">
                Wysokiej jakości mapy ortofotograficzne z precyzyjnym pozycjonowaniem i szczegółowością GSD
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-landscape-line text-green-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Numeryczne Modele Terenu</h3>
              <p className="text-gray-600">
                Tworzenie dokładnych modeli wysokościowych terenu (NMPT, NMT) z wykorzystaniem najnowszych technologii
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-bubble-chart-line text-gray-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Chmura Punktów</h3>
              <p className="text-gray-600">
                Generowanie gęstych chmur punktów z możliwością klasyfikacji i kolorowania
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-3d-view-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Modele 3D</h3>
              <p className="text-gray-600">
                Fotorealistyczne modele 3D obiektów i terenów z wysoką dokładnością geometryczną
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-scanner-line text-green-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Scanning Laserowy</h3>
              <p className="text-gray-600">
                Precyzyjne pomiary laserowe z generowaniem chmur punktów i modeli 3D
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-camera-line text-gray-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Inspekcje</h3>
              <p className="text-gray-600">
                Profesjonalne inspekcje infrastruktury, budynków i instalacji przemysłowych
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Jak to działa?</h2>
            <p className="text-lg text-gray-600">Prosty proces od zlecenia do realizacji</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Utwórz Zlecenie</h3>
              <p className="text-gray-600">
                Opisz swoje potrzeby, wybierz usługę i parametry, wskaż lokalizację i termin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Wybierz Operatora</h3>
              <p className="text-gray-600">
                Operatorzy z Twojej okolicy zgłoszą się do zlecenia. Sprawdź ich profile i wybierz najlepszego
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Odbierz Wyniki</h3>
              <p className="text-gray-600">
                Operator wykona usługę i dostarczy wyniki zgodnie z Twoimi wymaganiami
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Gotowy na start?</h2>
          <p className="text-xl mb-8 text-green-100">
            Dołącz do naszej platformy już dziś i skorzystaj z profesjonalnych usług dronowych
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleFindOperator}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Utwórz Zlecenie
            </button>
            <button 
              onClick={handleBecomeOperator}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Zostań Operatorem
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{fontFamily: '"Pacifico", serif'}}>logo</h3>
              <p className="text-gray-300">
                Platforma łącząca zleceniodawców z profesjonalnymi operatorami dronów
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Usługi</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Ortofotomapa</li>
                <li>Modele 3D</li>
                <li>Chmura punktów</li>
                <li>Inspekcje</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dla Użytkowników</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Zleceniodawcy</li>
                <li>Operatorzy</li>
                <li>Cennik</li>
                <li>Pomoc</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-300">
                <li>kontakt@droneplatform.pl</li>
                <li>+48 600 123 456</li>
                <li>Warszawa, Polska</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Drone Platform. Wszystkie prawa zastrzeżone. 
              <a href="https://readdy.ai/?origin=logo" className="ml-2 text-blue-400 hover:text-blue-300">
                Website Builder
              </a>
            </p>
          </div>
        </div>
      </footer>

      <LoginModal 
        show={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onSwitchToRegister={openRegister}
      />
      
      <RegisterModal 
        show={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}
