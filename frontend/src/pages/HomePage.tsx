import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Mountain, Cuboid, ScanLine, Camera, Box } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleFindOperator = () => {
    navigate("/login?action=register&role=client");
  };

  const handleBecomeOperator = () => {
    navigate("/login?action=register&role=operator");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('../public/images/home_page1.jpg')`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="w-full">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Połącz się z{" "}
                <span className="text-green-400">profesjonalnymi</span>{" "}
                operatorami dronów
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Platforma łącząca zleceniodawców potrzebujących usług dronowych
                z doświadczonymi operatorami. Ortofotomapy, modele 3D, inspekcje
                i wiele więcej.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleFindOperator}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Znajdź Operatora
                </Button>
                <Button
                  onClick={handleBecomeOperator}
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zostań Operatorem
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="../public/images/home_page2.jpg"
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Dostępne Usługi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Szeroka gama profesjonalnych usług dronowych wykonywanych przez
              certyfikowanych operatorów
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Ortofotomapa
              </h3>
              <p className="text-gray-600">
                Wysokiej jakości mapy ortofotograficzne z precyzyjnym
                pozycjonowaniem i szczegółowością GSD
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Mountain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Numeryczne Modele Terenu
              </h3>
              <p className="text-gray-600">
                Tworzenie dokładnych modeli wysokościowych terenu (NMPT, NMT) z
                wykorzystaniem najnowszych technologii
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Chmura Punktów
              </h3>
              <p className="text-gray-600">
                Generowanie gęstych chmur punktów z możliwością klasyfikacji i
                kolorowania
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Cuboid className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Modele 3D
              </h3>
              <p className="text-gray-600">
                Fotorealistyczne modele 3D obiektów i terenów z wysoką
                dokładnością geometryczną
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ScanLine className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Scanning Laserowy
              </h3>
              <p className="text-gray-600">
                Precyzyjne pomiary laserowe z generowaniem chmur punktów i
                modeli 3D
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Inspekcje
              </h3>
              <p className="text-gray-600">
                Profesjonalne inspekcje infrastruktury, budynków i instalacji
                przemysłowych
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Jak to działa?
            </h2>
            <p className="text-lg text-gray-600">
              Prosty proces od zlecenia do realizacji
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Utwórz Zlecenie
              </h3>
              <p className="text-gray-600">
                Opisz swoje potrzeby, wybierz usługę i parametry, wskaż
                lokalizację i termin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Wybierz Operatora
              </h3>
              <p className="text-gray-600">
                Operatorzy z Twojej okolicy zgłoszą się do zlecenia. Sprawdź ich
                profile i wybierz najlepszego
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Odbierz Wyniki
              </h3>
              <p className="text-gray-600">
                Operator wykona usługę i dostarczy wyniki zgodnie z Twoimi
                wymaganiami
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
            Dołącz do naszej platformy już dziś i skorzystaj z profesjonalnych
            usług dronowych
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleFindOperator}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Utwórz Zlecenie
            </Button>
            <Button
              onClick={handleBecomeOperator}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Zostań Operatorem
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
