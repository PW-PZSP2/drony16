import { useState } from "react";
import Button from "../components/base/Button/Button";

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel Operatora
          </h1>
          <p className="text-gray-600">Zarządzaj zleceniami i swoim profilem</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Orders */}
          <div className="lg:col-span-2 space-y-6">
            <OrdersSection />
          </div>

          {/* Right Column - Profile */}
          <div className="lg:col-span-1">
            <OperatorProfile />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  const [activeTab, setActiveTab] = useState<"new" | "confirmed" | "history">(
    "new",
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab("new")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "new"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="ri-notification-line mr-2"></i>
            Nowe zlecenia
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "confirmed"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="ri-check-line mr-2"></i>
            Potwierdzone
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "history"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="ri-history-line mr-2"></i>
            Historia
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "new" && <NewOrdersTab />}
        {activeTab === "confirmed" && <ConfirmedOrdersTab />}
        {activeTab === "history" && <HistoryOrdersTab />}
      </div>
    </div>
  );
}

function NewOrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const newOrders = [
    {
      id: 1,
      title: "Ortofotomapa działki budowlanej",
      service: "Ortofotomapa",
      location: "Warszawa, ul. Przykładowa 123",
      distance: "15 km",
      deadline: "2024-02-15",
      client: "Jan Kowalski",
      description:
        "Potrzebuję ortofotomapy działki o powierzchni 2 ha z dokładnością 2 cm/px...",
    },
    {
      id: 2,
      title: "Inspekcja linii energetycznej",
      service: "Inspekcje",
      location: "Warszawa, ul. Energetyczna 45",
      distance: "8 km",
      deadline: "2024-02-18",
      client: "Energopol Sp. z o.o.",
      description:
        "Inspekcja 5 km linii wysokiego napięcia, dokumentacja fotograficzna...",
    },
  ];

  if (selectedOrder) {
    return (
      <OrderDetailsModal
        orderId={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Zlecenia w Twojej okolicy
        </h3>
        <span className="text-sm text-gray-500">
          {newOrders.length} dostępnych zleceń
        </span>
      </div>

      {newOrders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {order.title}
              </h4>
              <p className="text-sm text-gray-600">{order.service}</p>
              <p className="text-sm text-gray-500">
                Zleceniodawca: {order.client}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {order.distance} od Ciebie
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              {order.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-calendar-line mr-2"></i>
              Termin: {order.deadline}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {order.description}
          </p>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(order.id)}
            >
              Zobacz szczegóły
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <i className="ri-hand-heart-line mr-2"></i>
              Zgłoś się
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderDetailsModal({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const [showProposalSent, setShowProposalSent] = useState(false);

  const order = {
    id: orderId,
    title: "Ortofotomapa działki budowlanej",
    service: "Ortofotomapa",
    description:
      "Potrzebuję wykonania ortofotomapy działki budowlanej o powierzchni około 2 hektarów. Zlecenie obejmuje nalot dronem oraz opracowanie ortofotomapy w rozdzielczości 2 cm/px. Wymagana dokładność pozycjonowania to 5 cm. Teren jest płaski, bez przeszkód.",
    location: "Warszawa, ul. Przykładowa 123, 00-001 Warszawa",
    deadline: "2024-02-15",
    deadlineType: "flight",
    client: "Jan Kowalski",
    createdDate: "2024-01-20",
    distance: "15 km",
  };

  const handleAccept = () => {
    setShowProposalSent(true);
    setTimeout(() => {
      setShowProposalSent(false);
      onBack();
    }, 2000);
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

      {showProposalSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <i className="ri-check-circle-line text-green-600 mr-2"></i>
            <span className="text-green-800 font-medium">
              Propozycja została wysłana!
            </span>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{order.title}</h2>
            <p className="text-gray-600">{order.service}</p>
            <p className="text-sm text-gray-500">
              Zleceniodawca: {order.client}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Dostępne
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
                <i className="ri-route-line mr-2"></i>
                {order.distance} od Ciebie
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
            <h4 className="font-medium text-gray-800 mb-2">Opis zlecenia</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onBack}>
            Anuluj
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700"
          >
            <i className="ri-hand-heart-line mr-2"></i>
            Zgłoś się do zlecenia
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmedOrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showContact, setShowContact] = useState<number | null>(null);

  const confirmedOrders = [
    {
      id: 3,
      title: "Model 3D budynku",
      service: "Modele 3D",
      location: "Kraków, ul. Testowa 45, 30-001 Kraków",
      deadline: "2024-02-20",
      client: "Anna Nowak",
      clientEmail: "anna.nowak@email.com",
      clientPhone: "+48 600 123 456",
      status: "in_progress",
      confirmedDate: "2024-02-10",
    },
  ];

  if (selectedOrder) {
    return (
      <ConfirmedOrderDetails
        orderId={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Potwierdzone zlecenia (ostatnie 7 dni)
        </h3>
        <span className="text-sm text-gray-500">
          {confirmedOrders.length} aktywnych
        </span>
      </div>

      {confirmedOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="ri-inbox-line text-4xl mb-4"></i>
          <p>Brak potwierdzonych zleceń w ostatnich 7 dniach</p>
        </div>
      ) : (
        confirmedOrders.map((order) => (
          <div
            key={order.id}
            className="border border-green-200 bg-green-50 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {order.title}
                </h4>
                <p className="text-sm text-gray-600">{order.service}</p>
                <p className="text-sm text-gray-500">
                  Zleceniodawca: {order.client}
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Potwierdzone
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-map-pin-line mr-2"></i>
                {order.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-calendar-line mr-2"></i>
                Termin: {order.deadline}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-check-line mr-2"></i>
                Potwierdzone: {order.confirmedDate}
              </div>
            </div>

            {showContact === order.id && (
              <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">
                  Dane kontaktowe klienta:
                </h5>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <i className="ri-mail-line mr-2"></i>
                    <a
                      href={`mailto:${order.clientEmail}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {order.clientEmail}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="ri-phone-line mr-2"></i>
                    <a
                      href={`tel:${order.clientPhone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {order.clientPhone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowContact(showContact === order.id ? null : order.id)
                }
              >
                {showContact === order.id
                  ? "Ukryj kontakt"
                  : "Kontakt z klientem"}
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order.id)}
                >
                  Zobacz szczegóły
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ConfirmedOrderDetails({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const order = {
    id: orderId,
    title: "Model 3D budynku",
    service: "Modele 3D",
    description:
      "Potrzebuję wykonania modelu 3D zabytkowego budynku. Model ma służyć do celów dokumentacyjnych i prezentacyjnych. Wymagana wysoka jakość tekstur i dokładność odwzorowania detali architektonicznych.",
    location: "Kraków, ul. Testowa 45, 30-001 Kraków",
    deadline: "2024-02-20",
    deadlineType: "completion",
    client: "Anna Nowak",
    confirmedDate: "2024-02-10",
    createdDate: "2024-02-05",
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
            <p className="text-sm text-gray-500">
              Zleceniodawca: {order.client}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Potwierdzone
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
                <i className="ri-check-line mr-2"></i>
                Potwierdzone: {order.confirmedDate}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-check-line mr-2"></i>
                Utworzono: {order.createdDate}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Opis zlecenia</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryOrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const historyOrders = [
    {
      id: 4,
      title: "Chmura punktów terenu",
      service: "Chmura punktów",
      location: "Wrocław, ul. Polna 89, 50-001 Wrocław",
      completedDate: "2024-01-10",
      client: "GeoSurvey Sp. z o.o.",
      rating: 5,
      review: "Doskonała jakość pracy, terminowość i profesjonalizm.",
    },
    {
      id: 5,
      title: "Ortofotomapa lasu",
      service: "Ortofotomapa",
      location: "Zakopane, Las Państwowy, 34-500 Zakopane",
      completedDate: "2024-01-05",
      client: "Lasy Państwowe",
      rating: 4,
      review: "Bardzo dobra jakość, drobne uwagi do dokumentacji.",
    },
  ];

  if (selectedOrder) {
    return (
      <HistoryOrderDetails
        orderId={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Historia zleceń</h3>
        <span className="text-sm text-gray-500">
          {historyOrders.length} zakończonych
        </span>
      </div>

      {historyOrders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {order.title}
              </h4>
              <p className="text-sm text-gray-600">{order.service}</p>
              <p className="text-sm text-gray-500">
                Zleceniodawca: {order.client}
              </p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Zakończone
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              {order.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-calendar-check-line mr-2"></i>
              Zakończone: {order.completedDate}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Ocena klienta:
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`ri-star-${star <= order.rating ? "fill" : "line"} text-yellow-400`}
                  ></i>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({order.rating}/5)
              </span>
            </div>
            <p className="text-sm text-gray-700 italic">"{order.review}"</p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(order.id)}
            >
              Zobacz szczegóły
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryOrderDetails({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const order = {
    id: orderId,
    title: "Chmura punktów terenu",
    service: "Chmura punktów",
    description:
      "Wykonanie chmury punktów terenu o powierzchni 5 hektarów dla celów projektowych. Wymagana gęstość punktów minimum 500 pkt/m². Teren częściowo zadrzewiony, wymagana klasyfikacja punktów.",
    location: "Wrocław, ul. Polna 89, 50-001 Wrocław",
    completedDate: "2024-01-10",
    client: "GeoSurvey Sp. z o.o.",
    rating: 5,
    review: "Doskonała jakość pracy, terminowość i profesjonalizm.",
    createdDate: "2023-12-20",
    deadline: "2024-01-08",
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
            <p className="text-sm text-gray-500">
              Zleceniodawca: {order.client}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Zakończone
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
                Termin był: {order.deadline}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-check-line mr-2"></i>
                Zakończone: {order.completedDate}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-event-line mr-2"></i>
                Utworzono: {order.createdDate}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Opis zlecenia</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Ocena klienta</h4>
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`ri-star-${star <= order.rating ? "fill" : "line"} text-yellow-400 text-lg`}
                ></i>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({order.rating}/5)
            </span>
          </div>
          <p className="text-sm text-gray-700 italic">"{order.review}"</p>
        </div>
      </div>
    </div>
  );
}

function OperatorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "SkyTech Drones",
    rating: 4.8,
    completedJobs: 47,
    location: "Warszawa, ul. Nowogrodzka 15/23, 00-511 Warszawa",
    operatingRadius: 100,
    description:
      "Profesjonalne usługi dronowe z 5-letnim doświadczeniem. Specjalizujemy się w ortofotomapach i modelach 3D.",
    services: ["Ortofotomapa", "Modele 3D", "Inspekcje"],
    portfolio: [
      { title: "Ortofotomapa centrum miasta", file: "ortofoto_centrum.pdf" },
      { title: "Model 3D zabytkowego kościoła", file: "model_3d_kosciol.zip" },
    ],
  });

  const [editingServices, setEditingServices] = useState(false);
  const [newService, setNewService] = useState("");

  const availableServices = [
    "Ortofotomapa",
    "Numeryczne modele terenu",
    "Chmura punktów",
    "Modele 3D",
    "Scanning laserowy",
    "Inspekcje",
    "Monitoring",
    "Fotografia lotnicza",
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    setEditingServices(false);
  };

  const addService = (service: string) => {
    if (!profile.services.includes(service)) {
      setProfile({
        ...profile,
        services: [...profile.services, service],
      });
    }
  };

  const removeService = (serviceToRemove: string) => {
    setProfile({
      ...profile,
      services: profile.services.filter(
        (service) => service !== serviceToRemove,
      ),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Mój Profil</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
        >
          <i className="ri-edit-line mr-2"></i>
          {isEditing ? "Zapisz" : "Edytuj"}
        </Button>
      </div>

      {/* Profile Photo */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="ri-flight-takeoff-line text-white text-3xl"></i>
        </div>
        <h4 className="text-xl font-semibold text-gray-800">{profile.name}</h4>
        <div className="flex items-center justify-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`ri-star-${star <= Math.floor(profile.rating) ? "fill" : "line"} text-yellow-400`}
              ></i>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({profile.rating})</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {profile.completedJobs} zakończonych zleceń
        </p>
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokalizacja
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600 flex items-center">
              <i className="ri-map-pin-line mr-2"></i>
              {profile.location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Obszar działania
          </label>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={profile.operatingRadius}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    operatingRadius: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
              <span className="text-sm text-gray-500">km</span>
            </div>
          ) : (
            <p className="text-sm text-gray-600 flex items-center">
              <i className="ri-compass-line mr-2"></i>
              {profile.operatingRadius} km
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis
          </label>
          {isEditing ? (
            <textarea
              value={profile.description}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">{profile.description}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Świadczone usługi
            </label>
            {isEditing && (
              <button
                onClick={() => setEditingServices(!editingServices)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {editingServices ? "Zakończ edycję" : "Edytuj usługi"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {profile.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"
              >
                {service}
                {editingServices && (
                  <button
                    onClick={() => removeService(service)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                )}
              </span>
            ))}
          </div>

          {editingServices && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Dostępne usługi do dodania:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableServices
                  .filter((service) => !profile.services.includes(service))
                  .map((service, index) => (
                    <button
                      key={index}
                      onClick={() => addService(service)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      + {service}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio
          </label>
          <div className="space-y-2">
            {profile.portfolio.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <i className="ri-file-line text-gray-400 mr-2"></i>
                  <span className="text-sm text-gray-700">{item.title}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <i className="ri-download-line"></i>
                </button>
              </div>
            ))}
            {isEditing && (
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors">
                <i className="ri-add-line mr-2"></i>
                Dodaj plik do portfolio
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opinie klientów
          </label>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className="ri-star-fill text-yellow-400 text-xs"
                    ></i>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">Jan Kowalski</span>
              </div>
              <p className="text-xs text-gray-600">
                "Doskonała jakość pracy, terminowość i profesjonalizm."
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <i
                      key={star}
                      className="ri-star-fill text-yellow-400 text-xs"
                    ></i>
                  ))}
                  <i className="ri-star-line text-yellow-400 text-xs"></i>
                </div>
                <span className="text-xs text-gray-500 ml-2">Anna Nowak</span>
              </div>
              <p className="text-xs text-gray-600">
                "Bardzo dobra jakość, drobne uwagi do dokumentacji."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
