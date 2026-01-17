function OrtofotoParameters({
  parameters,
  onParametersChange,
}: {
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">Parametry ortofotomapy</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            GSD (cm/px): {parameters.gsd || 5} cm
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={parameters.gsd || 5}
            onChange={(e) => updateParameter("gsd", parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 cm</span>
            <span>10 cm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Dokładność (cm): {parameters.accuracy || 10} cm
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={parameters.accuracy || 10}
            onChange={(e) =>
              updateParameter("accuracy", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 cm</span>
            <span>20 cm</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.rtkReceiver || false}
            onChange={(e) => updateParameter("rtkReceiver", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Odbiornik RTK</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.photoPositioning || false}
            onChange={(e) =>
              updateParameter("photoPositioning", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Pozycjonowanie zdjęć</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.groundDetails || false}
            onChange={(e) => updateParameter("groundDetails", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Szczegóły na ziemi</span>
        </label>
      </div>
    </div>
  );
}

function TerrainParameters({
  parameters,
  onParametersChange,
}: {
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry modelu terenu
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Rozdzielczość (cm): {parameters.resolution || 25} cm
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={parameters.resolution || 25}
            onChange={(e) =>
              updateParameter("resolution", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 cm</span>
            <span>50 cm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format wyjściowy
          </label>
          <select
            value={parameters.outputFormat || "GeoTIFF"}
            onChange={(e) => updateParameter("outputFormat", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8"
          >
            <option>GeoTIFF</option>
            <option>ASCII Grid</option>
            <option>XYZ</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.vegetationFiltering || false}
            onChange={(e) =>
              updateParameter("vegetationFiltering", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Filtracja roślinności</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.surfaceSmoothing || false}
            onChange={(e) =>
              updateParameter("surfaceSmoothing", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Wygładzanie powierzchni</span>
        </label>
      </div>
    </div>
  );
}

function PointcloudParameters({
  parameters,
  onParametersChange,
}: {
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry chmury punktów
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Gęstość punktów (pkt/m²): {parameters.pointDensity || 500}
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            value={parameters.pointDensity || 500}
            onChange={(e) =>
              updateParameter("pointDensity", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>100</span>
            <span>1000</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format pliku
          </label>
          <select
            value={parameters.fileFormat || "LAS"}
            onChange={(e) => updateParameter("fileFormat", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8"
          >
            <option>LAS</option>
            <option>LAZ</option>
            <option>PLY</option>
            <option>XYZ</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.pointClassification || false}
            onChange={(e) =>
              updateParameter("pointClassification", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Klasyfikacja punktów</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.rgbColoring || false}
            onChange={(e) => updateParameter("rgbColoring", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Kolorowanie RGB</span>
        </label>
      </div>
    </div>
  );
}

function ThreeDParameters({
  parameters,
  onParametersChange,
}: {
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">Parametry modelu 3D</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Jakość tekstur
          </label>
          <select
            value={parameters.textureQuality || "Wysoka (4K)"}
            onChange={(e) => updateParameter("textureQuality", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8"
          >
            <option>Wysoka (4K)</option>
            <option>Średnia (2K)</option>
            <option>Niska (1K)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Format modelu
          </label>
          <select
            value={parameters.modelFormat || "OBJ"}
            onChange={(e) => updateParameter("modelFormat", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-8"
          >
            <option>OBJ</option>
            <option>PLY</option>
            <option>FBX</option>
            <option>GLTF</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.meshOptimization || false}
            onChange={(e) =>
              updateParameter("meshOptimization", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Optymalizacja siatki</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.animations360 || false}
            onChange={(e) => updateParameter("animations360", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Animacje 360°</span>
        </label>
      </div>
    </div>
  );
}

function LaserParameters({
  parameters,
  onParametersChange,
}: {
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">
        Parametry skaningu laserowego
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Dokładność (mm): {parameters.accuracy || 5} mm
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={parameters.accuracy || 5}
            onChange={(e) =>
              updateParameter("accuracy", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 mm</span>
            <span>10 mm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Zasięg skanowania (m): {parameters.scanningRange || 275} m
          </label>
          <input
            type="range"
            min="50"
            max="500"
            value={parameters.scanningRange || 275}
            onChange={(e) =>
              updateParameter("scanningRange", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50 m</span>
            <span>500 m</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.multiStationScanning || false}
            onChange={(e) =>
              updateParameter("multiStationScanning", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            Skanowanie wielostanowiskowe
          </span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={parameters.automaticRegistration || false}
            onChange={(e) =>
              updateParameter("automaticRegistration", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            Rejestracja automatyczna
          </span>
        </label>
      </div>
    </div>
  );
}

export default function ServiceParameters({
  service,
  parameters,
  onParametersChange,
}: {
  service: string;
  parameters: any;
  onParametersChange: (params: any) => void;
}) {
  if (service === "Ortofotomapa") {
    return (
      <OrtofotoParameters
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    );
  } else if (service === "Numeryczne Modele Terenu") {
    return (
      <TerrainParameters
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    );
  } else if (service === "Chmura Punktów") {
    return (
      <PointcloudParameters
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    );
  } else if (service === "Modele 3D") {
    return (
      <ThreeDParameters
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    );
  } else if (service === "Scanning Laserowy") {
    return (
      <LaserParameters
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    );
  }

  return null;
}
