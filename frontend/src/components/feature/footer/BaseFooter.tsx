import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer id="kontakt" className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: '"Pacifico", serif' }}
            >
              logo
            </h3>
            <p className="text-gray-300">
              Platforma łącząca zleceniodawców z profesjonalnymi operatorami
              dronów
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
          <p>
            &copy; 2024 Drone Platform. Wszystkie prawa zastrzeżone.
            <a
              href="https://readdy.ai/?origin=logo"
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Website Builder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
