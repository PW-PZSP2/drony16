import { useState } from "react";

import Button from "../components/base/Button/Button";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<"create" | "select" | "completed">(
    "create",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel Zleceniodawcy
          </h1>
          <p className="text-gray-600">
            Zarządzaj swoimi zleceniami i znajdź najlepszych operatorów
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("create")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-add-circle-line mr-2"></i>
                Utwórz Zlecenie
              </button>
              <button
                onClick={() => setActiveTab("select")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "select"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-user-search-line mr-2"></i>
                Wybierz Operatora
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "completed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-check-double-line mr-2"></i>
                Pozostałe Zlecenia
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "create" && <CreateOrderTab />}
            {activeTab === "select" && <SelectOperatorTab />}
            {activeTab === "completed" && <CompletedOrdersTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateOrderTab() {
  const [formData, setFormData] = useState({
    title: "",
    service: "",
    description: "",
    location: "",
    deadlineType: "flight", // 'flight' lub 'completion'
    deadline: "",
    parameters: {} as any,
  });

  const services = [
    { id: "ortofoto", name: "Ortofotomapa", icon: "ri-map-2-line" },
    {
      id: "terrain",
      name: "Numeryczne modele terenu",
      icon: "ri-landscape-line",
    },
    { id: "pointcloud", name: "Chmura punktów", icon: "ri-bubble-chart-line" },
    { id: "3d", name: "Modele 3D", icon: "ri-3d-view-line" },
    { id: "laser", name: "Scanning laserowy", icon: "ri-scanner-line" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Zlecenie zostało utworzone pomyślnie!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł zlecenia
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="np. Ortofotomapa działki budowlanej"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ terminu
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="deadlineType"
                value="flight"
                checked={formData.deadlineType === "flight"}
                onChange={(e) =>
                  setFormData({ ...formData, deadlineType: e.target.value })
                }
                className="mr-2"
              />
              <span className="text-sm">Termin nalotu</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deadlineType"
                value="completion"
                checked={formData.deadlineType === "completion"}
                onChange={(e) =>
                  setFormData({ ...formData, deadlineType: e.target.value })
                }
                className="mr-2"
              />
              <span className="text-sm">Termin zakończenia</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rodzaj usługi
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((service) => (
            <label
              key={service.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.service === service.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={formData.service === service.id}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="sr-only"
              />
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <i
                  className={`${service.icon} text-lg ${
                    formData.service === service.id
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                ></i>
              </div>
              <span
                className={`text-sm font-medium ${
                  formData.service === service.id
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {service.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lokalizacja
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Wpisz adres lub współrzędne"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="ri-map-pin-line"></i>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Kliknij ikonę mapy aby wybrać lokalizację na mapie
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.deadlineType === "flight"
            ? "Termin nalotu"
            : "Termin zakończenia"}
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opis zlecenia
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Opisz szczegóły zlecenia, wymagania techniczne, oczekiwania..."
          required
        />
      </div>

      {formData.service && <ServiceParameters service={formData.service} />}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">
          Zapisz jako szkic
        </Button>
        <Button type="submit">Opublikuj zlecenie</Button>
      </div>
    </form>
  );
}

function ServiceParameters({ service }: { service: string }) {
  if (service === "ortofoto") {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-4">
          Parametry ortofotomapy
        </h4>
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

  if (service === "terrain") {
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
            <span className="text-sm text-gray-700">
              Wygładzanie powierzchni
            </span>
          </label>
        </div>
      </div>
    );
  }

  if (service === "pointcloud") {
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

  if (service === "3d") {
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

  if (service === "laser") {
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

  return null;
}

function SelectOperatorTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const pendingOrders = [
    {
      id: 1,
      title: "Ortofotomapa działki budowlanej",
      service: "Ortofotomapa",
      location: "Warszawa, ul. Przykładowa 123",
      deadline: "2024-02-15",
      deadlineType: "flight",
      applicants: 3,
    },
    {
      id: 2,
      title: "Model 3D budynku",
      service: "Modele 3D",
      location: "Kraków, ul. Testowa 45",
      deadline: "2024-02-20",
      deadlineType: "completion",
      applicants: 1,
    },
    {
      id: 3,
      title: "Chmura punktów terenu przemysłowego",
      service: "Chmura punktów",
      location: "Gdańsk, ul. Portowa 67",
      deadline: "2024-02-25",
      deadlineType: "flight",
      applicants: 5,
    },
  ];

  if (selectedOrder) {
    return (
      <OrderDetails
        orderId={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Zlecenia oczekujące na wybór operatora
        </h3>
        <p className="text-gray-600">
          Wybierz najlepszego operatora spośród zgłoszeń do Twoich zleceń
        </p>
      </div>

      {pendingOrders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {order.title}
              </h3>
              <p className="text-sm text-gray-600">{order.service}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Oczekuje wyboru
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              {order.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-calendar-line mr-2"></i>
              {order.deadlineType === "flight"
                ? "Nalot do: "
                : "Zakończenie do: "}
              {order.deadline}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <i className="ri-user-line mr-1"></i>
              {order.applicants} zgłoszeń operatorów
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order.id)}
              >
                Zobacz szczegóły
              </Button>
              <Button size="sm" onClick={() => setSelectedOrder(order.id)}>
                Wybierz operatora
              </Button>
            </div>
          </div>
        </div>
      ))}

      {pendingOrders.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-search-line text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Brak zleceń oczekujących
          </h3>
          <p className="text-gray-500">
            Wszystkie Twoje zlecenia mają już wybranych operatorów lub nie mają
            jeszcze zgłoszeń.
          </p>
        </div>
      )}
    </div>
  );
}

function CompletedOrdersTab() {
  const [showRatingModal, setShowRatingModal] = useState<number | null>(null);

  const completedOrders = [
    {
      id: 3,
      title: "Inspekcja dachu",
      service: "Inspekcje",
      location: "Gdańsk, ul. Morska 67",
      completedDate: "2024-01-15",
      operator: "SkyTech Drones",
      rating: 0,
    },
    {
      id: 4,
      title: "Chmura punktów terenu",
      service: "Chmura punktów",
      location: "Wrocław, ul. Polna 89",
      completedDate: "2024-01-10",
      operator: "AerialPro",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-4">
      {completedOrders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {order.title}
              </h3>
              <p className="text-sm text-gray-600">{order.service}</p>
              <p className="text-sm text-gray-500">
                Wykonane przez: {order.operator}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Zakończone
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              {order.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-calendar-check-line mr-2"></i>
              {order.completedDate}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {order.rating > 0 ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    Twoja ocena:
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`ri-star-${star <= order.rating ? "fill" : "line"} text-yellow-400`}
                      ></i>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-orange-600">
                  Oczekuje na ocenę
                </span>
              )}
            </div>
            <div className="space-x-2">
              {order.rating === 0 && (
                <Button size="sm" onClick={() => setShowRatingModal(order.id)}>
                  Oceń pracę
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {showRatingModal && (
        <RatingModal
          orderId={showRatingModal}
          onClose={() => setShowRatingModal(null)}
        />
      )}
    </div>
  );
}

function OrderDetails({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const order = {
    id: orderId,
    title: "Ortofotomapa działki budowlanej",
    service: "Ortofotomapa",
    description:
      "Potrzebuję wykonania ortofotomapy działki budowlanej o powierzchni około 2 hektarów. Zlecenie obejmuje nalot dronem oraz opracowanie ortofotomapy w rozdzielczości 2 cm/px.",
    location: "Warszawa, ul. Przykładowa 123",
    deadline: "2024-02-15",
    deadlineType: "flight",
    createdDate: "2024-01-20",
    applicants: [
      {
        id: 1,
        name: "SkyTech Drones",
        rating: 4.8,
        completedJobs: 156,
        description:
          "Specjalizujemy się w ortofotomapach wysokiej jakości. Posiadamy najnowszy sprzęt i doświadczenie w projektach budowlanych.",
        equipment: ["DJI Phantom 4 RTK", "Odbiornik RTK", "Pix4D"],
      },
      {
        id: 2,
        name: "AerialPro",
        rating: 4.9,
        completedJobs: 203,
        description:
          "Oferujemy kompleksowe usługi fotogrametryczne z gwarancją jakości i terminowości.",
        equipment: ["DJI Matrice 300", "Zenmuse P1", "Agisoft Metashape"],
      },
      {
        id: 3,
        name: "DroneMapping",
        rating: 4.7,
        completedJobs: 89,
        description:
          "Młody zespół z pasją do nowoczesnych technologii mapowania.",
        equipment: ["DJI Mini 3 Pro", "Ground Station Pro"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Powrót do listy
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{order.title}</h2>
            <p className="text-gray-600">{order.service}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Oczekuje wyboru
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Szczegóły zlecenia
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <i className="ri-map-pin-line mr-2"></i>
                {order.location}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-line mr-2"></i>
                {order.deadlineType === "flight"
                  ? "Nalot do: "
                  : "Zakończenie do: "}
                {order.deadline}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-check-line mr-2"></i>
                Utworzono: {order.createdDate}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Opis</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-4">
            Zgłoszenia operatorów ({order.applicants.length})
          </h4>
          <div className="space-y-4">
            {order.applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {applicant.name}
                    </h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        {applicant.rating}
                      </div>
                      <span>{applicant.completedJobs} zleceń</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {applicant.description}
                </p>

                <div className="mb-4">
                  <h6 className="text-xs font-medium text-gray-700 mb-2">
                    Sprzęt:
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {applicant.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Zobacz profil
                  </Button>
                  <Button size="sm">Wybierz operatora</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingModal({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completed === null) {
      alert("Proszę wybrać czy zlecenie zostało wykonane");
      return;
    }
    alert("Ocena została zapisana!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Oceń wykonaną pracę
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status zlecenia
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={completed === true}
                  onChange={() => setCompleted(true)}
                  className="mr-2"
                />
                <span className="text-sm">Zostało wykonane</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={completed === false}
                  onChange={() => setCompleted(false)}
                  className="mr-2"
                />
                <span className="text-sm">Nie zostało wykonane</span>
              </label>
            </div>
          </div>

          {completed && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocena (1-5 gwiazdek)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <i className="ri-star-fill"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentarz (opcjonalnie)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Podziel się swoją opinią o wykonanej pracy..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 znaków
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={completed === null || (completed && rating === 0)}
            >
              Zapisz ocenę
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
