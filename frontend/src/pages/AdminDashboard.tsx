import { useState } from "react";
import {Button} from "@/components/ui/button";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "content">(
    "overview",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel Administratora
          </h1>
          <p className="text-gray-600">Zarządzaj platformą i użytkownikami</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-dashboard-line mr-2"></i>
                Przegląd
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "users"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-user-line mr-2"></i>
                Użytkownicy
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "content"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="ri-edit-line mr-2"></i>
                Treści strony
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "content" && <ContentTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const stats = [
    {
      title: "Zleceniodawcy",
      value: "847",
      change: "+12%",
      icon: "ri-user-line",
      color: "blue",
    },
    {
      title: "Zlecenia w tym miesiącu",
      value: "89",
      change: "+8%",
      icon: "ri-file-list-line",
      color: "green",
    },
    {
      title: "Operatorzy",
      value: "156",
      change: "+5%",
      icon: "ri-flight-takeoff-line",
      color: "purple",
    },
  ];

  const admins = [
    {
      id: 1,
      name: "Jan Kowalski",
    },
    {
      id: 2,
      name: "Anna Nowak",
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} vs poprzedni miesiąc
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}
              >
                <i
                  className={`${stat.icon} text-${stat.color}-600 text-xl`}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admins Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Administratorzy
          </h3>
          <Button onClick={() => setShowAddAdminModal(true)}>
            <i className="ri-add-line mr-2"></i>
            Dodaj nowego
          </Button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Administrator
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-orange-600 hover:text-orange-900 text-sm">
                          Zablokuj
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-sm">
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Dodaj nowego administratora
              </h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Jan Kowalski"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="jan.kowalski@admin.pl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło tymczasowe
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    alert("Administrator został dodany!");
                    setShowAddAdminModal(false);
                  }}
                >
                  Dodaj
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [selectedUserType, setSelectedUserType] = useState<
    "all" | "clients" | "operators"
  >("all");

  const users = [
    {
      id: 1,
      name: "Jan Kowalski",
      email: "jan.kowalski@email.com",
      role: "client",
      joinDate: "2024-01-15",
      status: "active",
      ordersCount: 5,
    },
    {
      id: 2,
      name: "SkyTech Drones",
      email: "contact@skytech.com",
      role: "operator",
      joinDate: "2023-12-10",
      status: "active",
      ordersCount: 23,
    },
    {
      id: 3,
      name: "Anna Nowak",
      email: "anna.nowak@email.com",
      role: "client",
      joinDate: "2024-01-20",
      status: "active",
      ordersCount: 2,
    },
    {
      id: 4,
      name: "AerialPro",
      email: "info@aerialpro.pl",
      role: "operator",
      joinDate: "2023-11-05",
      status: "inactive",
      ordersCount: 45,
    },
  ];

  const filteredUsers = users.filter((user) => {
    if (selectedUserType === "all") return true;
    if (selectedUserType === "clients") return user.role === "client";
    if (selectedUserType === "operators") return user.role === "operator";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setSelectedUserType("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedUserType === "all"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Wszyscy ({users.length})
        </button>
        <button
          onClick={() => setSelectedUserType("clients")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedUserType === "clients"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Klienci ({users.filter((u) => u.role === "client").length})
        </button>
        <button
          onClick={() => setSelectedUserType("operators")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedUserType === "operators"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Operatorzy ({users.filter((u) => u.role === "operator").length})
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data dołączenia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zlecenia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "client"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "client" ? "Klient" : "Operator"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Aktywny" : "Nieaktywny"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.ordersCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900">
                      {user.status === "active" ? "Zablokuj" : "Aktywuj"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [contentData, setContentData] = useState({
    heroTitle: "Połącz się z profesjonalnymi operatorami dronów",
    heroSubtitle:
      "Platforma łącząca zleceniodawców potrzebujących usług dronowych z doświadczonymi operatorami. Ortofotomapy, modele 3D, inspekcje i wiele więcej.",
    servicesTitle: "Dostępne Usługi",
    servicesSubtitle:
      "Szeroka gama profesjonalnych usług dronowych wykonywanych przez certyfikowanych operatorów",
    howItWorksTitle: "Jak to działa?",
    howItWorksSubtitle: "Prosty proces od zlecenia do realizacji",
    ctaTitle: "Gotowy na start?",
    ctaSubtitle:
      "Dołącz do naszej platformy już dziś i skorzystaj z profesjonalnych usług dronowych",
    contactEmail: "kontakt@droneplatform.pl",
    contactPhone: "+48 600 123 456",
    contactAddress: "Warszawa, Polska",
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Treści zostały zaktualizowane!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Edycja treści strony głównej
          </h3>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <i className="ri-edit-line mr-2"></i>
              Edytuj
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSave}>
                <i className="ri-save-line mr-2"></i>
                Zapisz
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja główna (Hero)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł główny
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.heroTitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        heroTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.heroTitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Podtytuł
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.heroSubtitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        heroSubtitle: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.heroSubtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja usług
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.servicesTitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        servicesTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.servicesTitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opis sekcji
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.servicesSubtitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        servicesSubtitle: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.servicesSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* How it works Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja "Jak to działa"
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.howItWorksTitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        howItWorksTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.howItWorksTitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opis sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.howItWorksSubtitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        howItWorksSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.howItWorksSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja CTA
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.ctaTitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        ctaTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.ctaTitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Podtytuł
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.ctaSubtitle}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        ctaSubtitle: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.ctaSubtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Dane kontaktowe
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={contentData.contactEmail}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        contactEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.contactEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Telefon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={contentData.contactPhone}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        contactPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.contactPhone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Adres
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.contactAddress}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        contactAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.contactAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
