import { useState, useEffect } from "react";
import backendClient from "@/utils/backend_client";
import { Spinner } from "@/components/ui/spinner";

export function UsersTab() {
  const [selectedUserType, setSelectedUserType] = useState<
    "all" | "clients" | "operators"
  >("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const [clientsRes, operatorsRes] = await Promise.all([
          backendClient.get("/admins/stat_clients"),
          backendClient.get("/admins/stat_operators"),
        ]);
        const allUsers = [
          ...(clientsRes.data || []),
          ...(operatorsRes.data || []),
        ];
        setUsers(allUsers);
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
      setUsers(
        users.map((u) =>
          u.user_id === userId ? { ...u, status: "Zablokowany" } : u,
        ),
      );
    } catch (err) {
      console.error("Failed to block user", err);
      alert("Błąd przy blokowaniu użytkownika");
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await backendClient.patch(`/admins/unblock/${userId}`);
      setUsers(
        users.map((u) =>
          u.user_id === userId ? { ...u, status: "Aktywny" } : u,
        ),
      );
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
          Klienci ({users.filter((u) => u.type === "Klient").length})
        </button>
        <button
          onClick={() => setSelectedUserType("operators")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedUserType === "operators"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Operatorzy ({users.filter((u) => u.type === "Operator").length})
        </button>
      </div>

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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <Spinner className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
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
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.type === "Klient"
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "Aktywny"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.orders_count || 0}
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
