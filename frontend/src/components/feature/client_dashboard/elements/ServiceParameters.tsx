function OrtofotoParameters() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">Parametry ortofotomapy</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            GSD (cm/px)
          </label>
          <input type="range" min="1" max="10" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 cm</span>
            <span>10 cm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Dokładność (cm)
          </label>
          <input type="range" min="1" max="20" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 cm</span>
            <span>20 cm</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Odbiornik RTK</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Pozycjonowanie zdjęć</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Szczegóły na ziemi</span>
        </label>
      </div>
    </div>
  );
}

function TerrainParameters() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry modelu terenu
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Rozdzielczość (cm)
          </label>
          <input type="range" min="5" max="50" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 cm</span>
            <span>50 cm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format wyjściowy
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8">
            <option>GeoTIFF</option>
            <option>ASCII Grid</option>
            <option>XYZ</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Filtracja roślinności</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Wygładzanie powierzchni</span>
        </label>
      </div>
    </div>
  );
}

function PointcloudParameters() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry chmury punktów
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Gęstość punktów (pkt/m²)
          </label>
          <input type="range" min="100" max="1000" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>100</span>
            <span>1000</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format pliku
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8">
            <option>LAS</option>
            <option>LAZ</option>
            <option>PLY</option>
            <option>XYZ</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Klasyfikacja punktów</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Kolorowanie RGB</span>
        </label>
      </div>
    </div>
  );
}

function ThreeDParameters() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">Parametry modelu 3D</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Jakość tekstur
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8">
            <option>Wysoka (4K)</option>
            <option>Średnia (2K)</option>
            <option>Niska (1K)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format modelu
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8">
            <option>OBJ</option>
            <option>PLY</option>
            <option>FBX</option>
            <option>GLTF</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Optymalizacja siatki</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Animacje 360°</span>
        </label>
      </div>
    </div>
  );
}

function LaserParameters() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry skaningu laserowego
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Dokładność (mm)
          </label>
          <input type="range" min="1" max="10" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 mm</span>
            <span>10 mm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Zasięg skanowania (m)
          </label>
          <input type="range" min="50" max="500" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50 m</span>
            <span>500 m</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">
            Skanowanie wielostanowiskowe
          </span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">
            Rejestracja automatyczna
          </span>
        </label>
      </div>
    </div>
  );
}

export default function ServiceParameters({ service }: { service: string }) {
  if (service === "Ortofotomapa") {
    return <OrtofotoParameters />;
  } else if (service === "Numeryczne modele terenu") {
    return <TerrainParameters />;
  } else if (service === "Chmura Punktów") {
    return <PointcloudParameters />;
  } else if (service === "Modele 3D") {
    return <ThreeDParameters />;
  } else if (service === "Scanning laserowy") {
    return <LaserParameters />;
  }

  return null;
}
