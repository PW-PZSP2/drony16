import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LayoutDashboard, FileText, Drone } from "lucide-react";
import backendClient from "@/utils/backend_client";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
            <p className="text-gray-500 mt-1">Zarządzaj platformą i użytkownikami</p>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-0 gap-4 h-auto flex-wrap">
              <TabsTrigger
                value="overview"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Przegląd
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                Użytkownicy
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                Treści
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <UsersTab />
            </TabsContent>
            <TabsContent value="content" className="mt-4">
              <ContentTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function OverviewTab() {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    phone_number: "",
    localisation: "",
    area: "",
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clients: { total: 0, new: 0 },
    operators: { total: 0, new: 0 },
    orders: { total: 0, new: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, operatorsRes, ordersRes] = await Promise.all([
          backendClient.get("/admins/stats/clients"),
          backendClient.get("/admins/stats/operators"),
          backendClient.get("/admins/stats/orders"),
        ]);

        // Helper to handle both axios response object and direct data return
        const getData = (res: any) => res?.data || res || {};

        const clientsData = getData(clientsRes);
        const operatorsData = getData(operatorsRes);
        const ordersData = getData(ordersRes);

        console.log("Dashboard stats raw:", { clientsData, operatorsData, ordersData });

        setStats({
          clients: {
            total: clientsData.total_clients || 0,
            new: clientsData.new_this_month || 0,
          },
          operators: {
            total: operatorsData.total_operators || 0,
            new: operatorsData.new_this_month || 0,
          },
          orders: {
            total: ordersData.total_orders || 0,
            new: ordersData.new_this_month || 0,
          },
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Zleceniodawcy",
      value: stats.clients.total,
      newValue: stats.clients.new,
      icon: <Users className="text-blue-600 h-6 w-6" />,
      bgClass: "bg-blue-100",
    },
    {
      title: "Operatorzy",
      value: stats.operators.total,
      newValue: stats.operators.new,
      icon: <Drone className="text-purple-600 h-6 w-6" />,
      bgClass: "bg-purple-100",
    },
    {
      title: "Zlecenia",
      value: stats.orders.total,
      newValue: stats.orders.new,
      icon: <FileText className="text-green-600 h-6 w-6" />,
      bgClass: "bg-green-100",
    },
  ];

  const [admins, setAdmins] = useState<any[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setAdminsLoading(true);
      try {
        const res = await backendClient.get("/admins/list");
        setAdmins(res.data || []);
      } catch (err) {
        console.error("Failed to fetch admins", err);
      } finally {
        setAdminsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleBlockAdmin = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/block/${userId}`);
      setAdmins(admins.map((a) => a.user_id === userId ? { ...a, is_blocked: "1" } : a));
    } catch (err) {
      console.error("Failed to block admin", err);
    }
  };

  const handleUnblockAdmin = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/unblock/${userId}`);
      setAdmins(admins.map((a) => a.user_id === userId ? { ...a, is_blocked: "0" } : a));
    } catch (err) {
      console.error("Failed to unblock admin", err);
    }
  };

  const handleDeleteAdmin = async (userId: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego administratora?")) {
      try {
        await backendClient.delete(`/admins/remove/${userId}`);
        setAdmins(admins.filter((a) => a.user_id !== userId));
      } catch (err) {
        console.error("Failed to delete admin", err);
      }
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before sending
    if (!adminFormData.user_name.trim()) {
      alert("Nazwa użytkownika nie może być pusta");
      return;
    }
    if (!adminFormData.email.trim()) {
      alert("Email nie może być pusty");
      return;
    }
    if (!adminFormData.password.trim()) {
      alert("Hasło nie może być puste");
      return;
    }

    // Clean up empty fields
    const payload = {
      user_name: adminFormData.user_name.trim(),
      email: adminFormData.email.trim(),
      password: adminFormData.password.trim(),
      phone_number: adminFormData.phone_number.trim() || "",
      localisation: adminFormData.localisation?.trim() || null,
      area: adminFormData.area || null,
    };

    console.log("Sending admin data:", payload);

    setCreatingAdmin(true);
    try {
      await backendClient.post("/admins/create", payload);
      // Refetch admins list to get fresh data
      const res = await backendClient.get("/admins/list");
      setAdmins(res.data || []);
      setAdminFormData({ user_name: "", email: "", password: "", phone_number: "", localisation: "", area: "" });
      setShowAddAdminModal(false);
      alert("Administrator został dodany!");
    } catch (err: any) {
      console.error("Failed to create admin", err);
      const errorMsg = err.response?.data?.detail || JSON.stringify(err.response?.data) || "Błąd przy tworzeniu administratora";
      alert(errorMsg);
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Spinner className="h-5 w-5 text-gray-500" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p
                  className={`text-sm ${stat.newValue > 0 ? "text-green-600" : "text-gray-500"
                    }`}
                >
                  {loading
                    ? ""
                    : stat.newValue > 0
                      ? `+${stat.newValue} w tym miesiącu`
                      : "0 w tym miesiącu"}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgClass}`}
              >
                {stat.icon}
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
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2" onClick={() => setShowAddAdminModal(true)}>
            <i className="ri-add-line"></i>
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
                {adminsLoading ? (
                  <tr>
                    <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                      Ładuję administratorów...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                      Brak administratorów
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr
                      key={admin.user_id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {admin.user_name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {admin.is_blocked === "1" ? (
                            <button
                              onClick={() => handleUnblockAdmin(admin.user_id)}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Odblokuj
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockAdmin(admin.user_id)}
                              className="text-orange-600 hover:text-orange-900 text-sm"
                            >
                              Zablokuj
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAdmin(admin.user_id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

            <form className="space-y-4" onSubmit={handleCreateAdmin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  value={adminFormData.user_name}
                  onChange={(e) => setAdminFormData({ ...adminFormData, user_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder=""
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder=""
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło
                </label>
                <input
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder=""
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numer telefonu
                </label>
                <input
                  type="tel"
                  value={adminFormData.phone_number}
                  onChange={(e) => setAdminFormData({ ...adminFormData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder=""
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
                  disabled={creatingAdmin}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {creatingAdmin ? "Dodaję..." : "Dodaj"}
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await backendClient.get("/admins/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/block/${userId}`);
      setUsers(users.map((u) => u.user_id === userId ? { ...u, status: "Zablokowany" } : u));
    } catch (err) {
      console.error("Failed to block user", err);
      alert("Błąd przy blokowaniu użytkownika");
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/unblock/${userId}`);
      setUsers(users.map((u) => u.user_id === userId ? { ...u, status: "Aktywny" } : u));
    } catch (err) {
      console.error("Failed to unblock user", err);
      alert("Błąd przy odblokowaniu użytkownika");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (selectedUserType === "all") return true;
    if (selectedUserType === "clients") return user.type === "Klient";
    if (selectedUserType === "operators") return user.type === "Operator";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setSelectedUserType("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedUserType === "all"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          Wszyscy ({users.length})
        </button>
        <button
          onClick={() => setSelectedUserType("clients")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedUserType === "clients"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          Klienci ({users.filter((u) => u.type === "Klient").length})
        </button>
        <button
          onClick={() => setSelectedUserType("operators")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedUserType === "operators"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          Operatorzy ({users.filter((u) => u.type === "Operator").length})
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
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    <Spinner className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Brak użytkowników
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.user_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${user.type === "Klient"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.creation_date).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === "Aktywny"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === "Aktywny" ? (
                        <button
                          onClick={() => handleBlockUser(user.user_id)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Zablokuj
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user.user_id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Odblokuj
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
