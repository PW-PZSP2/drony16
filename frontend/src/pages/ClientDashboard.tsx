import { useState } from "react";

import CreateOrderTab from "@/components/feature/client_dashboard/tabs/CreateOrderTab";
import SelectOperatorTab from "@/components/feature/client_dashboard/tabs/SelectedOperatorTab";
import CompletedOrdersTab from "@/components/feature/client_dashboard/tabs/CompletedOrdersTab";

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






