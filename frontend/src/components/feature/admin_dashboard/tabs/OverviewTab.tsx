import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, FileText, Drone } from "lucide-react";
import backendClient from "@/utils/backend_client";
import { Spinner } from "@/components/ui/spinner";

export function OverviewTab() {
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

        const getData = (res: any) => res?.data || res || {};

        const clientsData = getData(clientsRes);
        const operatorsData = getData(operatorsRes);
        const ordersData = getData(ordersRes);

        console.log("Dashboard stats raw:", {
          clientsData,
          operatorsData,
          ordersData,
        });

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
      setAdmins(
        admins.map((a) =>
          a.user_id === userId ? { ...a, is_blocked: "1" } : a,
        ),
      );
    } catch (err) {
      console.error("Failed to block admin", err);
    }
  };

  const handleUnblockAdmin = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/unblock/${userId}`);
      setAdmins(
        admins.map((a) =>
          a.user_id === userId ? { ...a, is_blocked: "0" } : a,
        ),
      );
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
      const res = await backendClient.get("/admins/list");
      setAdmins(res.data || []);
      setAdminFormData({
        user_name: "",
        email: "",
        password: "",
        phone_number: "",
        localisation: "",
        area: "",
      });
      setShowAddAdminModal(false);
      alert("Administrator został dodany!");
    } catch (err: any) {
      console.error("Failed to create admin", err);
      const errorMsg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Błąd przy tworzeniu administratora";
      alert(errorMsg);
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Spinner className="h-5 w-5 text-gray-500" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p
                  className={`text-sm ${
                    stat.newValue > 0 ? "text-green-600" : "text-gray-500"
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

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Administratorzy
          </h3>
          <Button
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            onClick={() => setShowAddAdminModal(true)}
          >
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
                    <td
                      colSpan={2}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      Ładuję administratorów...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 px-4 text-center text-gray-500"
                    >
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
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      user_name: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      email: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      password: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      phone_number: e.target.value,
                    })
                  }
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
